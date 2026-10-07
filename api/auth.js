// GET  /api/auth  -> { ok, db }                 is the account server usable?
// POST /api/auth  { act:'register'|'login', name, pass, save? } -> { ok, name, role, token, save }
const L=require('./_lib');
module.exports=async(req,res)=>{try{
 if(req.method=='GET')return L.send(res,200,{ok:true,db:L.hasDb()});
 if(req.method!='POST')return L.send(res,405,{ok:false,err:'errNet'});
 if(!L.hasDb())return L.send(res,503,{ok:false,err:'errNet'});
 const b=await L.body(req),act=b.act,name=String(b.name||''),pass=String(b.pass||''),key=name.toLowerCase();
 if(act!='login'&&act!='register')return L.send(res,400,{ok:false,err:'errNet'});
 if(!L.NAME.test(name))return L.send(res,400,{ok:false,err:'errName'});
 if(pass.length<6||pass.length>64)return L.send(res,400,{ok:false,err:'errPass'});
 if(await L.limited(req,30))return L.send(res,429,{ok:false,err:'errRate'});
 // the admin lives in environment variables, not in the database
 if(key==L.ADMIN){if(act=='register')return L.send(res,409,{ok:false,err:'errTaken'});if(!L.ADMIN_PASS)return L.send(res,403,{ok:false,err:'errAdminOff'});
  if(!L.same(pass,L.ADMIN_PASS))return L.send(res,401,{ok:false,err:'errLogin'});return L.send(res,200,{ok:true,name:L.ADMIN,role:'admin',token:L.sign(key,'admin',L.adminV()),save:null})}
 if(act=='register'){const salt=L.crypto.randomBytes(16).toString('hex'),u={name,salt,hash:await L.scrypt(pass,salt),pv:1,t:Date.now()};
  if(!await L.redis('SET','cb:u:'+key,JSON.stringify(u),'NX'))return L.send(res,409,{ok:false,err:'errTaken'});
  const save=L.clean(b.save);if(save)await L.redis('SET','cb:s:'+key,JSON.stringify(save));await L.redis('SADD','cb:users',key);
  return L.send(res,200,{ok:true,name,role:'user',token:L.sign(key,'user',1),save})}
 const raw=await L.redis('GET','cb:u:'+key),u=raw?JSON.parse(raw):null,hash=await L.scrypt(pass,u?u.salt:'no-such-user');
 if(!u||!L.same(hash,u.hash))return L.send(res,401,{ok:false,err:'errLogin'});
 const sv=await L.redis('GET','cb:s:'+key);
 L.send(res,200,{ok:true,name:u.name,role:'user',token:L.sign(key,'user',u.pv||1),save:sv?JSON.parse(sv):null})
}catch(e){console.error(e);L.send(res,500,{ok:false,err:'errNet'})}};
