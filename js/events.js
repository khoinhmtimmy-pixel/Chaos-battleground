// ---- Chaos Event System
// A small data-driven event layer that rides on top of a PvE run. The combat engine does not know
// events exist: it calls four hooks (EVT.room / EVT.tick / EVT.draw / EVT.reset) whose signatures
// never change, so a new event is one entry in EVENT_DEFS and nothing else.
//
// All event state lives on EVT.e (the running event's own scratch object). Nothing is written into
// the engine's ents/pk arrays except pickups, which are tagged p.ev and swept on cleanup - so a
// leftover event can never touch a live match.
//
// TO ADD AN EVENT: add an entry to EVENT_DEFS with {n, w, warn, dur, col} and whichever of
// start(e) / tick(e,dt) / draw(e) / end(e) you need. Nothing outside this file changes.

// URL kill switch: ?noev turns the whole system off for debugging without editing code.
const EV_OK=!/\bnoev\b/.test(location.search);

const EVENT_DEFS={
 // A barrage of telegraphed impacts. Every impact is fully announced before it lands and is small
 // enough to walk out of, so it pressures positioning without ever making a room unwinnable. It
 // hits enemies too, which is what makes it tactically useful rather than just a tax.
 meteor:{n:'METEOR WARNING',w:3,warn:2.4,dur:13,gap:2.7,r:64,col:'#ff8a5a',
  start(e){e.m=[];e.next=this.warn*.5},
  tick(e,dt){
   e.next-=dt;
   if(e.next<=0){e.next=this.gap+Math.random()*.8;
    for(let k=0;k<20;k++){ // aim around the player, never straight on top of them
     const a=Math.random()*6.283,d=70+Math.random()*170;
     const x=Math.max(60,Math.min(W-60,me.x+Math.cos(a)*d)),y=Math.max(60,Math.min(H-60,me.y+Math.sin(a)*d));
     if(!hitPil(x,y,this.r)){e.m.push({x:x,y:y,a:0,r:this.r,d:Math.min(58,22+(e.fl||1)*7),c:this.col});break}}}
   for(let i=e.m.length-1;i>=0;i--){const m=e.m[i];m.a+=dt;
    if(m.a<this.warn)continue;
    evImpact(m);e.m.splice(i,1)}},
  draw(e){for(const m of e.m)evDrawMeteor(m,this.warn)}},

 // One very rich pickup dropped far from you, with coins scattered around it. A pure positioning
 // bet: walk the long way for the payout, or take the safe room and leave it.
 surge:{n:'ENERGY SURGE',w:2,warn:1.9,dur:17,col:'#50b4ff',
  start(e){let best=null,bd=-1;   // the furthest clear tile from the player, so it always costs ground
   for(let k=0;k<90;k++){const x=70+Math.random()*760,y=70+Math.random()*460;
    if(hitPil(x,y,30))continue;
    const d=Math.hypot(x-me.x,y-me.y);if(d>bd){bd=d;best={x:x,y:y}}}
   e.x=best?best.x:W*.5;e.y=best?best.y:H*.5;e.placed=0},
  tick(e){ if(e.placed)return;      // the beacon only becomes real once the warning has been seen
   e.placed=1;
   pk.push({x:e.x,y:e.y,t:'en',v:46,ev:1});
   for(let i=0;i<6;i++){const a=i/6*6.283;
    pk.push({x:e.x+Math.cos(a)*48,y:e.y+Math.sin(a)*42,t:'coin',v:2,ev:1})}
   burst(e.x,e.y,'#50b4ff',26);burst(e.x,e.y,'#ffd166',16)},
  draw(e){ if(!e.placed)evDrawBeacon(e)},
  end(e){ if(e.placed)say(e.x,e.y-26,'SURGE EXPIRED','#7a8bb0')} }
};

const EVT={
 on:null,   // key of the running event. Single-valued - that is what stops events stacking.
 e:null, t:0, w:0, left:0, last:'',

 // called from spawnRoom(): wipes whatever the previous room left, then rolls for the new one
 room(){ this.reset();
  if(!EV_OK||!me||!raid||!raid.rm||raid.rm.type!='fight')return;   // boss and treasure rooms stay clean
  const keys=Object.keys(EVENT_DEFS).filter(k=>k!=this.last&&EVENT_DEFS[k].w>0);
  if(!keys.length)return;
  let tot=0;for(const k of keys)tot+=EVENT_DEFS[k].w;
  let roll=Math.random()*tot,key=keys[keys.length-1];
  for(const k of keys){roll-=EVENT_DEFS[k].w;if(roll<=0){key=k;break}}
  this.start(key)},

 start(key){ const d=EVENT_DEFS[key];if(!d||this.on||!me||!raid)return;
  this.on=key;this.last=key;this.t=0;this.left=d.dur;this.w=d.warn||0;
  this.e={key:key,r:raid.room,fl:raid.floor,w0:d.warn||0,wT:d.warn||0};
  if(d.start)d.start.call(d,this.e);
  ann('⚠ '+d.n,d.col);sfx('skl') },

 // called from raidTick(). Every guard lives here, so an event can never advance after the match
 // has ended, while the player is downed, or while a reward choice has the screen.
 tick(dt){ if(!EV_OK||!this.on)return;
  const r=raid,d=EVENT_DEFS[this.on],e=this.e;
  if(!r||!me||!me.al||r.state!=='fight'||choice||!e){this.reset();return}
  if(this.w>0){
   this.w-=dt;e.wT=Math.max(0,this.w);
   if(this.w<=0){this.w=0;e.wT=0}
  }else{
   this.t+=dt;
   if(d.tick)d.tick.call(d,e,dt)
  }
  if(this.t>=this.left||e.r!==r.room||e.fl!==r.floor){this.endEvent();return}
  if(d.draw)d.draw.call(d,e) },

 endEvent(){ const d=EVENT_DEFS[this.on],e=this.e;
  if(d&&d.end&&e){try{d.end.call(d,e)}catch(err){}}
  if(this.t>=this.left)say(me.x,me.y-62,'EVENT OVER','#7a8bb0');
  this.reset() },

 // called from begin() and endRun(). Also used as the room-change wipe, so it must never announce.
 reset(){ const d=this.on&&EVENT_DEFS[this.on],e=this.e;
  if(d&&d.end&&e){try{d.end.call(d,e)}catch(err){}}
  this.on=null;this.e=null;this.t=0;this.w=0;this.left=0;
  pk=pk.filter(p=>!p.ev) },

 // called from the world renderer
 draw(){ const d=this.on&&EVENT_DEFS[this.on],e=this.e;
  if(d&&d.draw&&e&&me&&raid&&raid.state=='fight'&&!choice)try{d.draw.call(d,e)}catch(err){} }
};

// A meteor that finished its countdown. It hits anything standing in the ring, but the attacker id
// is 'ev' rather than 'me', so a hazard never hands the player a kill or awakening charge.
function evImpact(m){ decal(m.x,m.y,m.r*.8,m.c);burst(m.x,m.y,m.c,18);burst(m.x,m.y,'#ffffff',10);
 shake=Math.max(shake,.22);sfx('hit');
 for(const [id,e] of all()){ if(!e.al)continue;
  if(Math.hypot(e.x-m.x,e.y-m.y)<m.r+hr(e)*.5)hurt(id,e,m.d*(id=='me'?1:.9),0,'ev',{x:m.x,y:m.y}) } }

// ---- drawing, using the same helpers as the rest of the HUD so it matches the existing style
function evDrawMeteor(m,warn){ const u=Math.max(0,1-m.a/warn),r=m.r;
 ctx.save();
 ctx.globalAlpha=.28+.42*(1-u);ctx.strokeStyle=m.c;ctx.lineWidth=3;
 ctx.beginPath();ctx.arc(m.x,m.y,r,0,7);ctx.stroke();
 ctx.globalAlpha=.85;ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(m.x,m.y,r*(1-u*.8),0,7);ctx.stroke();
 ctx.globalAlpha=.2+.22*(1-u);ctx.fillStyle=m.c;ctx.beginPath();ctx.arc(m.x,m.y,r,0,7);ctx.fill();
 glowAt(m.c,m.x,m.y,r*.85,.3+.35*(1-u));
 if(u<.7){const t=(1-u)/.7,yy=m.y-330*t*t;   // a streak on the final approach, so it reads as incoming
  ctx.globalAlpha=.5;ctx.strokeStyle=m.c;ctx.lineWidth=4;
  ctx.beginPath();ctx.moveTo(m.x,yy);ctx.lineTo(m.x,yy+32);ctx.stroke()}
 ctx.globalAlpha=1;ctx.restore() }

function evDrawBeacon(e){ const u=e.w0>0?1-e.wT/e.w0:1;
 ctx.save();
 glowAt('#50b4ff',e.x,e.y,74,.4+.28*Math.sin(tm*6));
 ctx.globalAlpha=.5+.3*Math.sin(tm*6);ctx.strokeStyle='#50b4ff';ctx.lineWidth=3;
 ctx.beginPath();ctx.arc(e.x,e.y,42,0,7);ctx.stroke();
 ctx.globalAlpha=.95;ctx.fillStyle='#7fe4ff';ctx.font='900 12px system-ui';ctx.textAlign='center';
 ctx.fillText('SURGE',e.x,e.y-50);ctx.restore() }