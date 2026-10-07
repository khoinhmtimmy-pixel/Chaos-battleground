// POST /api/admin { act:'list' | 'get' | 'put' | 'del' | 'pass', name?, save?, pass? }   admin token only
const L=require('./_lib');
module.exports=async(req,res)=>{try{
 const p=L.who(req);if(!p||p.r!='admin')return L.send(res,403,{ok:false,err:'errAuth'});
 if(req.method!='POST')return L.send(res,405,{ok:false,err:'errNet'});
 const b=await L.body(req),key=String(b.name||'').toLowerCase();
 if(b.act=='list'){const names=((await L.redis('SMEMBERS','cb:users'))||[]).sort().slice(0,300);if(!names.length)return L.send(res,200,{ok:true,users:[]});
  const us=await L.redis('MGET',...names.map(n=>'cb:u:'+n)),ss=await L.redis('MGET',...names.map(n=>'cb:s:'+n)),users=[];
  names.forEach((n,i)=>{if(!us[i])return;const u=JSON.parse(us[i]),s=ss[i]?JSON.parse(ss[i]):{};users.push({name:u.name,lvl:s.lvl||1,gold:s.gold||0,stage:s.stage||1,own:s.own||{},ts:s.ts||0})});
  return L.send(res,200,{ok:true,users})}
 if(!L.NAME.test(key)||key==L.ADMIN)return L.send(res,400,{ok:false,err:'errName'});
 const raw=await L.redis('GET','cb:u:'+key);if(!raw)return L.send(res,404,{ok:false,err:'errName'});
 if(b.act=='get'){const s=await L.redis('GET','cb:s:'+key);return L.send(res,200,{ok:true,save:s?JSON.parse(s):null})}
 if(b.act=='put'){const s=L.clean(b.save);if(!s)return L.send(res,400,{ok:false,err:'errNet'});await L.redis('SET','cb:s:'+key,JSON.stringify(s));return L.send(res,200,{ok:true})}
 if(b.act=='del'){await L.redis('DEL','cb:u:'+key);await L.redis('DEL','cb:s:'+key);await L.redis('SREM','cb:users',key);return L.send(res,200,{ok:true})}
 if(b.act=='pass'){const pass=String(b.pass||'');if(pass.length<6||pass.length>64)return L.send(res,400,{ok:false,err:'errPass'});
  const u=JSON.parse(raw);u.salt=L.crypto.randomBytes(16).toString('hex');u.hash=await L.scrypt(pass,u.salt);u.pv=(u.pv||1)+1;await L.redis('SET','cb:u:'+key,JSON.stringify(u));return L.send(res,200,{ok:true})}
 L.send(res,400,{ok:false,err:'errNet'})
}catch(e){console.error(e);L.send(res,500,{ok:false,err:'errNet'})}};
