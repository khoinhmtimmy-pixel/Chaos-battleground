// ============================================================================================
// Boss encounter: Obsidian Warden. One memorable boss, built entirely on the existing combat,
// movement and effect systems (move/tryCast/FX/say/spawnFoes). No separate engine.
//
// Phases (driven by HP thresholds, each transition fires once):
//   1  hp > 60%   : Seismic Slam (telegraphed nova) and Charge (lunge). Slow, readable.
//   2  25% < hp <= 60% : Ground Pound + Laser Sweep, summons two adds, faster.
//   3  hp <= 25%  : Abyssal Quake (radial) + Charge, enraged (damage x1.3, haste), summons three.
//
// A single state machine (idle -> telegraph -> recover -> idle) guarantees attacks never overlap:
// the boss telegraphs, strikes, then has a recovery window in which the player can counterattack.
// ============================================================================================
function bossWardenInit(e){if(e.bossPhase)return;e.bossPhase=1;e.bossState='idle';e.bossT=1.6;e.bossWarn=null;e.summoned2=false;e.summoned3=false;e.enraged=false;e.bossRecover=0}
function bossWardenAI(e,id,t,bd,dt){
 bossWardenInit(e);
 const hp=e.hp/e.mx;
 // ---- phase transitions (each fires once) -----------------------------------------------
 if(e.bossPhase===1&&hp<=0.6){
  e.bossPhase=2;e.bossState='recover';e.bossT=1.8;e.summoned2=false;
  FX('poof',e.x,e.y,44,'#ff6b6b',.65,Math.random()*6);say(e.x,e.y-72,'PHASE 2!','#ff6b6b');shake=Math.max(shake,.45);
  if(!e.summoned2){spawnFoes(2);e.summoned2=true}
 }
 if(e.bossPhase===2&&hp<=0.25){
  e.bossPhase=3;e.bossState='recover';e.bossT=2.2;e.enraged=true;
  e.dmgMul=(e.dmgMul||1)*1.3;e.hst=Math.max(e.hst,6);
  FX('poof',e.x,e.y,60,'#a855f7',.75,Math.random()*6);say(e.x,e.y-72,'ENRAGED!','#a855f7');shake=Math.max(shake,.6);
  if(!e.summoned3){spawnFoes(3);e.summoned3=true}
 }
 // ---- state machine ---------------------------------------------------------------------
 e.bossT-=dt;
 const phase=e.bossPhase;
 if(e.bossState==='idle'){
  // face the player at a capped rate (no instant snaps)
  const want=Math.atan2(t.y-e.y,t.x-e.x);let d=want-e.a;d=Math.atan2(Math.sin(d),Math.cos(d));const m=4*dt;e.a+=d>m?m:d<-m?-m:d;
  // movement: close if far, back off if crowded, strafe in the sweet spot
  const sp=e.ch?CH[e.ch].sp*.55*(e.sl>0?.5:1):80;
  if(bd>260)move(e,Math.cos(e.a)*sp*dt,Math.sin(e.a)*sp*dt);
  else if(bd<150)move(e,-Math.cos(e.a)*sp*dt,-Math.sin(e.a)*sp*dt);
  else move(e,-Math.sin(e.a)*sp*.4*dt,Math.cos(e.a)*sp*.4*dt);
  if(e.bossT<=0){
   // pick one attack for this cycle (never two at once)
   const roll=Math.random();
   let atk='slam';
   if(phase>=3&&roll<.35)atk='quake';
   else if(phase>=2&&roll<.65)atk='sweep';
   else if(roll<.5)atk='slam';
   else atk='lunge';
   // telegraph: an expanding ring the player can read, sized to the attack
   if(atk==='slam'){e.bossWarn={x:e.x,y:e.y,r:130};FX('ring',e.x,e.y,130,'#ffd84d',.65,0);say(e.x,e.y-52,'SLAM!','#ffd84d')}
   else if(atk==='lunge'){const lx=t.x,ly=t.y;e.bossWarn={x:lx,y:ly,r:90};FX('ring',lx,ly,90,'#ffd84d',.55,0);say(e.x,e.y-52,'CHARGE!','#ffd84d')}
   else if(atk==='sweep'){e.bossWarn={x:e.x,y:e.y,r:220};FX('ring',e.x,e.y,220,'#fb923c',.85,0);say(e.x,e.y-52,'SWEEP!','#fb923c')}
   else{e.bossWarn={x:e.x,y:e.y,r:230};FX('ring',e.x,e.y,230,'#a855f7',.75,0);say(e.x,e.y-52,'QUAKE!','#a855f7')}
   e.bossAtk=atk;e.bossState='telegraph';
   e.bossT=atk==='sweep'?.85:atk==='lunge'?.55:atk==='quake'?.75:.65;
  }
 }else if(e.bossState==='telegraph'){
  // hold position while the warning ring completes
  if(e.bossT<=0){
   const atk=e.bossAtk;
   if(atk==='slam')tryCast(e,id,'q',e.x,e.y);
   else if(atk==='lunge')tryCast(e,id,'e',t.x,t.y);
   else if(atk==='sweep'){e.a=Math.atan2(t.y-e.y,t.x-e.x);tryCast(e,id,'r',t.x,t.y)}
   else tryCast(e,id,'c',e.x,e.y);
   e.bossState='recover';
   e.bossT=phase===1?1.5:phase===2?1.15:0.9;
   e.bossWarn=null;
  }
 }else if(e.bossState==='recover'){
  // slow strafe, no attacks: the player's window to respond
  move(e,-Math.sin(e.a)*40*dt,Math.cos(e.a)*40*dt);
  if(e.bossT<=0){e.bossState='idle';e.bossT=phase===1?2.0:phase===2?1.5:1.1}
 }
 e.bossWarn=e.bossWarn||null;
}
