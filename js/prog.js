// ============================================================================================
// Lightweight post-match progression: match statistics, achievements, challenges and cosmetic
// badges. Stored in its OWN localStorage key (cb_prog) so it never mixes with account saves,
// and validated on load so a corrupt/outdated file degrades to a fresh profile instead of
// breaking the game.
// ============================================================================================
const PROG_KEY='cb_prog', PROG_VERSION=1;
const PROG_DEFAULTS=()=>({v:PROG_VERSION, matches:0, wins:0, kills:0, bosses:0, arenaWins:0,
  bestScore:0, bestSurvival:0, bestFloor:0, achievements:[], challenges:[], badges:[], recent:[]});

// Validate + migrate anything loaded from storage.
function progLoad(){
  let raw=null;
  try{raw=localStorage.getItem(PROG_KEY)}catch(e){return PROG_DEFAULTS()}
  if(raw==null)return PROG_DEFAULTS();
  let p=null;
  try{p=JSON.parse(raw)}catch(e){return PROG_DEFAULTS()}
  if(!p||typeof p!=='object')return PROG_DEFAULTS();
  const num=(x,lo,hi)=> (typeof x==='number'&&isFinite(x))? Math.max(lo,Math.min(hi,Math.round(x))) : 0;
  const strs=x=> Array.isArray(x)? x.filter(v=>typeof v==='string').slice(0,100) : [];
  const out=PROG_DEFAULTS();
  out.matches=num(p.matches,0,1e9);
  out.wins=num(p.wins,0,1e9);
  out.kills=num(p.kills,0,1e9);
  out.bosses=num(p.bosses,0,1e9);
  out.arenaWins=num(p.arenaWins,0,1e9);
  out.bestScore=num(p.bestScore,0,1e9);
  out.bestSurvival=num(p.bestSurvival,0,1e9);
  out.bestFloor=num(p.bestFloor,0,1e9);
  out.achievements=strs(p.achievements);
  out.challenges=strs(p.challenges);
  out.badges=strs(p.badges);
  out.recent=strs(p.recent);
  // version migration hook: older profiles keep their numbers, only new fields default
  if(typeof p.v!=='number')out.v=PROG_VERSION;
  return out;
}
function progSave(){try{localStorage.setItem(PROG_KEY,JSON.stringify(PROG))}catch(e){}}

let PROG=progLoad();

function progState(){return PROG}

// ---- achievements & challenges (pure data + check functions) ---------------------------
const ACHIEVEMENTS=[
 {id:'first_blood', name:'First Blood', desc:'Win your first match.', check:p=>p.wins>=1, reward:{gold:100, badge:'first_blood'}},
 {id:'veteran', name:'Veteran', desc:'Win 10 matches.', check:p=>p.wins>=10, reward:{gold:500, badge:'veteran'}},
 {id:'hunter', name:'Hunter', desc:'Defeat 100 enemies.', check:p=>p.kills>=100, reward:{gold:300, badge:'hunter'}},
 {id:'survivor', name:'Survivor', desc:'Survive 5 minutes in one run.', check:p=>p.bestSurvival>=300, reward:{gold:200, badge:'survivor'}},
 {id:'boss_slayer', name:'Boss Slayer', desc:'Defeat a boss.', check:p=>p.bosses>=1, reward:{gold:400, badge:'boss_slayer'}}];
const CHALLENGES=[
 {id:'arena_trio', name:'Arena Trio', desc:'Win 3 arena matches.', check:(p,m)=>p.arenaWins>=3},
 {id:'slaughter', name:'Slaughter', desc:'Defeat 50 enemies in one run.', check:(p,m)=>!!(m&&m.kills>=50)},
 {id:'deep_diver', name:'Deep Diver', desc:'Reach floor 5 in raid.', check:(p,m)=>p.bestFloor>=5},
 {id:'stage_clear', name:'Stage Clear', desc:'Clear stage 10.', check:(p,m)=> (m&&m.mode==='stage'&&m.win&& (m.stage||0)>=10) }];

function progGrant(reward){
  if(!reward)return;
  if(typeof S!=='undefined'&&S&&reward.gold){S.gold=(S.gold||0)+reward.gold; if(typeof persist==='function')persist()}
  if(reward.badge&&!PROG.badges.includes(reward.badge))PROG.badges.push(reward.badge);
  if(typeof toast==='function')toast((reward.gold?'+🪙 '+reward.gold+' ':'')+(reward.badge?'🏅 '+reward.badge:''),0);
}

// ---- record one completed match (deduped) ---------------------------------------------
function progRecordMatch(stats){
  if(!stats||typeof stats!=='object')return;
  const mode=String(stats.mode||'match');
  const matchId=String(stats.matchId||(mode+'|'+(stats.time||0)+'|'+(stats.kills||0)+'|'+Date.now()));
  // dedup: never process the same match twice
  if(PROG.recent.includes(matchId))return;
  PROG.recent.push(matchId); if(PROG.recent.length>20)PROG.recent.shift();
  if(typeof PROG.lastMatchId!=='undefined')PROG.lastMatchId=matchId;

  const win=!!stats.win;
  const kills=Math.max(0, Math.round(+stats.kills||0));
  const time=Math.max(0, Math.round(+stats.time||0));
  const score=Math.max(0, Math.round(+stats.score||0));
  const bosses=Math.max(0, Math.round(+stats.bosses||0));
  const floor=Math.max(0, Math.round(+stats.floor||0));

  PROG.matches++;
  if(win)PROG.wins++;
  PROG.kills+=kills;
  PROG.bosses+=bosses;
  if(mode==='arena'&&win)PROG.arenaWins++;
  if(score>PROG.bestScore)PROG.bestScore=score;
  if(time>PROG.bestSurvival)PROG.bestSurvival=time;
  if(floor>PROG.bestFloor)PROG.bestFloor=floor;

  const match={mode,win,kills,time,score,bosses,floor,stage:stats.stage||0};
  // achievements
  for(const a of ACHIEVEMENTS){
    if(!PROG.achievements.includes(a.id)&&a.check(PROG,match)){
      PROG.achievements.push(a.id); progGrant(a.reward);
    }
  }
  // challenges
  for(const c of CHALLENGES){
    if(!PROG.challenges.includes(c.id)&&c.check(PROG,match)){
      PROG.challenges.push(c.id); progGrant({gold:200, badge:c.id});
    }
  }
  progSave();
}

// ---- tiny UI helper -------------------------------------------------------------------
function progCard(){
  const p=PROG;
  const badges=p.badges.length?p.badges.map(b=>`<span class="chip">🏅 ${b}</span>`).join(''):'<span class="mut">—</span>';
  return `<div class="card" style="margin-top:10px"><b>📊 Progress</b>
   <div class="chips" style="justify-content:inherit;margin:6px 0 0">
    <span class="chip">Matches ${p.matches}</span><span class="chip">Wins ${p.wins}</span>
    <span class="chip">Kills ${p.kills}</span><span class="chip">Best ${p.bestScore}</span>
    <span class="chip">Survive ${Math.floor(p.bestSurvival/60)}:${String(p.bestSurvival%60).padStart(2,'0')}</span>
   </div>
   <div style="margin-top:6px">${badges}</div></div>`;
}
