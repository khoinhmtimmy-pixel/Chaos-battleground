// GET  /api/save            -> { ok, name, role, save }   (Authorization: Bearer <token>)
// POST /api/save { save }   -> { ok }
const L=require('./_lib');
module.exports=async(req,res)=>{try{
 const p=L.who(req);if(!p)return L.send(res,401,{ok:false,err:'errAuth'});
 if(!L.hasDb())return L.send(res,503,{ok:false,err:'errNet'});
 if(p.r=='admin')return L.send(res,200,{ok:true,name:p.n,role:'admin',save:null});   // admin progress is always "everything", nothing to store
 const [ur,sr]=await L.redis('MGET','cb:u:'+p.n,'cb:s:'+p.n),u=ur?JSON.parse(ur):null;
 if(!u||(u.pv||1)!==p.v)return L.send(res,401,{ok:false,err:'errAuth'});
 if(req.method=='GET')return L.send(res,200,{ok:true,name:u.name,role:'user',save:sr?JSON.parse(sr):null});
 if(req.method!='POST')return L.send(res,405,{ok:false,err:'errNet'});
 const s=L.clean((await L.body(req)).save);if(!s)return L.send(res,400,{ok:false,err:'errNet'});
 await L.redis('SET','cb:s:'+p.n,JSON.stringify(s));L.send(res,200,{ok:true})
}catch(e){console.error(e);L.send(res,500,{ok:false,err:'errNet'})}};
