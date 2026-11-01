// Ranked ladder (ELO) for 1v1 online duels.
// GET  /api/ranked                                                   -> { ok, me:{elo,w,l,rank}, top:[{name,elo,w,l}] }
// POST /api/ranked { act:'report', win:1, opp:'Name' }                -> { ok, elo, d, w, l }
//
// Trust model, same as saves: the game runs in the browser, so a reported result cannot be proven
// here. What the server does enforce: the opponent must be a real registered account (not a guest,
// not yourself), only the winner reports, so one duel updates both ratings exactly once, at most
// RANK_PAIR capped wins per opponent per day and RANK_CAP reports per account per day. ELO math
// (start 1000, K=32) is done here, never on the client, and ratings live in the sorted set
// `cb:rk` so the leaderboard is a single ZREVRANGE.
const L=require('./_lib');
const START=1000,K=32,RANK_CAP=100,RANK_PAIR=10,TOPN=50;
async function rating(name){const v=await L.redis('ZSCORE','cb:rk',name);return v==null?START:Math.round(+v)}
async function stats(name){const r=await L.redis('GET','cb:rk:'+name);try{return r?JSON.parse(r):null}catch(e){return null}}
// per-day counters stored as {d:'YYYY-MM-DD',n}; they roll over by rewriting the date, so no TTL is needed locally
async function bump(key,today,cap){const r=await L.redis('GET',key),c=r?JSON.parse(r):{d:'',n:0},d=c.d===today?c.n:0;
 if(d>=cap)return null;await L.redis('SET',key,JSON.stringify({d:today,n:d+1}));await L.redis('EXPIRE',key,172800);return d+1}
module.exports=async(req,res)=>{try{
 const p=L.who(req);if(!p)return L.send(res,401,{ok:false,err:'errAuth'});
 if(!L.hasDb())return L.send(res,503,{ok:false,err:'errNet'});
 if(p.r=='admin')return L.send(res,200,{ok:true,me:{elo:START,w:0,l:0,rank:null},top:[]});  // the admin is an env-var identity, it never plays ranked
 const [ur,pr]=await L.redis('MGET','cb:u:'+p.n,'cb:rk:'+p.n),u=ur?JSON.parse(ur):null;
 if(!u||(u.pv||1)!==p.v)return L.send(res,401,{ok:false,err:'errAuth'});
 if(req.method=='GET'){
  const top=[],raw=await L.redis('ZREVRANGE','cb:rk',0,TOPN-1,'WITHSCORES')||[];
  for(let i=0;i+1<raw.length;i+=2){const s=await stats(raw[i]);top.push({name:(s&&s.nm)||raw[i],elo:Math.round(+raw[i+1]),w:s?s.w|0:0,l:s?s.l|0:0})}
  const rank=await L.redis('ZREVRANK','cb:rk',p.n),st=pr?JSON.parse(pr):null;
  return L.send(res,200,{ok:true,me:{elo:await rating(p.n),w:st?st.w|0:0,l:st?st.l|0:0,rank:rank==null?null:rank+1},top})}
 if(req.method!='POST')return L.send(res,405,{ok:false,err:'errNet'});
 const b=await L.body(req);
 if(b.act!='report'||!b.win)return L.send(res,400,{ok:false,err:'errNet'});
 if(await L.limited(req,60))return L.send(res,429,{ok:false,err:'errRate'});
 const opp=String(b.opp||'').slice(0,16).toLowerCase(),today=new Date().toISOString().slice(0,10);
 const our=opp!==p.n&&L.NAME.test(opp)?await L.redis('GET','cb:u:'+opp):null;if(!our)return L.send(res,400,{ok:false,err:'errRankOpp'});
 const onm=JSON.parse(our).name;
 // daily caps (per account, and per opponent pair so one alt cannot be farmed forever)
 const cnt=await bump('cb:rkq:'+p.n,today,RANK_CAP);if(cnt==null)return L.send(res,429,{ok:false,err:'errRankCap'});
 if(await bump('cb:rkqp:'+p.n+':'+opp,today,RANK_PAIR)==null)return L.send(res,429,{ok:false,err:'errRankCap'});
 const ra=await rating(p.n),rb=await rating(opp),d=Math.round(K*(1-1/(1+Math.pow(10,(rb-ra)/400)))),na=Math.max(100,ra+d);
 // the loser's rating drops by the same amount even though they never reported
 await L.redis('ZADD','cb:rk',na,p.n);await L.redis('ZADD','cb:rk',Math.max(100,rb-d),opp);
 const st=(pr?JSON.parse(pr):{w:0,l:0});st.nm=u.name;st.w=(st.w|0)+1;st.l=st.l|0;
 await L.redis('SET','cb:rk:'+p.n,JSON.stringify(st));
 const os=await stats(opp);if(os){os.l=(os.l|0)+1;os.nm=onm;await L.redis('SET','cb:rk:'+opp,JSON.stringify(os))}
 else await L.redis('SET','cb:rk:'+opp,JSON.stringify({nm:onm,w:0,l:1}));
 L.send(res,200,{ok:true,elo:na,d,w:st.w,l:st.l})
}catch(e){console.error(e);L.send(res,500,{ok:false,err:'errNet'})}};
