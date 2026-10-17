// ============================================================================================
// Offline harness for js/ai.js. It runs the REAL enemy AI and the REAL pillar/bound movement
// solver (extracted verbatim from js/game.js) against scripted scenarios, so archetype behaviour
// can be checked without opening the browser. The few lines of glue that mirror game.js's update()
// are asserted against the game.js source below, so the harness cannot quietly drift from the
// engine it is meant to represent.
//
// Run: node tools/test-ai.js
// ============================================================================================
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
const game = fs.readFileSync(path.join(root, 'js/game.js'), 'utf8');
const aiSrc = fs.readFileSync(path.join(root, 'js/ai.js'), 'utf8');

let fail = 0;
const ok = (name, cond, extra) => { console.log((cond ? '  ok  ' : '  FAIL') + '  ' + name + (extra ? '  (' + extra + ')' : '')); if (!cond) fail++; };

// ---- pull the real movement solver out of game.js (hitPil + clearPillars + move). They only
// depend on PIL/W/H, so they drop straight into the sandbox.
const a = game.indexOf('function hitPil(x,y,r)'), b = game.indexOf('// a form must not survive death');
if (a < 0 || b < 0 || b < a) { console.error('could not locate the movement solver in js/game.js'); process.exit(2); }
const moveSrc = game.slice(a, b);

// ---- the guard/caching glue must exist in game.js, or the harness is testing a fiction
ok('game.js caches foe targets (AI_SEEK)', /e\.tt=AI_SEEK\*\(\.75\+Math\.random\(\)\*\.5\)/.test(game));
ok('game.js silences AI when the match is decided', /const live=raid\?raid\.state=='fight':over<=0/.test(game));
ok('game.js only runs foeAI while live', /if\(e\.foe\)\{if\(live\)foeAI\(e,id,t,bd,dt\);continue\}/.test(game));

// ---- foe templates (stats are irrelevant here; the AI reads sp/ai and the skills for nothing else)
const FOES = {
  goblin:  { n:'Goblin',          ai:'rush',  sp:155, foe:1 },
  archer:  { n:'Imp Archer',      ai:'range', sp:120, foe:1 },
  wraith:  { n:'Wraith',          ai:'snipe', sp:105, foe:1 },
  bomber:  { n:'Bomb Imp',        ai:'bomb',  sp:125, foe:1 },
  ogre:    { n:'Ogre',            ai:'rush',  sp:135, foe:1 }
};
const PILDEFAULT = [[300,200,38],[600,200,38],[300,400,38],[600,400,38],[450,300,30]];

function world(pil){
  const target = { x:800, y:300, al:1 };
  const casts = [];
  const sandbox = {
    CH: [], W: 900, H: 600, tm: 0, PIL: pil || PILDEFAULT,
    tryCast: (e, id, key, tx, ty) => casts.push({ id, key, tx, ty, x: e.x, y: e.y }),
    move: null, Math, Object, JSON, console
  };
  const ctx = vm.createContext(sandbox);
  vm.runInContext(moveSrc + '\n' + aiSrc, ctx);
  const mk = (ch, x, y, id) => {
    const e = { id, ch, x, y, a:0, al:1, mx:100, hp:100, sm:0, sd:0, sl:0, hst:0, stn:0, van:0, cd:{}, cg:null };
    ctx.CH[ch] = FOES[ch];
    return e;
  };
  // Glue that mirrors the row in game.js update(): target cache, live guard, then the AI.
  const step = (foes, dt, live) => {
    ctx.tm += dt;
    for (const e of foes) {
      if (!e.al) continue;
      let t = null, bd = 1e9;
      if (!e.tgt || !e.tgt.al) e.tt = 0;
      if (e.tt > 0) { t = e.tgt; bd = Math.hypot(t.x - e.x, t.y - e.y); }
      else { if (target.al) { t = target; bd = Math.hypot(t.x - e.x, t.y - e.y); } e.tgt = t; e.tt = 0.25 * (0.75 + Math.random() * 0.5); }
      e.tt -= dt;
      if (!t || e.stn > 0 || e.van > 0) continue;
      if (live !== false) ctx.foeAI(e, e.id, t, bd, dt);
    }
  };
  return { sandbox, ctx, mk, step, target, casts };
}

const dist = (e, t) => Math.hypot(e.x - t.x, e.y - t.y);
const inBounds = e => e.x >= 15.9 && e.x <= 884.1 && e.y >= 15.9 && e.y <= 584.1;

// ===== 1. Chaser closes to melee and swings =================================================
{
  const w = world();
  const g = w.mk('goblin', 100, 300, 'g0');
  w.target.x = 800; w.target.y = 300;
  let minD = 1e9;
  for (let i = 0; i < 60 * 8; i++) { w.step([g], 1 / 60); minD = Math.min(minD, dist(g, w.target)); }
  ok('chaser closes to melee', dist(g, w.target) < 80, 'bd=' + dist(g, w.target).toFixed(0));
  ok('chaser attacked', w.casts.some(c => c.key === 'a'));
  ok('chaser stayed in bounds', inBounds(g));
}

// ===== 2. Ranged attacker holds its band ====================================================
{
  const w = world();
  const r = w.mk('archer', 100, 300, 'r0');
  w.target.x = 800; w.target.y = 300;
  for (let i = 0; i < 60 * 9; i++) w.step([r], 1 / 60);
  const bd = dist(r, w.target);
  ok('ranged settled inside its band', bd > 180 && bd < 340, 'bd=' + bd.toFixed(0));
  ok('ranged fired from range', w.casts.some(c => c.key === 'a'));
}

// ===== 3. Ranged attacker retreats when the player closes in ================================
{
  const w = world();
  const r = w.mk('archer', 450, 300, 'r0');
  w.target.x = 450; w.target.y = 300;
  for (let i = 0; i < 60 * 3; i++) w.step([r], 1 / 60);
  // park the player right on top of it; it should back away rather than trade in melee
  w.target.x = 470; w.target.y = 300;
  for (let i = 0; i < 60 * 3; i++) w.step([r], 1 / 60);
  ok('ranged backs off when crowded', dist(r, w.target) > 170, 'bd=' + dist(r, w.target).toFixed(0));
}

// ===== 4. Sniper keeps a longer standoff, bomber a shorter one ===============================
{
  const w = world();
  const s = w.mk('wraith', 450, 300, 's0');
  w.target.x = 450; w.target.y = 300;
  for (let i = 0; i < 60 * 6; i++) w.step([s], 1 / 60);
  const bd = dist(s, w.target);
  ok('sniper holds a long standoff', bd > 300, 'bd=' + bd.toFixed(0));
}
{
  const w = world();
  const b = w.mk('bomber', 100, 300, 'b0');
  w.target.x = 800; w.target.y = 300;
  for (let i = 0; i < 60 * 8; i++) w.step([b], 1 / 60);
  const bd = dist(b, w.target);
  ok('bomber holds a mid band', bd > 120 && bd < 280, 'bd=' + bd.toFixed(0));
}

// ===== 5. Obstacles: a chaser walled off from its target must not stick forever =============
{
  const w = world([[450, 300, 62]]); // one big pillar dead between spawn and target
  const g = w.mk('goblin', 200, 300, 'g0');
  w.target.x = 700; w.target.y = 300;
  let reached = -1;
  for (let i = 0; i < 60 * 15; i++) {
    w.step([g], 1 / 60);
    if (reached < 0 && dist(g, w.target) < 90) reached = i / 60;
  }
  ok('chaser navigates around a pillar', reached >= 0, reached >= 0 ? 'reached in ' + reached.toFixed(1) + 's' : 'never');
  ok('chaser never clipped a pillar', !PILDEFAULT.concat([[450, 300, 62]]).some(p => Math.hypot(g.x - p[0], g.y - p[1]) < p[2] + 14));
}
// 5b. The stuck safety net itself: with movement fully blocked, `moved` never grows, so the
// enemy must switch into `reposition` rather than pushing at the wall forever.
{
  const w = world([[450, 300, 62]]);
  const g = w.mk('goblin', 200, 300, 'g0');
  w.target.x = 700; w.target.y = 300;
  w.ctx.move = () => {}; // pretend the body cannot move at all
  let sawReposition = false;
  for (let i = 0; i < 60 * 6; i++) { w.step([g], 1 / 60); if (g.ast === 'reposition') sawReposition = true; }
  ok('blocked chaser enters the reposition state', sawReposition);
  ok('blocked chaser escalates toward the centre', !!g.repHome, 'rtry=' + g.rtry);
}

// ===== 6. Arena boundaries contain every archetype ==========================================
{
  const w = world();
  const foes = [
    w.mk('goblin', 880, 60, 'g0'),
    w.mk('archer', 80, 560, 'r0'),
    w.mk('wraith', 880, 560, 's0'),
    w.mk('bomber', 60, 60, 'b0')
  ];
  w.target.x = 880; w.target.y = 60;
  for (let i = 0; i < 60 * 10; i++) { w.step(foes, 1 / 60); if (foes.every(inBounds) === false) break; }
  ok('all archetypes stay inside the arena', foes.every(inBounds), foes.map(f => f.x.toFixed(0) + ',' + f.y.toFixed(0)).join(' '));
}

// ===== 7. Many enemies at once stay sane and cheap =========================================
{
  const w = world();
  const foes = [];
  for (let i = 0; i < 42; i++) {
    const ch = ['goblin', 'archer', 'wraith', 'bomber'][i % 4];
    foes.push(w.mk(ch, 40 + (i % 7) * 120, 40 + ((i / 7) | 0) * 90, 'f' + i));
  }
  w.target.x = 450; w.target.y = 300;
  const t0 = Date.now();
  for (let i = 0; i < 60 * 6; i++) w.step(foes, 1 / 60);
  const ms = Date.now() - t0;
  const sane = foes.every(e => Number.isFinite(e.x) && Number.isFinite(e.y) && inBounds(e));
  ok('42 enemies: all finite and in bounds', sane);
  ok('42 enemies: no NaN aim', foes.every(e => Number.isFinite(e.a)));
  console.log('        42 enemies x 360 frames = ' + ms + 'ms');
}

// ===== 8. Match end / player death silences the AI ==========================================
{
  const w = world();
  const g = w.mk('goblin', 100, 300, 'g0');
  w.target.x = 800; w.target.y = 300;
  for (let i = 0; i < 30; i++) w.step([g], 1 / 60);
  const sx = g.x, sy = g.y, nc = w.casts.length;
  for (let i = 0; i < 120; i++) w.step([g], 1 / 60, false); // live=false: match decided
  ok('decided match: enemy does not move', g.x === sx && g.y === sy);
  ok('decided match: enemy does not attack', w.casts.length === nc);
  // player death: no live target -> the row `continue`s before the AI, same result
  w.target.al = 0;
  for (let i = 0; i < 120; i++) w.step([g], 1 / 60, true);
  ok('dead player: enemy does not chase', g.x === sx && g.y === sy);
}

// ===== 9. Restart / per-enemy tuning override ===============================================
{
  ok('game.js still owns restart state (begin + one match at a time)', /if\(run&&!again\)return/.test(game));
  ok('per-enemy aiP override is honoured', /c\.aiP\?Object\.assign\(\{\},b,c\.aiP\):b/.test(aiSrc));
  // a new run spawns new foe objects, so no AI state survives a restart: a fresh enemy chases again
  const w = world();
  w.target.x = 800; w.target.y = 300;
  const old = w.mk('goblin', 100, 300, 'g0');
  for (let i = 0; i < 60; i++) w.step([old], 1 / 60, false); // match ended, old enemy frozen
  const fresh = w.mk('goblin', 100, 300, 'g1');               // restart -> brand-new foe
  for (let i = 0; i < 60 * 6; i++) w.step([fresh], 1 / 60, true);
  ok('restart: a freshly spawned enemy chases again', dist(fresh, w.target) < 80, 'bd=' + dist(fresh, w.target).toFixed(0));
}

console.log(fail ? '\n' + fail + ' CHECK(S) FAILED' : '\nall AI checks passed');
process.exit(fail ? 1 : 0);
