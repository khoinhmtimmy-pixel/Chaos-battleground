// Offline harness for js/boss.js. Runs the real bossWardenAI against scripted HP scenarios,
// with the real movement solver extracted from js/game.js. Glue is asserted against source.
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
const game = fs.readFileSync(path.join(root, 'js/game.js'), 'utf8');
const bossSrc = fs.readFileSync(path.join(root, 'js/boss.js'), 'utf8');
const aiSrc = fs.readFileSync(path.join(root, 'js/ai.js'), 'utf8');

let fail = 0;
const ok = (name, cond, extra) => { console.log((cond ? '  ok  ' : '  FAIL') + '  ' + name + (extra ? '  (' + extra + ')' : '')); if (!cond) fail++; };

const a = game.indexOf('function hitPil(x,y,r)'), b = game.indexOf('// a form must not survive death');
const moveSrc = game.slice(a, b);

// source assertions
ok('game.js spawns the warden with bossAI', /b\.bossAI=CH\[bi\]\.bossAI/.test(game));
ok('game.js dispatches to bossWardenAI', /if\(e\.bossAI==='warden'\)\{bossWardenAI\(e,id,t,bd,dt\);continue\}/.test(game));
ok('boss.js defines bossWardenAI', /function bossWardenAI/.test(bossSrc));
ok('boss.js has one-shot phase transitions', /e\.bossPhase===1&&hp<=0\.6/.test(bossSrc) && /e\.bossPhase===2&&hp<=0\.25/.test(bossSrc));

const sandbox = {
  CH: [], W: 900, H: 600, tm: 0, PIL: [[300,200,38],[600,200,38],[300,400,38],[600,400,38],[450,300,30]],
  tryCast: (e, id, key, tx, ty) => { (sandbox.casts = sandbox.casts || []).push({ id, key, tx, ty }); },
  FX: () => {}, say: () => {}, sfx: () => {}, decal: () => {}, shake: 0,
  spawnFoes: (n) => { sandbox.spawned = (sandbox.spawned || 0) + n; },
  move: null, Math, Object, JSON, console
};
const ctx = vm.createContext(sandbox);
vm.runInContext(moveSrc + '\n' + aiSrc + '\n' + bossSrc, ctx);

const makeBoss = (hp) => {
  const e = { id:'bw0', ch:'bw', x:450, y:300, a:0, al:1, mx:hp, hp:hp, sm:0, sd:0, sl:0, hst:0, stn:0, van:0, cd:{a:0,q:0,e:0,r:0,c:0}, cg:null, dmgMul:1, boss:1, bossAI:'warden', raidE:1 };
  ctx.CH['bw'] = { n:'Obsidian Warden', sp:128, boss:1, bossAI:'warden' };
  return e;
};

const target = { x: 450, y: 520, al: 1 };

// ===== 1. Phase transitions fire once at HP thresholds ================================
{
  const e = makeBoss(1000);
  ctx.tm = 0; sandbox.casts = []; sandbox.spawned = 0;
  // drive down through phase 2 then phase 3
  let phases = [e.bossPhase];
  // phase 1 -> 2 at 60%
  e.hp = 600;
  ctx.bossWardenAI(e, e.id, target, Math.hypot(e.x-target.x, e.y-target.y), 0.016);
  ok('phase 1 -> 2 at 60% HP', e.bossPhase === 2, 'phase=' + e.bossPhase);
  const p2spawned = sandbox.spawned;
  ok('phase 2 summons adds', p2spawned >= 2, 'spawned=' + p2spawned);
  // phase 2 -> 3 at 25%
  e.hp = 250;
  ctx.bossWardenAI(e, e.id, target, Math.hypot(e.x-target.x, e.y-target.y), 0.016);
  ok('phase 2 -> 3 at 25% HP', e.bossPhase === 3, 'phase=' + e.bossPhase);
  ok('phase 3 summons adds', sandbox.spawned > p2spawned, 'spawned=' + sandbox.spawned);
  ok('phase 3 enrages (dmgMul raised)', e.dmgMul > 1, 'mul=' + e.dmgMul.toFixed(2));
  ok('phase 3 grants haste', e.hst > 0);
  // further calls do not re-trigger (phase stays 3, no extra summons)
  const before = sandbox.spawned;
  e.hp = 100;
  ctx.bossWardenAI(e, e.id, target, Math.hypot(e.x-target.x, e.y-target.y), 0.016);
  ok('phase 3 does not re-trigger', e.bossPhase === 3 && sandbox.spawned === before);
}

// ===== 2. Attacks telegraph then fire, with a recovery window ==========================
{
  const e = makeBoss(1000);
  ctx.tm = 0; sandbox.casts = []; sandbox.spawned = 0;
  e.bossPhase = 1; e.bossState = 'idle'; e.bossT = 0; // ready to attack
  // first tick picks an attack and enters telegraph
  ctx.bossWardenAI(e, e.id, target, 200, 0.016);
  ok('idle -> telegraph', e.bossState === 'telegraph', 'state=' + e.bossState);
  ok('telegraph sets a warning', !!e.bossWarn, 'warn=' + (e.bossWarn && e.bossWarn.r));
  const warnR = e.bossWarn && e.bossWarn.r;
  // while telegraphing, no attack has landed yet
  ok('no attack during telegraph', sandbox.casts.length === 0);
  // wait out the telegraph
  for (let i = 0; i < 60; i++) ctx.bossWardenAI(e, e.id, target, 200, 1/60);
  ok('telegraph -> recover after firing', e.bossState === 'recover' || e.bossState === 'idle', 'state=' + e.bossState);
  ok('an attack landed', sandbox.casts.length > 0, 'casts=' + sandbox.casts.map(c=>c.key).join(','));
  // during recover, bossT counts down; should return to idle
  for (let i = 0; i < 120; i++) ctx.bossWardenAI(e, e.id, target, 200, 1/60);
  ok('recover -> idle (window closed)', e.bossState === 'idle');
}

// ===== 3. Single attack at a time (no overlapping patterns) ===========================
{
  const e = makeBoss(1000);
  ctx.tm = 0; sandbox.casts = []; sandbox.spawned = 0;
  e.bossState = 'idle'; e.bossT = 0;
  ctx.bossWardenAI(e, e.id, target, 200, 0.016);
  const st = e.bossState;
  // a second immediate tick must not start another attack while telegraphing
  ctx.bossWardenAI(e, e.id, target, 200, 0.016);
  ok('no second attack while telegraphing', e.bossState === st);
}

// ===== 4. Boss stays in bounds / finite ==============================================
{
  const e = makeBoss(1000);
  ctx.tm = 0; sandbox.casts = []; sandbox.spawned = 0;
  e.x = 880; e.y = 60;
  for (let i = 0; i < 60 * 5; i++) ctx.bossWardenAI(e, e.id, target, Math.hypot(e.x-target.x, e.y-target.y), 1/60);
  ok('boss stays finite', Number.isFinite(e.x) && Number.isFinite(e.y));
}

// ===== 5. Cleanup / defeat contract (static) =========================================
{
  // death, reward and cleanup are handled by the existing slay()/credit()/dropLoot()/delete path;
  // the boss relies on e.boss=1, so assert the engine still treats bosses specially.
  ok('boss death path exists (slay credits boss)', /if\(o=='me'\)shake=Math\.max\(shake,e\.boss\?.4:\.1\)/.test(game));
  ok('boss dropLoot gives 12 coins', /n=e\.boss\?12:/.test(game));
  ok('raid boss death increments bk', /raid\.bk=\(raid\.bk\|\|0\)\+1/.test(game));
  ok('boss removed from others on death', /delete others\[id\]/.test(game));
}

console.log(fail ? '\n' + fail + ' CHECK(S) FAILED' : '\nall boss checks passed');
process.exit(fail ? 1 : 0);
