// Offline harness for js/prog.js. Tests persistence, fresh profiles, completed matches,
// restart (reload), dedup, validation and corrupted-save recovery.
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
const progSrc = fs.readFileSync(path.join(root, 'js/prog.js'), 'utf8');

// shared in-memory localStorage so "reload" keeps data
const store = {};
const makeLS = () => ({
  getItem: k => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: k => { delete store[k]; }
});

let fail = 0;
const ok = (name, cond, extra) => { console.log((cond ? '  ok  ' : '  FAIL') + '  ' + name + (extra ? '  (' + extra + ')' : '')); if (!cond) fail++; };

function boot() {
  const sandbox = {
    localStorage: makeLS(),
    S: { gold: 0 },
    persist: () => {},
    toast: () => {},
    t: (k) => k,
    Math, Object, JSON, console, Date
  };
  const ctx = vm.createContext(sandbox);
  vm.runInContext(progSrc, ctx);
  return ctx;
}

// ===== 1. Fresh profile ============================================
{
  for (const k in store) delete store[k];
  const ctx = boot();
  ok('fresh profile: matches=0', ctx.progState().matches === 0);
  ok('fresh profile: achievements empty', ctx.progState().achievements.length === 0);
  ok('fresh profile: badges empty', ctx.progState().badges.length === 0);
}

// ===== 2. Completed match updates stats & unlocks achievement =======
{
  for (const k in store) delete store[k];
  const ctx = boot();
  ctx.progRecordMatch({ mode: 'stage', win: true, kills: 5, time: 120, score: 100, bosses: 1, floor: 3, stage: 5 });
  ok('match recorded: matches=1', ctx.progState().matches === 1);
  ok('match recorded: wins=1', ctx.progState().wins === 1);
  ok('match recorded: kills=5', ctx.progState().kills === 5);
  ok('match recorded: bosses=1', ctx.progState().bosses === 1);
  ok('first_blood unlocked', ctx.progState().achievements.includes('first_blood'));
  ok('boss_slayer unlocked', ctx.progState().achievements.includes('boss_slayer'));
  ok('badge granted', ctx.progState().badges.includes('first_blood'));
}

// ===== 3. Persistence survives a reload =============================
{
  // store already has data from step 2
  const ctx2 = boot();
  ok('reload: matches persist', ctx2.progState().matches === 1);
  ok('reload: wins persist', ctx2.progState().wins === 1);
  ok('reload: achievements persist', ctx2.progState().achievements.includes('first_blood'));
  ok('reload: badges persist', ctx2.progState().badges.includes('first_blood'));
}

// ===== 4. Dedup: same matchId processed once =======================
{
  for (const k in store) delete store[k];
  const ctx = boot();
  const mid = 'stage|120|5|dedup';
  ctx.progRecordMatch({ mode: 'stage', win: true, kills: 5, time: 120, score: 100, matchId: mid });
  ctx.progRecordMatch({ mode: 'stage', win: true, kills: 5, time: 120, score: 100, matchId: mid });
  ok('dedup: matches stays 1', ctx.progState().matches === 1, 'matches=' + ctx.progState().matches);
}

// ===== 5. Multiple matches accumulate ===============================
{
  for (const k in store) delete store[k];
  const ctx = boot();
  ctx.progRecordMatch({ mode: 'arena', win: true, kills: 2, time: 60, score: 2 });
  ctx.progRecordMatch({ mode: 'arena', win: false, kills: 1, time: 30, score: 1 });
  ctx.progRecordMatch({ mode: 'raid', win: true, kills: 50, time: 400, score: 10, floor: 5, bosses: 1 });
  ok('accumulate: matches=3', ctx.progState().matches === 3);
  ok('accumulate: wins=2', ctx.progState().wins === 2);
  ok('accumulate: kills=53', ctx.progState().kills === 53);
  ok('accumulate: arenaWins=1', ctx.progState().arenaWins === 1);
  ok('accumulate: bestFloor=5', ctx.progState().bestFloor === 5);
  ok('accumulate: bestSurvival=400', ctx.progState().bestSurvival === 400);
  ok('slaughter unlocked', ctx.progState().challenges.includes('slaughter'));
  ok('deep_diver unlocked', ctx.progState().challenges.includes('deep_diver'));
}

// ===== 6. Corrupted save recovers gracefully ========================
{
  for (const k in store) delete store[k];
  store['cb_prog'] = '{not json';
  const ctx = boot();
  ok('corrupt: resets to defaults', ctx.progState().matches === 0 && ctx.progState().achievements.length === 0);
  // ensure it can still record
  ctx.progRecordMatch({ mode: 'stage', win: true, kills: 1, time: 10, score: 1 });
  ok('corrupt: can record after recovery', ctx.progState().matches === 1);
}
// ===== 7. Outdated (missing fields) migrates ========================
{
  for (const k in store) delete store[k];
  store['cb_prog'] = JSON.stringify({ matches: 5, wins: 2 });
  const ctx = boot();
  ok('outdated: keeps matches', ctx.progState().matches === 5);
  ok('outdated: keeps wins', ctx.progState().wins === 2);
  ok('outdated: fills defaults (kills=0)', ctx.progState().kills === 0);
  ok('outdated: achievements array', Array.isArray(ctx.progState().achievements));
}

// ===== 8. Invalid values are clamped/ignored =======================
{
  for (const k in store) delete store[k];
  store['cb_prog'] = JSON.stringify({ matches: -5, wins: 'abc', kills: 1e20, achievements: ['x', 42, null], badges: 'nope' });
  const ctx = boot();
  ok('invalid: matches clamped to 0', ctx.progState().matches === 0);
  ok('invalid: wins clamped to 0', ctx.progState().wins === 0);
  ok('invalid: kills clamped', ctx.progState().kills === 1e9);
  ok('invalid: achievements filtered', ctx.progState().achievements.length === 1 && ctx.progState().achievements[0] === 'x');
  ok('invalid: badges reset to array', Array.isArray(ctx.progState().badges) && ctx.progState().badges.length === 0);
}

// ===== 9. Best score / survival are max, not overwrite ==============
{
  for (const k in store) delete store[k];
  const ctx = boot();
  ctx.progRecordMatch({ mode: 'stage', win: true, kills: 1, time: 100, score: 50 });
  ctx.progRecordMatch({ mode: 'stage', win: true, kills: 1, time: 50, score: 10 });
  ok('bestSurvival keeps max', ctx.progState().bestSurvival === 100);
  ok('bestScore keeps max', ctx.progState().bestScore === 50);
}

console.log(fail ? '\n' + fail + ' CHECK(S) FAILED' : '\nall progression checks passed');
process.exit(fail ? 1 : 0);
