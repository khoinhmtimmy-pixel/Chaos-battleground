// Offline harness for js/daily.js: date determinism, score recording, sorting,
// corrupted/invalid stored data, dedup, and the start/finish glue contract.
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
const dailySrc = fs.readFileSync(path.join(root, 'js/daily.js'), 'utf8');
const gameSrc = fs.readFileSync(path.join(root, 'js', 'game.js'), 'utf8');
const metaSrc = fs.readFileSync(path.join(root, 'js', 'meta.js'), 'utf8');

const store = {};
const makeLS = () => ({
  getItem: k => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: k => { delete store[k]; }
});

let fail = 0;
const ok = (name, cond, extra) => { console.log((cond ? '  ok  ' : '  FAIL') + '  ' + name + (extra ? '  (' + extra + ')' : '')); if (!cond) fail++; };

// minimal roster stubs (mirrors data.js shapes used by the challenge generator)
const CH = [];
for (let i = 0; i < 40; i++) CH.push({ n: 'Hero' + i, hp: 100 + i, sp: 20, boss: i > 35, foe: false });
const NORM = CH.map((c, i) => i).filter(i => !CH[i].boss && !CH[i].foe);
const MAPS = [];
for (let i = 0; i < 9; i++) MAPS.push({ n: 'Map' + i, pil: [] });
const SMALL = MAPS.map((m, i) => i);

let started = null;
function boot(extra) {
  const sandbox = Object.assign({
    localStorage: makeLS(), console, Math, Object, JSON, Date, isFinite,
    CH, NORM, MAPS, SMALL,
    esc: s => String(s),
    fmt: n => String(n),
    t: k => k,
    startRun: cfg => { started = cfg; return cfg; }
  }, extra || {});
  const ctx = vm.createContext(sandbox);
  vm.runInContext(dailySrc, ctx);
  return ctx;
}

// ===== 1. UTC date-key policy ======================================
{
  const ctx = boot();
  ok('utc date key format', /^\d{4}-\d{2}-\d{2}$/.test(ctx.getUtcDateKey('2026-10-18T23:30:00Z')));
  ok('utc key is stable for a given instant',
    ctx.getUtcDateKey('2026-10-18T23:30:00Z') === '2026-10-18' &&
    ctx.getUtcDateKey('2026-10-18T00:00:01Z') === '2026-10-18');
  ok('explicit dateKey string is accepted verbatim', ctx.getDailyChallenge('2026-01-05').dateKey === '2026-01-05');
}

// ===== 2. Date-based determinism ===================================
{
  const ctx = boot();
  const a = ctx.getDailyChallenge('2026-10-18'), b = ctx.getDailyChallenge('2026-10-18');
  ok('same date -> same hero', a.heroIndex === b.heroIndex);
  ok('same date -> same map', a.mapIndex === b.mapIndex);
  ok('same date -> same modifier', a.modifier.id === b.modifier.id);
  ok('same date -> same title', a.title === b.title);
  // separate session (fresh context) reproduces the same config
  const ctx2 = boot();
  const c = ctx2.getDailyChallenge('2026-10-18');
  ok('new session reproduces config', c.heroIndex === a.heroIndex && c.mapIndex === a.mapIndex && c.modifier.id === a.modifier.id);
  // different dates differ somewhere across a week
  const seen = new Set();
  for (let d = 1; d <= 7; d++) {
    const k = '2026-10-' + String(d).padStart(2, '0');
    const ch = ctx.getDailyChallenge(k);
    seen.add(ch.heroIndex + '|' + ch.mapIndex + '|' + ch.modifier.id + '|' + ch.title);
  }
  ok('different dates generate different challenges', seen.size > 1, seen.size + ' unique of 7');
  ok('challenge fields are resolved names', typeof a.heroName === 'string' && typeof a.mapName === 'string');
  ok('hero comes from playable roster', NORM.includes(a.heroIndex));
}

// ===== 3. Score recording & sorting ================================
{
  for (const k in store) delete store[k];
  const ctx = boot();
  ctx.recordDailyRun({ dateKey: '2026-10-18', score: 100, time: 60, kills: 5, floor: 2 });
  ctx.recordDailyRun({ dateKey: '2026-10-18', score: 300, time: 90, kills: 9, floor: 4 });
  ctx.recordDailyRun({ dateKey: '2026-10-17', score: 200, time: 120, kills: 7, floor: 3 });
  const all = ctx.getDailyLeaderboard();
  ok('three runs stored', all.length === 3, all.length);
  ok('sorted by score desc', all[0].score === 300 && all[1].score === 200 && all[2].score === 100);
  const day = ctx.getDailyLeaderboard('2026-10-18');
  ok('date filter works', day.length === 2 && day.every(r => r.dateKey === '2026-10-18'));
  ok('today best helper', ctx.getTodayDailyBest('2026-10-18').score === 300);
  // tie-break: equal score -> time desc -> kills desc
  ctx.recordDailyRun({ dateKey: '2026-10-16', score: 300, time: 100, kills: 3, timestamp: 9001 });
  ctx.recordDailyRun({ dateKey: '2026-10-16', score: 300, time: 150, kills: 1, timestamp: 9002 });
  const t = ctx.getDailyLeaderboard('2026-10-16');
  ok('tie broken by time desc', t.length === 2 && t[0].time === 150 && t[1].time === 100);
}

// ===== 4. Dedup ========================================
{
  const ctx = boot();
  const before = ctx.getDailyLeaderboard().length;
  const run = { dateKey: '2026-10-18', score: 500, time: 80, kills: 4, timestamp: 12345, id: 'same-run' };
  ctx.recordDailyRun(run);
  ctx.recordDailyRun(run);
  ok('same id recorded once', ctx.getDailyLeaderboard().filter(r => r.id === 'same-run').length === 1);
}

// ===== 5. Corrupted / missing / invalid stored data ================
{
  for (const k in store) delete store[k];
  let ctx = boot();
  ok('missing storage -> empty leaderboard', ctx.getDailyLeaderboard().length === 0);

  store['cb_daily_scores'] = '{not json';
  ctx = boot();
  ok('corrupt JSON -> graceful empty', ctx.getDailyLeaderboard().length === 0);
  ctx.recordDailyRun({ dateKey: '2026-10-18', score: 10, time: 1, kills: 1 });
  ok('can record after corruption', ctx.getDailyLeaderboard().length === 1);

  store['cb_daily_scores'] = JSON.stringify({ v: 1, runs: [null, 'x', 42, { nope: 1 }, { dateKey: 'bad', score: 5 }, { dateKey: '2026-10-18', score: -50, time: 'soon', kills: Infinity, floor: 0 }] });
  ctx = boot();
  const cleaned = ctx.getDailyLeaderboard();
  ok('invalid entries dropped or clamped', cleaned.length === 1 && cleaned[0].score === 0 && cleaned[0].time === 0 && cleaned[0].kills === 0 && cleaned[0].floor === 1, JSON.stringify(cleaned[0] || {}));

  store['cb_daily_scores'] = JSON.stringify({ runs: 'not-an-array' });
  ctx = boot();
  ok('non-array runs -> empty', ctx.getDailyLeaderboard().length === 0);
}

// ===== 6. Storage is bounded =======================================
{
  for (const k in store) delete store[k];
  const ctx = boot();
  for (let i = 0; i < 80; i++) ctx.recordDailyRun({ dateKey: '2026-10-18', score: i, time: i, kills: i, timestamp: i });
  ok('leaderboard capped at 50', ctx.getDailyLeaderboard().length === 50, ctx.getDailyLeaderboard().length);
}

// ===== 7. Start/finish glue ========================================
{
  for (const k in store) delete store[k];
  const ctx = boot();
  const cfg = ctx.startDailyRun();
  ok('startDailyRun launches a flagged raid', cfg && cfg.mode === 'raid' && cfg.daily === 1);
  ok('cfg carries challenge hero/map', cfg.hero === ctx.getDailyChallenge(cfg.dateKey).heroIndex && cfg.map === ctx.getDailyChallenge(cfg.dateKey).mapIndex);
  ok('cfg carries modifier + gold multipliers', typeof cfg.spMul === 'number' && typeof cfg.dmMul === 'number' && typeof cfg.hpMul === 'number' && cfg.goldMul === 1.5);

  ctx.dailyRunReset();
  ctx.dailyFinishRun({ win: true, floor: 4, room: 3, kills: 22, gold: 120, time: 300, score: 640 });
  const lb = ctx.getDailyLeaderboard();
  ok('finish records the run', lb.length === 1 && lb[0].score === 640 && lb[0].kills === 22);
  ctx.dailyFinishRun({ win: true, floor: 4, room: 3, kills: 22, gold: 120, time: 300, score: 640 });
  ok('double finish does not duplicate', ctx.getDailyLeaderboard().length === 1);
  ctx.dailyRunReset();
  ctx.dailyFinishRun({ win: false, floor: 1, room: 2, kills: 3, gold: 10, time: 60, score: 80 });
  ok('reset allows a second run to record', ctx.getDailyLeaderboard().length === 2);
}

// ===== 8. Ordinary matches stay unaffected (source assertions) =====
{
  ok('game.js records daily runs only when flagged', /if\(r\.daily&&typeof dailyFinishRun=='function'\)/.test(gameSrc));
  ok('game.js applies challenge hero override', /raidMode&&raidMode\.hero!=null/.test(gameSrc));
  ok('game.js applies challenge map override', /raidMode&&raidMode\.map!=null/.test(gameSrc));
  ok('game.js applies daily stat multipliers', /cfg\.spMul|cfg&&cfg\.spMul/.test(gameSrc) && /cfg&&cfg\.dmMul/.test(gameSrc));
  ok('meta.js has a dailyRun action', /dailyRun\(\)\{/.test(metaSrc));
  ok('meta.js renders the challenge card', /chalCard/.test(metaSrc));
}

console.log(fail ? '\n' + fail + ' CHECK(S) FAILED' : '\nall daily-challenge checks passed');
process.exit(fail ? 1 : 0);
