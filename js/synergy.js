// ---- Synergies
// Combinations that only exist once the right upgrades are held. Deliberately kept in their own
// file and their own table: an upgrade never knows about a synergy, and a synergy never lives in
// BUFFS. Adding one is a single entry in SYNERGY_DEFS.
//
// There is no persistent synergy state. SY.active() derives the live set from raid.bf on demand, so
// a synergy can never survive a restart, a death, or an upgrade being maxed out - there is nothing
// to go stale.
//
// Safety rules this file relies on:
//   - the burn tick calls dmgTo() directly and never hurt(), so it cannot crit and cannot re-trigger
//     a synergy. Emberlash cannot feed itself.
//   - Static Trail fires on the dash *completing*, once per dash, and its nova is an ordinary nova.
//     Neither trigger can produce another trigger of itself, so no chain can run away.

const SYNERGY_DEFS={
 // crit -> burn. Burn is an existing mechanic (brn/bd), so this introduces no new damage type.
 emberlash:{n:'Emberlash',ic:'🔥',on:'crit',need:[['Critical Eye',1]],
  d:'Critical hits set the target alight for 2.5s',dv:'Đòn chí mạng làm cháy mục tiêu 2.5 giây',
  dur:2.5,dps:6},
 // dash -> burst at the launch point. Pure positioning pressure, no new damage type.
 static:{n:'Static Trail',ic:'⚡',on:'dash',need:[['Swift Boots',1]],
  d:'Dashing leaves a charged burst where you launched from',
  dv:'Lướt để lại một vụ nổ năng lượng tại chỗ bắt đầu',
  r:72,dmg:20}
};

// A need is [upgradeName, minimumStacks]. Missing the prerequisite simply means the synergy is off.
function syReady(key){ const d=SYNERGY_DEFS[key];if(!d)return false;
 const bf=(raid&&raid.bf)||{};
 for(const need of d.need)if((bf[need[0]]||0)<need[1])return false;
 return true }

// Live set, derived fresh every time it is asked for.
function syActive(){ const out=[];
 if(!raid)return out;
 for(const k in SYNERGY_DEFS)if(syReady(k))out.push(k);
 return out }

const SY={
 defs:SYNERGY_DEFS,
 active:syActive,
 has:syReady,
 // Compact icon string for the HUD, so a held synergy is visible without opening a screen.
 line(){ return syActive().map(k=>SYNERGY_DEFS[k].ic).join(' ') },

 // Damage-side trigger. ns = "no synergy", set by anything that must not feed these back.
 crit(o,e,d,ns){ if(ns||o!='me'||!raid||e===me||!e.al)return;
  if(syReady('emberlash')){ const s0=SYNERGY_DEFS.emberlash;
   e.brn=s0.dur; e.bd=s0.dps; e.bo=o;
   burst(e.x,e.y-6,'#ff8a3c',6) } },

 // Movement-side trigger. Fires once, at the end of a dash.
 dash(e){ if(!raid||e!==me||!e.dash||!syReady('static'))return;
  const s0=SYNERGY_DEFS.static,d=e.dash;
  ents.push({t:'a',o:'me',x:d.x0,y:d.y0,r:s0.r,dmg:s0.dmg,delay:0,sl:0,col:'#7fe4ff',age:0,done:0});
  burst(d.x0,d.y0,'#7fe4ff',14);decal(d.x0,d.y0,22,'#7fe4ff');FX('ring',d.x0,d.y0,s0.r,'#7fe4ff',.3) }
};