// shared helpers for the account API. Vercel turns every file in /api into a function, except names starting with "_".
// Storage is Upstash Redis over REST (Vercel Marketplace integration), so there are no npm dependencies.
const crypto=require('crypto'),fs=require('fs'),path=require('path');
const URL_=process.env.KV_REST_API_URL||process.env.UPSTASH_REDIS_REST_URL||'',TOK=process.env.KV_REST_API_TOKEN||process.env.UPSTASH_REDIS_REST_TOKEN||'';
const DEV=!URL_&&!process.env.VERCEL;                       // `node dev-server.js`: keep data in .data/db.json
const hasDb=()=>!!URL_||DEV;
const SECRET=process.env.AUTH_SECRET||crypto.createHash('sha256').update('chaos-bg:'+(TOK||'dev-only')).digest('hex');
const ADMIN=(process.env.ADMIN_USER||'admin').toLowerCase(),ADMIN_PASS=process.env.ADMIN_PASS||'';
const NAME=/^[A-Za-z0-9_]{3,16}$/,HERO=/^[A-Za-z]{2,12}$/,GEARID=/^(hb|ch|au)_[a-z]{2,4}$/,SLOTS=['head','charm','aura'],DAY=30*864e5;

let mem=null;const FILE=path.join(__dirname,'..','.data','db.json');
function local(cmd){if(!mem){try{mem=JSON.parse(fs.readFileSync(FILE,'utf8'))}catch(e){mem={}}}const [op,k,...a]=cmd;let r=null,w=false;
 switch(op){case'GET':r=mem[k]??null;break;case'SET':if(a[1]=='NX'&&k in mem)break;mem[k]=a[0];r='OK';w=true;break;case'DEL':r=k in mem?1:0;delete mem[k];w=true;break;
  case'SADD':mem[k]=[...new Set([...(mem[k]||[]),a[0]])];r=1;w=true;break;case'SREM':mem[k]=(mem[k]||[]).filter(x=>x!==a[0]);r=1;w=true;break;case'SMEMBERS':r=mem[k]||[];break;
  case'MGET':r=[k,...a].map(x=>mem[x]??null);break}
 if(w){fs.mkdirSync(path.dirname(FILE),{recursive:true});fs.writeFileSync(FILE,JSON.stringify(mem))}return r}
async function redis(...cmd){if(DEV)return local(cmd);
 const r=await fetch(URL_,{method:'POST',headers:{Authorization:'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(cmd)}),j=await r.json();if(j.error)throw new Error(j.error);return j.result}

const hmac=s=>crypto.createHmac('sha256',SECRET).update(s).digest('base64url');
// constant-time string compare
const same=(a,b)=>crypto.timingSafeEqual(crypto.createHash('sha256').update(String(a)).digest(),crypto.createHash('sha256').update(String(b)).digest());
const adminV=()=>crypto.createHash('sha256').update('v:'+ADMIN_PASS).digest('hex').slice(0,10);
const scrypt=(pass,salt)=>new Promise((res,rej)=>crypto.scrypt(pass,salt,32,(e,k)=>e?rej(e):res(k.toString('hex'))));
// token = payload.signature; n name key, r role, v password version (so a password change signs everyone out), e expiry
function sign(n,r,v){const body=Buffer.from(JSON.stringify({n,r,v,e:Date.now()+DAY})).toString('base64url');return body+'.'+hmac(body)}
function who(req){const h=String(req.headers.authorization||''),tok=h.startsWith('Bearer ')?h.slice(7):'',i=tok.indexOf('.');if(i<1)return null;const body=tok.slice(0,i);if(!same(tok.slice(i+1),hmac(body)))return null;
 try{const p=JSON.parse(Buffer.from(body,'base64url').toString());if(!(p.e>Date.now()))return null;if(p.r=='admin'&&(!ADMIN_PASS||p.v!==adminV()))return null;return p}catch(e){return null}}

async function body(req){let b;try{b=req.body}catch(e){return{}}if(b&&typeof b=='object'&&!Buffer.isBuffer(b))return b;if(typeof b=='string'){try{return JSON.parse(b)||{}}catch(e){return{}}}
 return new Promise(res=>{let d='';req.on('data',c=>{d+=c;if(d.length>65536)req.destroy()});req.on('end',()=>{try{res(JSON.parse(d||'{}')||{})}catch(e){res({})}});req.on('error',()=>res({}))})}
function send(res,code,obj){res.statusCode=code;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(obj))}
// per-address attempt counter for the login form
async function limited(req,max){if(DEV)return false;const ip=String(req.headers['x-forwarded-for']||'').split(',')[0].trim()||'unknown',k='cb:rl:'+ip,n=await redis('INCR',k);if(n==1)await redis('EXPIRE',k,600);return n>max}

// the game runs in the browser, so a save cannot be proven honest here; this only keeps it well-formed and inside the game's limits
const int=(v,a,b)=>Math.max(a,Math.min(b,Math.round(+v)||0));
function clean(s){if(!s||typeof s!='object'||Array.isArray(s))return null;const st=s.st||{},o={v:1,lvl:int(s.lvl,1,50),xp:int(s.xp,0,1e6),gold:int(s.gold,0,9999999),st:{hp:int(st.hp,0,20),sh:int(st.sh,0,20),dm:int(st.dm,0,20),sp:int(st.sp,0,20)},own:{},sel:HERO.test(s.sel)?s.sel:'Ren',stage:int(s.stage,1,51),stars:{},raid:int(s.raid,0,99999),rb:int(s.rb,0,99),kills:int(s.kills,0,1e9),q:{},pb:[],gw:{},eq:{},daily:String(s.daily||'').slice(0,10),streak:int(s.streak,0,9999),wins:int(s.wins,0,1e7),ts:int(s.ts,0,9e15)};
 if(o.st.hp+o.st.sh+o.st.dm+o.st.sp>o.lvl-1)o.st={hp:0,sh:0,dm:0,sp:0};
 if(s.own&&typeof s.own=='object')for(const k of Object.keys(s.own).slice(0,80))if(HERO.test(k))o.own[k]=int(s.own[k],1,10);
 if(s.stars&&typeof s.stars=='object')for(let i=1;i<=50;i++){const v=int(s.stars[i],0,3);if(v)o.stars[i]=v}
 if(s.q&&typeof s.q=='object')for(const k of Object.keys(s.q).slice(0,60))if(/^[a-z0-9]{1,8}$/.test(k)&&s.q[k])o.q[k]=1;
 if(Array.isArray(s.pb))for(const b of s.pb.slice(0,3))if(typeof b=='string'&&b.length<=24)o.pb.push(b);
 // accessories: only keep known ids, and only equip a piece that is actually owned
 if(s.gw&&typeof s.gw=='object')for(const k of Object.keys(s.gw).slice(0,64))if(GEARID.test(k))o.gw[k]=1;
 if(s.eq&&typeof s.eq=='object')for(const sl of SLOTS){const v=s.eq[sl];if(typeof v=='string'&&GEARID.test(v)&&o.gw[v])o.eq[sl]=v}
 return o}

module.exports={crypto,redis,hasDb,ADMIN,ADMIN_PASS,NAME,same,adminV,scrypt,sign,who,body,send,limited,clean};
