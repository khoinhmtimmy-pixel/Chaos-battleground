// ============================================================================================
// Daily Challenge & Local Leaderboard System
//
// Rules & deterministic generation are kept separate from UI rendering.
// Timezone Policy: UTC Date Key (YYYY-MM-DD) to ensure identical challenge parameters
// across any timezone on the same date.
// Storage: LocalStorage ('cb_daily_scores'). Completely local, validated on load,
// resilient to corrupted/missing records.
// ============================================================================================

const DAILY_STORAGE_KEY = 'cb_daily_scores';
const DAILY_DATA_VERSION = 1;

// ---- UTC Date Key Helper -------------------------------------------------------------------
function getUtcDateKey(dateInput) {
  const d = dateInput ? new Date(dateInput) : new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// ---- Seeded PRNG (Mulberry32) --------------------------------------------------------------
function hashDateKey(dateKey) {
  let hash = 2166136261;
  for (let i = 0; i < dateKey.length; i++) {
    hash ^= dateKey.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createPrng(seed) {
  let s = seed ^ 0xDEADBEEF;
  return function() {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 8), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---- Challenge Modifiers Pool -------------------------------------------------------------
const DAILY_MODIFIERS = [
  { id: 'overclock', name: 'Overclocked', desc: '+25% Speed, +20% Enemy Speed', spMul: 1.25, enemySpMul: 1.2 },
  { id: 'glass_cannon', name: 'Glass Cannon', desc: '+50% Damage, -30% Max HP', dmMul: 1.5, hpMul: 0.7 },
  { id: 'heavy_weight', name: 'Titan Armor', desc: '+40% Max HP, -15% Speed', hpMul: 1.4, spMul: 0.85 },
  { id: 'vampiric', name: 'Vampiric Pact', desc: '+10% Lifesteal, +25% Enemy Damage', lsAdd: 0.10, enemyDmMul: 1.25 },
  { id: 'berserk', name: 'Berserker', desc: '+35% Damage, +20% CDR', dmMul: 1.35, cdMul: 1.2 }
];

const DAILY_TITLES_PREFIX = ['Overclocked', 'Abyssal', 'Celestial', 'Shattered', 'Blazing', 'Frozen', 'Shadow', 'Radiant'];
const DAILY_TITLES_SUFFIX = ['Onslaught', 'Gauntlet', 'Trial', 'Crusade', 'Rampage', 'Storm', 'Reckoning', 'Bastion'];

// ---- Deterministic Challenge Generator ----------------------------------------------------
function getDailyChallenge(dateInput) {
  const dateKey = typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput) 
    ? dateInput 
    : getUtcDateKey(dateInput);

  const rand = createPrng(hashDateKey(dateKey));

  // Pick deterministic Hero index from standard playable roster NORM
  const normIndices = (typeof NORM !== 'undefined' && Array.isArray(NORM) && NORM.length) ? NORM : [0, 1, 2, 3];
  const heroIndex = normIndices[Math.floor(rand() * normIndices.length)];

  // Pick deterministic Map index from SMALL maps
  const smallMaps = (typeof SMALL !== 'undefined' && Array.isArray(SMALL) && SMALL.length) ? SMALL : [0, 1, 2];
  const mapIndex = smallMaps[Math.floor(rand() * smallMaps.length)];

  // Pick deterministic modifier
  const modifier = DAILY_MODIFIERS[Math.floor(rand() * DAILY_MODIFIERS.length)];

  // Pick deterministic title
  const prefix = DAILY_TITLES_PREFIX[Math.floor(rand() * DAILY_TITLES_PREFIX.length)];
  const suffix = DAILY_TITLES_SUFFIX[Math.floor(rand() * DAILY_TITLES_SUFFIX.length)];
  const title = `${prefix} ${suffix}`;

  return {
    dateKey,
    heroIndex,
    heroName: (typeof CH !== 'undefined' && CH[heroIndex]) ? CH[heroIndex].n : 'Hero',
    mapIndex,
    mapName: (typeof MAPS !== 'undefined' && MAPS[mapIndex]) ? MAPS[mapIndex].n : 'Arena',
    modifier,
    title,
    goldMultiplier: 1.5
  };
}

// ---- Storage & Recovery --------------------------------------------------------------------
const DEFAULT_SCORES_DATA = () => ({ v: DAILY_DATA_VERSION, runs: [] });

function dailyLoadScores() {
  try {
    const raw = localStorage.getItem(DAILY_STORAGE_KEY);
    if (!raw) return DEFAULT_SCORES_DATA();
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object') return DEFAULT_SCORES_DATA();

    const runs = Array.isArray(data.runs) ? data.runs : [];
    const validRuns = [];

    for (const r of runs) {
      if (!r || typeof r !== 'object') continue;

      const dateKey = typeof r.dateKey === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(r.dateKey) ? r.dateKey : null;
      if (!dateKey) continue;

      const score = typeof r.score === 'number' && isFinite(r.score) ? Math.max(0, Math.floor(r.score)) : 0;
      const time = typeof r.time === 'number' && isFinite(r.time) ? Math.max(0, Math.floor(r.time)) : 0;
      const kills = typeof r.kills === 'number' && isFinite(r.kills) ? Math.max(0, Math.floor(r.kills)) : 0;
      const floor = typeof r.floor === 'number' && isFinite(r.floor) ? Math.max(1, Math.floor(r.floor)) : 1;
      const timestamp = typeof r.timestamp === 'number' && isFinite(r.timestamp) ? r.timestamp : Date.now();
      const hero = typeof r.hero === 'string' ? r.hero.slice(0, 20) : 'Hero';
      const map = typeof r.map === 'string' ? r.map.slice(0, 20) : 'Arena';
      const modifier = typeof r.modifier === 'string' ? r.modifier.slice(0, 30) : 'Standard';
      const id = typeof r.id === 'string' ? r.id : `${dateKey}_${timestamp}_${Math.floor(Math.random()*10000)}`;

      validRuns.push({
        id,
        dateKey,
        timestamp,
        hero,
        map,
        modifier,
        score,
        time,
        kills,
        floor,
        win: !!r.win
      });
    }

    // Sort leaderboard: score DESC -> time DESC -> kills DESC
    validRuns.sort((a, b) => b.score - a.score || b.time - a.time || b.kills - a.kills);

    // Bound max entries stored locally
    const boundedRuns = validRuns.slice(0, 50);

    return { v: DAILY_DATA_VERSION, runs: boundedRuns };
  } catch (err) {
    return DEFAULT_SCORES_DATA();
  }
}

function dailySaveScores(data) {
  try {
    const payload = {
      v: DAILY_DATA_VERSION,
      runs: Array.isArray(data.runs) ? data.runs.slice(0, 50) : []
    };
    localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    // Storage quota or disabled
  }
}

// ---- Score Recording & Deduplication -------------------------------------------------------
function recordDailyRun(runInput) {
  if (!runInput || typeof runInput !== 'object') return null;

  const dateKey = typeof runInput.dateKey === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(runInput.dateKey)
    ? runInput.dateKey
    : getUtcDateKey();

  const timestamp = typeof runInput.timestamp === 'number' && isFinite(runInput.timestamp)
    ? runInput.timestamp
    : Date.now();

  const score = typeof runInput.score === 'number' && isFinite(runInput.score)
    ? Math.max(0, Math.floor(runInput.score))
    : 0;

  const time = typeof runInput.time === 'number' && isFinite(runInput.time)
    ? Math.max(0, Math.floor(runInput.time))
    : 0;

  const kills = typeof runInput.kills === 'number' && isFinite(runInput.kills)
    ? Math.max(0, Math.floor(runInput.kills))
    : 0;

  const floor = typeof runInput.floor === 'number' && isFinite(runInput.floor)
    ? Math.max(1, Math.floor(runInput.floor))
    : 1;

  const id = typeof runInput.id === 'string'
    ? runInput.id
    : `${dateKey}_${timestamp}_${score}_${kills}`;

  const store = dailyLoadScores();

  // Deduplication check: ignore if exact run ID or identical timestamp + dateKey + score exists
  if (store.runs.some(r => r.id === id || (r.timestamp === timestamp && r.dateKey === dateKey && r.score === score))) {
    return store;
  }

  const newEntry = {
    id,
    dateKey,
    timestamp,
    hero: typeof runInput.hero === 'string' ? runInput.hero.slice(0, 20) : 'Hero',
    map: typeof runInput.map === 'string' ? runInput.map.slice(0, 20) : 'Arena',
    modifier: typeof runInput.modifier === 'string' ? runInput.modifier.slice(0, 30) : 'Standard',
    score,
    time,
    kills,
    floor,
    win: !!runInput.win
  };

  store.runs.push(newEntry);
  store.runs.sort((a, b) => b.score - a.score || b.time - a.time || b.kills - a.kills);
  store.runs = store.runs.slice(0, 50);

  dailySaveScores(store);
  return store;
}

function getDailyLeaderboard(filterDateKey) {
  const store = dailyLoadScores();
  if (filterDateKey) {
    return store.runs.filter(r => r.dateKey === filterDateKey);
  }
  return store.runs;
}

function getTodayDailyBest(dateKeyInput) {
  const dateKey = dateKeyInput || getUtcDateKey();
  const list = getDailyLeaderboard(dateKey);
  return list.length > 0 ? list[0] : null;
}

// ---- glue: start a daily run and record its result (rules live here, UI stays in meta.js) ----
// A daily run is an ordinary endless raid with the challenge's hero, map and modifier baked in,
// flagged with `daily:1` so endRun() knows to record it. Nothing else about combat changes.
function startDailyRun() {
  const ch = getDailyChallenge();
  const m = ch.modifier || {};
  return startRun({
    mode: 'raid',
    daily: 1,
    dateKey: ch.dateKey,
    hero: ch.heroIndex,
    map: ch.mapIndex,
    spMul: m.spMul || 1,
    dmMul: m.dmMul || 1,
    hpMul: m.hpMul || 1,
    cdMul: m.cdMul || 1,
    lsAdd: m.lsAdd || 0,
    enemyDmMul: m.enemyDmMul || 1,
    goldMul: ch.goldMultiplier || 1
  });
}

// called once from endRun() for flagged runs; guard against double-recording
let DAILY_DONE = 0;
function dailyFinishRun(res) {
  if (!res || DAILY_DONE) return;
  DAILY_DONE = 1;
  const ch = getDailyChallenge();
  const entry = recordDailyRun({
    dateKey: ch.dateKey,
    score: res.score,
    time: res.time,
    kills: res.kills,
    floor: res.floor,
    win: !!res.win,
    title: ch.title,
    hero: ch.heroName,
    modifier: ch.modifier.name
  });
  return entry;
}
function dailyRunReset() { DAILY_DONE = 0; }

// ---- UI: today's challenge card + local best-run list ------------------------------------
// Local only: these scores live in this browser. They are NOT globally ranked and NOT cheat-proof.
function chalCard() {
  const ch = getDailyChallenge(), m = ch.modifier;
  const best = getTodayDailyBest();
  return `<div class="card" style="margin-top:10px"><b>🎯 ${t('dchTitle')} · ${ch.title}</b>
   <div class="mut" style="margin:4px 0">${m.desc}</div>
   <div class="chips" style="justify-content:inherit;margin:6px 0 0">
     <span class="chip">🦸 ${ch.heroName}</span><span class="chip">🗺️ ${ch.mapName}</span><span class="chip">🪙 ×${ch.goldMultiplier}</span></div>
   <div style="margin-top:8px;display:flex;gap:8px;align-items:center;flex-wrap:wrap">
     <button class="btn sm green" data-a="dailyRun">${t('dchPlay')}</button>
     <span class="mut">${best?'🏆 '+fmt(best.score)+' · 💀 '+best.kills:t('dchNone')}</span></div>
   ${dailyBoard(5)}</div>`;
}
function dailyBoard(n) {
  const rows = getDailyLeaderboard().slice(0, n || 10);
  if (!rows.length) return `<div class="mut" style="margin-top:6px">${t('dchEmpty')}</div>`;
  return `<div style="margin-top:8px"><b>📈 ${t('dchBoard')}</b>` + rows.map((r, i) =>
    `<div class="mut" style="display:flex;gap:8px;justify-content:space-between"><span>#${i + 1} ${r.dateKey} · ${esc(r.hero)} · ${esc(r.modifier)}</span><span>${fmt(r.score)} · 💀${r.kills} · ${Math.floor(r.time / 60)}:${String(Math.floor(r.time % 60)).padStart(2, '0')}</span></div>`
  ).join('') + `<div class="mut" style="margin-top:4px;font-size:.85em">${t('dchNote')}</div></div>`;
}
