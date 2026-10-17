// ============================================================================================
// Enemy AI -- one shared state machine that every PvE foe runs. Behaviour lives in named states;
// the differences between enemy kinds are data (the FOE_AI table below), not a nest of
// per-tag conditionals. The old foe branch in game.js chose movement and attacks with
// `ai=='rush'?...:ai=='range'?...`, so every new enemy meant editing that pile and hoping the
// cases did not overlap. Here a new archetype is a table row, plus (only if it needs a genuinely
// new movement idea) one `case` in the state selection.
//
// TWO archetypes ship today:
//   chaser  - closes to melee and swings; strafes only to keep from piling up on the same spot.
//   ranged  - holds a distance band, strafes, and fires; backs off when the player closes in.
// The existing Goblin/Ogre/Bat/Slime/Skeleton Knight are chasers; the archers, snipers, mages and
// the bomb imp are ranged with their own numbers. Tank and Flanker are future rows: see the notes
// at the end of this file.
//
// Per-frame cost is flat and small: one distance, one turn clamp, one state choice, a couple of
// random rolls. Target scanning is throttled by AI_SEEK, so a crowd of enemies does not each
// rescan every fighter every frame (that was the most expensive part of a big fight).
//
// Every number is tunable in FOE_AI, and one enemy can override any field with c.aiP (see data.js).
// ============================================================================================
const AI_SEEK=.25;   // seconds between full target rescans, per enemy
const AI_STUCK=.55;  // seconds of no progress while trying to move before a sidestep
// tag     role      band[min,max]  ar  spd    turn tele  strafe react jit  lead repos fire{a,q}      dash[min,max]
const FOE_AI={
 // role is the behaviour family; band is the distance it tries to keep; ar is where its basic
 // attack is worth firing; turn is radians/second of facing (stops instant 180-degree snaps);
 // tele is seconds of steady aim before a ranged shot leaves (the player's reaction window);
 // jit is a slow aim wobble (imperfect tracking); lead is how far ahead it throws area skills.
 rush: {role:'chaser',band:[30,58],  ar:100,spd:1.08,turn:6.0,tele:.10,strafe:.45,react:.20,jit:.08,lead:.06,repos:.5,fire:{a:4.5,q:.35},dash:[140,320]},
 range:{role:'ranged',band:[210,300],ar:440,spd:.92,turn:4.5,tele:.30,strafe:.85,react:.40,jit:.13,lead:.16,repos:.5,fire:{a:2.0,q:.35}},
 snipe:{role:'ranged',band:[340,430],ar:600,spd:.90,turn:4.0,tele:.42,strafe:.70,react:.50,jit:.10,lead:.14,repos:.5,fire:{a:2.0,q:.35}},
 bomb: {role:'ranged',band:[150,235],ar:360,spd:.92,turn:4.5,tele:.34,strafe:.80,react:.40,jit:.12,lead:.20,repos:.5,fire:{a:2.0,q:.35}}
};
// One lookup per character, cached on the character record, so the hot loop never allocates.
function aiCfg(c){if(!c)return FOE_AI.rush;if(!c._aic){const b=FOE_AI[c.ai]||FOE_AI.rush;c._aic=c.aiP?Object.assign({},b,c.aiP):b}return c._aic}
// shortest-way angular difference, so a turn never takes the long way round
const aiDeg=a=>Math.atan2(Math.sin(a),Math.cos(a));
// turn `e` toward `want` but no faster than `rate` radians/second
function aiTurn(e,want,rate,dt){const d=aiDeg(want-e.a),m=rate*dt;e.a+=d>m?m:d<-m?-m:d}
// Drive one enemy for a frame. t = its target, bd = distance to it, dt = frame seconds.
// States cycle approach -> hold -> (retreat) -> fire, with a short reposition whenever the body is
// trying to move but the pillar solver is not letting it get anywhere.
function foeAI(e,id,t,bd,dt){
 const c=CH[e.ch],A=aiCfg(c),melee=A.role?A.role!='ranged':A.band[1]<=160;
 if(e.seed==null)e.seed=(id.charCodeAt(1)||0)*7+(id.charCodeAt(0)||0);
 // face the target at a capped rate, with a slow per-enemy wobble on top: no laser-guided aim
 if(!(e.jt>0)){e.jit=(Math.random()-.5)*2*A.jit;e.jt=1+Math.random()*.6}
 e.jt-=dt;
 const want=Math.atan2(t.y-e.y,t.x-e.x);
 aiTurn(e,want+e.jit,A.turn*(e.sl>0?.6:1),dt);
 const aimed=Math.abs(aiDeg(want-e.a))<.35;
 e.aimT=aimed?(e.aimT||0)+dt:0;
 e.react=(e.react||0)-dt;
 // ---- state choice: one branch tree per frame, not a pile of overlapping conditions
 const dir=bd>A.band[1]?1:bd<A.band[0]?-1:0;
 const maxS=c.sp*A.spd*dt;
 // axp/ayp, not px/py: art.js owns px/py for the walk animation, so the AI keeps its own
 // previous-position to notice when it is pushing against a wall.
 const moved=e.axp==null?999:Math.hypot(e.x-e.axp,e.y-e.ayp);
 e.axp=e.x;e.ayp=e.y;
 if(dir&&moved<maxS*.4)e.stk=(e.stk||0)+dt;else if(moved>maxS*.6)e.stk=(e.stk||0)-dt;
 if(e.stk>AI_STUCK){e.stk=0;e.rep=A.repos;e.rtry=(e.rtry||0)+1;if(e.rtry>2)e.repHome=1;else e.repS=(e.repS||1)*-1}
 if(moved>maxS*.6)e.rtry=0;
 if(e.rep>0)e.rep-=dt;
 const st=e.rep>0?'reposition':dir>0?'chase':dir<0?'retreat':melee?'strike':'hold';
 e.ast=st;
 // ---- movement: forward/back along the facing, sideways to strafe or to slide off an obstacle
 const sp=c.sp*A.spd*(e.sl>0?.5:1)*(e.hst>0?1.6:1);
 if(e.rep>0){
  if(e.repHome&&moved<=maxS*.6){const a=Math.atan2(H/2-e.y,W/2-e.x);move(e,Math.cos(a)*sp*dt,Math.sin(a)*sp*dt);return}
  if(moved>maxS*.6)e.repHome=0;
  const a=e.a;move(e,(Math.cos(a)*-.35-Math.sin(a)*(e.repS||1)*1.05)*sp*dt,(Math.sin(a)*-.35+Math.cos(a)*(e.repS||1)*1.05)*sp*dt);return
 }
 const side=dir?0:Math.sin(tm*(melee?1.1:1.7)+e.seed)*A.strafe,a=e.a;
 move(e,(Math.cos(a)*dir-Math.sin(a)*side)*sp*dt,(Math.sin(a)*dir+Math.cos(a)*side)*sp*dt);
 // ---- attacks. The reaction delay and, for ranged, the aim-up window keep shots answerable:
 // a ranged enemy visibly locks on for `tele` seconds before a shot can leave.
 if(e.react>0)return;
 if(!melee&&e.aimT<A.tele)return;
 // area skills are lobbed at where the target is heading, using a smoothed velocity estimate;
 // projectiles and cones already fire along e.a, which carries the turn cap and the wobble.
 if(e.tlx!=null&&dt>1e-4){const vx=(t.x-e.tlx)/dt,vy=(t.y-e.tly)/dt;e.tvx=e.tvx==null?vx:e.tvx*.72+vx*.28;e.tvy=e.tvy==null?vy:e.tvy*.72+vy*.28}
 e.tlx=t.x;e.tly=t.y;
 const px=t.x+(e.tvx||0)*A.lead,py=t.y+(e.tvy||0)*A.lead;
 if(A.fire.a&&bd<=A.ar&&Math.random()<dt*A.fire.a)tryCast(e,id,'a',px,py);
 if(A.fire.q&&bd<=A.ar+80&&Math.random()<dt*A.fire.q)tryCast(e,id,'q',px,py);
 if(A.dash&&bd>A.dash[0]&&bd<A.dash[1]&&Math.random()<dt*.5)tryCast(e,id,'e',px,py);
}
// ---- Future archetypes, without touching the state machine above:
//   Tank:   {role:'chaser',band:[28,60],ar:110,spd:.62,turn:3.5,tele:.2,jit:0,lead:0,...}
//           A chaser row with low spd/turn and higher hp/sd on the CH record. The machine already
//           handles it: it just closes slowly. Give it a shield skill on 'e' and it holds.
//   Flanker:{role:'chaser',band:[30,70],...}. Approach from the side needs one new state: instead
//           of steering at the target, steer at a point offset ~90 degrees around it (recomputed
//           every ~1s), then switch to 'strike' at melee range. That is a single branch added to
//           the state choice, reusing move()/tryCast() and the stuck/reposition safety net.
