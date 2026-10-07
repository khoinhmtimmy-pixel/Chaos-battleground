window.addEventListener('error',e=>{let b=document.getElementById('errb');if(!b){b=document.createElement('div');b.id='errb';b.style.cssText='position:fixed;left:0;right:0;bottom:0;z-index:99;background:#b00020;color:#fff;font:12px monospace;padding:6px;user-select:text';document.body.appendChild(b)}b.textContent='Error: '+e.message+' (line '+e.lineno+')'});
const cv=document.getElementById('c'),$=id=>document.getElementById(id);let ctx=cv.getContext('2d',{alpha:false});
let W=900,H=600;
if(!CanvasRenderingContext2D.prototype.roundRect)CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h){this.rect(x,y,w,h)};
// quality tiers: particle cap, max pixel ratio, projectile trail chance, full-size effects
const QL=[{pc:520,dpr:2,tr:.8,fx:1},{pc:300,dpr:1.5,tr:.5,fx:1},{pc:150,dpr:1,tr:.25,fx:0}];let Q=QL[0],qset=-1;const qa={lock:0,trial:0,prev:0};
function setQ(i){Q=QL[Math.max(0,Math.min(2,i))];GC.k='';resize()}
const P=(x,y,vx,vy,l,c,s)=>{if(parts.length<Q.pc)parts.push({x,y,vx,vy,l,m:l,c,s})};
const burst=(x,y,c,n)=>{if(!Q.fx)n=n+1>>1;for(let i=0;i<n;i++){const a=Math.random()*6.283,v=60+Math.random()*240;P(x,y,Math.cos(a)*v,Math.sin(a)*v,.35+Math.random()*.3,c,2+Math.random()*4)}};
const num=(x,y,v,c)=>{if(txts.length<60)txts.push({x:x+(Math.random()-.5)*16,y,s:Math.max(1,Math.round(v)),c,l:.8,m:.8})};
const say=(x,y,s,c)=>txts.push({x,y,s,c,l:1.1,m:1.1,big:1});
const SPK=Array.from({length:80},()=>[Math.random()*900,Math.random()*600,1+Math.random()*2]),SKIN='#ffe2cc';
function resize(){dpr=Math.min(Q.dpr,devicePixelRatio||1);VG=null;pd=0;const r=$('w').getBoundingClientRect();cw=r.width;chh=r.height;cv.width=cw*dpr;cv.height=chh*dpr;K=Math.max(Math.min(cw/W,chh/H),touch?.95:.9)}
addEventListener('resize',resize);
let PIL=[[300,200,38],[600,200,38],[300,400,38],[600,400,38],[450,300,30]],SP=[[70,70],[830,70],[70,530],[830,530]];
let kf=[],an=[],fb=0,matchT=0,BUSH=[],tmode=false,onlineTeam=false,autoAim=false,lockT=null,decals=[],pk=[],chest=null,portal=null,choice=null,nid=0,raid=null,aim=null,hold=0,joining=0,MAP=0,onlineMap=0,train=0,loc2=0,k2={},cam={x:0,y:0},K=1,VW=900,VH=600,cw=900,chh=600,dpr=1,touch=matchMedia("(pointer:coarse)").matches,joy={x:0,y:0},parts=[],txts=[],shake=0,sel=0,me,others={},ents=[],R=null,keys={},mouse={x:450,y:300,down:false},last=0,over=0,winner='',lastHit=null,flash=0,run=0,pt=0,tm=0,joinT=Date.now(),paused=0,pd=0,allC=null,raf=0,fts=.016,slowT=0,VG=null,VR=null,flashS=0;
$('mpsel').innerHTML=MAPS.map((m,i)=>'<option value="'+i+'">'+m.n+'</option>').join('')+'<option value="r">🎲 Random</option>';
$('rc').value=Math.random().toString(36).slice(2,6);
// armor (sd of sm) soaks hits first and recharges SHD seconds after the last hit; health never regenerates on its own
const SHD=3.5,SHR=.22,shOf=c=>(c.boss||c.foe)?0:Math.round(15+c.hp*.3);
const mk=(ch,x,y,nm,bot)=>{const c=CH[ch],f=bot?.8:1,sm=Math.round(shOf(c)*f);return{x,y,ch,hp:c.hp*f,mx:c.hp*f,sd:sm,sm,sdt:0,k:0,al:1,nm,bot,cd:{a:0,q:0,e:0,r:0},sh:0,sl:0,a:0,dash:null,rt:0,tx:x,ty:y}};
const rs=()=>SP[Math.random()*4|0];
const all=()=>allC||(allC=[['me',me],...Object.entries(others)]);
const myPeer=()=>{const p=R&&R.peers().find(p=>p.isMe);return p&&p.peer};
function begin(online,loc,dummy,raidMode,teamArg){tmode=!!(online?onlineTeam:teamArg);kf=[];an=[];fb=0;matchT=0;choice=null;chest=null;portal=null;pk=[];decals=[];parts=[];txts=[];aim=null;hold=0;paused=0;allC=null;flash=0;shake=0;autoAim=!!($('aa')&&$('aa').checked);{const mv=$('mpsel').value;setMap(online?onlineMap:(mv=='r'?Math.random()*MAPS.length|0:(+mv||0)));if(tmode&&!online&&!MAPS[MAP].w)setMap(BIG[Math.random()*BIG.length|0])}loc2=!online&&!!loc;train=!online&&!!dummy;
 const nm=$('nm').value.trim()||'Hero';me=mk(sel,450,300,nm);me.tm=0;me.x=SP[0][0];me.y=SP[0][1];others={};ents=[];over=0;lastHit=null;
 if(!online&&dummy){R=null;const d=mk(0,450,150,'Dummy',true);d.dum=1;d.hp=d.mx=99999;d.sd=d.sm=0;d.log=[];d.tot=0;others.d0=d;d.x=450;d.y=60}else if(!online&&teamArg){R=null;const pool=NORM.filter(i=>i!=sel).sort(()=>Math.random()-.5),al=mk(pool.pop(),SP[2][0],SP[2][1],'Ally',true),e1=mk(pool.pop(),SP[1][0],SP[1][1],'Enemy 1',true),e2=mk(pool.pop(),SP[3][0],SP[3][1],'Enemy 2',true);al.tm=0;e1.tm=e2.tm=1;others.b0=al;others.b1=e1;others.b2=e2}else if(!online){R=null;const nb=loc?2:3,pool=NORM.filter(i=>i!=sel).sort(()=>Math.random()-.5);if(loc){const p=SP[1];others.p2=mk(pool.pop(),p[0],p[1],'Player 2');others.p2.loc=1;me.nm=nm+' (P1)'}for(let i=0;i<nb;i++){const p=SP[i+(loc?2:1)];others['b'+i]=mk(pool.pop(),p[0],p[1],'Bot '+(i+1),true)}}
 $('m').style.display='none';$('mb').style.display='block';if(!online&&raidMode){others={};newRun(raidMode);spawnRoom()}else raid=null;allC=null;resize();lab();UI.game();if(!run){run=1;last=performance.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(loop)}}
// a PvE run (campaign stage or endless raid); account stats and pre-bought buffs come from pveStats()
function bfStr(r){r.bfs=Object.entries(r.bf).map(([k,v])=>(BUFFS.find(b=>b.n==k)||{}).ic+(v>1?'×'+v:'')).join(' ')}
function newRun(cfg){const s=pveStats(),c=CH[me.ch];me.mx=me.hp=Math.round(c.hp*s.hp);me.sm=me.sd=Math.round(shOf(c)*s.sh);
 const r=raid={mode:cfg.mode,stage:cfg.stage||0,plan:cfg.mode=='stage'?stagePlan(cfg.stage):null,wave:1,floor:1,room:1,revived:0,score:0,gold:0,kills:0,rooms:0,hit:0,state:'fight',t:0,dm:s.dm,cd:1,sp:s.sp,ls:0,cr:0,mg:1,sr:1,gm:1,bf:{},fid:{},queue:[],spawnT:0};
 for(const n of s.buffs){const b=BUFFS.find(b=>b.n==n);if(b){b.f(r);r.bf[b.n]=(r.bf[b.n]||0)+1}}bfStr(r)}
$('bp').onclick=()=>begin(false);$('bl').onclick=()=>begin(false,1);$('bd').onclick=()=>begin(false,0,1);$('bt2').onclick=()=>begin(false,0,0,0,1);$('bw').addEventListener('pointerdown',e=>{awaken();e.preventDefault()});
function leave(t){if(R){try{R.leave()}catch(e){}}R=null;run=0;paused=0;raid=null;choice=null;$('m').style.display='block';$('mb').style.display='none';UI.home(t||'')}
function sendPres(){if(R)R.presence({ch:me.ch,x:Math.round(me.x),y:Math.round(me.y),hp:Math.round(me.hp),sd:Math.round(me.sd),sm:me.sm,mp:MAP,k:me.k,al:me.al,aw:me.awt>0?1:0,sh:me.sh>0?1:0,a:+me.a.toFixed(2),nm:me.nm,t:joinT})}
function dest(e,s,tx,ty){let d=s.dist;if(s.to)d=Math.min(d,Math.hypot(tx-e.x,ty-e.y));
 return[Math.max(20,Math.min(W-20,e.x+Math.cos(e.a)*d)),Math.max(20,Math.min(H-20,e.y+Math.sin(e.a)*d))]}
function tryCast(e,id,key,tx,ty){const s=CH[e.ch].s[key];if(!e.al||e.cd[key]>0||e.dash||e.stn>0||s.nm=='-')return;e.cd[key]=s.cd;
 const d={c:e.ch,s:key,x:e.x,y:e.y,a:e.a,tx:s.cur?tx:e.x,ty:s.cur?ty:e.y};
 if(s.k=='dash'||s.k=='blink'){[d.tx,d.ty]=dest(e,s,tx,ty)}
 cast(e,id,d,true);if(R&&id=='me')R.emit('fx',d)}
// same side: raid enemies with each other, or teammates in 2v2
const ally=(o,e)=>raid?!!(e.raidE&&raid.fid[o]):tmode?!!(ent(o)&&ent(o)!==e&&ent(o).tm===e.tm):false;
function cast(e,o,d,local){const c=CH[d.c],s=c.s[d.s];if(e)e.rv=tm+1.2;if(local&&o=='me')sfx(d.s=='a'?'atk':d.s=='r'?'ult':'skl');
 if(d.s!='a')say(d.x,d.y-50,s.nm+'!',c.col);if(d.s=='r'&&local)shake=.3;
 if(s.k=='proj')burst(d.x+Math.cos(d.a)*20,d.y+Math.sin(d.a)*20,c.col,d.s=='a'?4:14);
 if(s.k=='dash'||s.k=='blink')for(let i=0;i<16;i++){const u=i/15;P(d.x+(d.tx-d.x)*u,d.y+(d.ty-d.y)*u,0,-25,.35+u*.25,c.col,11-u*5)}
 if(s.k=='dash'||s.k=='blink')for(let i=0;i<5;i++){const u=i/4;decals.push({x:d.x+(d.tx-d.x)*u,y:d.y+(d.ty-d.y)*u,col:c.col,g:1,l:.45+u*.35,m:.8,r:0,cr:[],rot:0})}
 if(s.k=='shield')burst(d.x,d.y,'#ffffff',16);
 if(s.k=='proj'){const n=s.n||1;for(let i=0;i<n;i++){const a=n==1?d.a:(s.spread>=6?d.a+i*6.2832/n:d.a-s.spread/2+s.spread*i/(n-1));
  ents.push({t:'p',o,x:d.x,y:d.y,vx:Math.cos(a)*s.spd,vy:Math.sin(a)*s.spd,r:s.r,dmg:s.dmg,life:s.life,sl:s.sl||0,col:c.col,pierce:s.pierce,home:s.home,kb:s.kb,st:s.st,dot:s.dot})}}
 else if(s.k=='nova')ents.push({t:'a',o,x:d.tx,y:d.ty,r:s.r,dmg:s.dmg,delay:s.delay,sl:s.sl||0,col:c.col,age:0,done:0,kb:s.kb,st:s.st,dot:s.dot});
 else if(s.k=='dash'){if(local&&e)e.dash={x0:e.x,y0:e.y,x1:d.tx,y1:d.ty,t:0};ents.push({t:'a',o,x:d.tx,y:d.ty,r:s.nova.r,dmg:s.nova.dmg,delay:.2,sl:0,col:c.col,age:0,done:0,kb:s.nova.kb,st:s.nova.st,dot:s.nova.dot})}
 else if(s.k=='blink'){ents.push({t:'a',o,x:d.x,y:d.y,r:28,dmg:0,delay:0,sl:0,col:c.col,age:0,done:0});if(local&&e){e.x=d.tx;e.y=d.ty}
  ents.push({t:'a',o,x:d.tx,y:d.ty,r:28,dmg:0,delay:0,sl:0,col:c.col,age:0,done:0})}
 else if(s.k=='shield'&&local&&e)e.sh=s.dur;else if(s.k=='heal'){if(local&&e)e.hp=Math.min(e.mx,e.hp+s.amt);burst(d.x,d.y,'#7dffb0',26)}else if(s.k=='haste'){if(local&&e){e.hst=s.dur;if(s.sh)e.sh=s.sh}burst(d.x,d.y,c.col,20)}
 else if(s.k=='cone')ents.push({t:'c',o,x:d.x,y:d.y,a:d.a,r:s.r,arc:s.arc,dmg:s.dmg,sl:s.sl||0,kb:s.kb,st:s.st,dot:s.dot,life:.25,age:0,done:0,col:c.col});
 else if(s.k=='beam')ents.push({t:'b',o,x:d.x,y:d.y,a:d.a,len:s.len,w:s.w,dmg:s.dmg,sl:s.sl||0,dur:s.dur,dot:s.dot,st:s.st,age:0,tk:0,life:1,col:c.col});
 else if(s.k=='orbit')ents.push({t:'o',o,n:s.n,rad:s.rad,dmg:s.dmg,sl:0,dur:s.dur,age:0,life:1,h:{},col:c.col});
 else if(s.k=='zone')ents.push({t:'z',o,x:d.tx,y:d.ty,r:s.r,dur:s.dur,pull:s.pull||0,dps:s.dps||0,heal:s.heal||0,sl:s.sl||0,age:0,life:1,col:c.col,dm:(e&&e.dmgMul||1)*(o=='me'&&raid?raid.dm:1)});
 else if(s.k=='mine')ents.push({t:'a',o,x:d.x,y:d.y,r:s.r,dmg:s.dmg,delay:8,sl:s.sl||0,col:c.col,age:0,done:0,mine:1,st:s.st,dot:s.dot,kb:s.kb});
 else if(s.k=='rain'){for(let i=0;i<s.n;i++){const an=i*2.4,rd=s.rad*Math.sqrt((i+.5)/s.n);ents.push({t:'a',o,x:d.tx+Math.cos(an)*rd,y:d.ty+Math.sin(an)*rd,r:s.r,dmg:s.dmg,delay:.4+i*s.gap,sl:0,col:c.col,age:0,done:0})}}
 else if(s.k=='chain'){const pts=[{x:d.x,y:d.y}],ids=[];let cx=d.x,cy=d.y;for(let j=0;j<s.n;j++){let t=null,bd=s.rng,tid=null;for(const [i2,o2] of all())if(i2!=o&&o2.al&&!ids.includes(i2)&&!ally(o,o2)){const dd=Math.hypot(o2.x-cx,o2.y-cy);if(dd<bd){bd=dd;t=o2;tid=i2}}if(!t)break;ids.push(tid);pts.push({x:t.x,y:t.y});cx=t.x;cy=t.y;hurt(tid,t,s.dmg,0,o,{st:s.st})}ents.push({t:'l',pts,life:.35,m:.35,col:c.col})}}
// d lands on armor first; returns what reached health. q = quiet (burn / zone ticks)
function dmgTo(e,d,q){e.sdt=SHD;let a=0;if(e.sd>0){a=Math.min(e.sd,d);e.sd-=a;if(e.sd<=0){e.sd=0;if(!q||e===me){burst(e.x,e.y-6,'#9fd8ff',16);say(e.x,e.y-58,'SHIELD BREAK','#9fd8ff');if(e===me)sfx('brk')}}}e.hp-=d-a;return d-a}
function hurt(id,e,dmg,sl,o,x){if(!e.al||(dmg<=0&&!x))return;if(raid&&e.raidE&&raid.fid[o])return;if(tmode){const o1=ent(o);if(o1&&o1!==e&&o1.tm===e.tm)return}
 const ow=ent(o);let mul=1,crit=0;if(ow&&ow.awt>0)mul*=1.6;if(ow&&ow.dmgMul)mul*=ow.dmgMul;if(o=='me'&&raid)mul*=raid.dm;
 if(!(id=='me'||e.bot||e.loc)){if(dmg>0&&!(e.sh>0))num(e.x,e.y-20,dmg*mul);return}if(e.sh>0)return;dmg*=mul;
 if(o=='me'&&raid){if(dmg>0&&Math.random()<raid.cr){dmg*=2;crit=1}if(raid.ls&&e.raidE)me.hp=Math.min(me.mx,me.hp+dmg*raid.ls)}if(id=='me')me.aw=Math.min(100,(me.aw||0)+dmg*.25);else if(o=='me')me.aw=Math.min(100,(me.aw||0)+dmg*.4*(raid?raid.mg:1));
 const hd=dmgTo(e,dmg);if(dmg>0)num(e.x,e.y-20,dmg,crit?'#ff9d2e':hd<dmg*.5?'#9fd8ff':0);e.hft=tm+.12;e.sl=Math.max(e.sl,sl);if(e.dum){e.log.push({t:tm,d:dmg});e.tot+=dmg}
 if(x){if(x.st&&!e.boss){e.stn=Math.max(e.stn||0,x.st);burst(e.x,e.y-20,'#ffe14d',6)}if(x.dot){e.brn=x.dot.t;e.bd=x.dot.d*mul;e.bo=o}
  if(x.kb&&!e.boss){const d=Math.hypot(e.x-x.x,e.y-x.y)||1,f=x.kb<0?-Math.min(-x.kb,d):x.kb;e.dash=null;move(e,(e.x-x.x)/d*f,(e.y-x.y)/d*f)}}
 if(id=='me'){lastHit=o;flashS=hd>0?0:1;flash=hd>0?.15:.07;shake=Math.max(shake,hd>0?.25:.1);if(raid)raid.hit+=hd;if(dmg>0)sfx(hd>0?'hurt':'blk');if(me.hp<=0)die()}else{if(o=='me'&&dmg>0)sfx('hit');if(e.hp<=0){e.al=0;e.rt=3;credit(o,e)}}}
function freeSpot(c){for(const p of c)if(!hitPil(p[0],p[1],34))return{x:p[0],y:p[1]};return{x:c[0][0],y:c[0][1]}}
function spawnRoom(){const r=raid,st=r.mode=='stage';allC=null;r.wave=(r.floor-1)*5+r.room;for(const id in others)delete others[id];ents=[];pk=[];chest=null;portal=null;choice=null;r.fid={};
 const rm=r.rm=st?r.plan.rooms[r.room-1]:{type:r.room==5?'boss':(r.room==3?'treasure':'fight'),map:SMALL[Math.random()*SMALL.length|0],n:Math.min(12,4+r.floor+r.room),boss:BOSS[(r.floor-1)%BOSS.length],adds:3};
 setMap(rm.map);me.x=SP[0][0];me.y=SP[0][1];me.dash=null;r.type=rm.type;r.queue=[];r.spawnT=.8;
 r.hs=st?r.plan.hs:1.15*(1+.2*(r.floor-1)+.05*(r.room-1));r.ds=st?r.plan.ds:1.1+.1*(r.floor-1);r.gv=st?1+.05*(r.stage-1):1+.15*(r.floor-1);
 if(rm.type=='boss'){const bi=rm.boss,b=mk(bi,450,110,CH[bi].n,true);b.boss=1;b.raidE=1;b.mx=b.hp=Math.round(CH[bi].hp*r.hs*1.04);b.dmgMul=r.ds*.88;others.boss=b;r.fid.boss=1;spawnFoes(rm.adds);r.state='fight';sfx('boss')}
 else if(rm.type=='treasure'){roomClear(true)}
 else{const n=rm.n;r.queue=[Math.ceil(n*.6),Math.floor(n*.4)].filter(x=>x>0);r.state='fight'}
 say(450,230,(st?'STAGE '+(r.plan.c+1)+'-'+r.plan.i:'FLOOR '+r.floor)+' - ROOM '+r.room+(rm.type=='boss'?'  BOSS!':rm.type=='treasure'?'  TREASURE':''),'#ffe14d');shake=.25}
// el = spawn guaranteed elites (stage finales)
function spawnFoes(n,el){const r=raid,base=r.rm.pool||((r.floor>1||r.room>3)?FOE:FOE.slice(0,5)),eli=base.filter(i=>CH[i].elite),pool=el?(eli.length?eli:ELITE):base;allC=null;
 for(let i=0;i<n;i++){let pos=null;for(let k=0;k<40&&!pos;k++){const x=70+Math.random()*760,y=70+Math.random()*460;if(Math.hypot(x-me.x,y-me.y)>260&&!hitPil(x,y,26))pos=[x,y]}pos=pos||[800,500];
  let c=pool[Math.random()*pool.length|0];if(!el&&CH[c].elite&&Math.random()<.65)c=pool[Math.random()*pool.length|0];
  const e=mk(c,pos[0],pos[1],CH[c].n,true),id='f'+(nid++);
  e.foe=1;e.raidE=1;e.mx=e.hp=Math.round(CH[c].hp*r.hs);e.dmgMul=r.ds;e.stn=.9;others[id]=e;r.fid[id]=1;decal(pos[0],pos[1],36,CH[c].col);burst(pos[0],pos[1],CH[c].col,14)}}
function dropLoot(e){const el=CH[e.ch].elite,n=e.boss?12:el?5:1+(Math.random()*3|0);for(let i=0;i<n;i++)pk.push({x:e.x+(Math.random()-.5)*40,y:e.y+(Math.random()-.5)*40,t:'coin',v:e.boss?5:(Math.random()<.2?2:1)});
 if(Math.random()<(e.boss?1:el?.4:.07))pk.push({x:e.x,y:e.y,t:'hp',v:.2});if(Math.random()<.3)pk.push({x:e.x+10,y:e.y-8,t:'en',v:12})}
function roomClear(quiet){const r=raid;r.state='clear';if(!quiet){r.rooms++;r.score+=50*r.wave;say(me.x,me.y-70,'ROOM CLEARED!','#7dffb0');sfx('clear')}
 if(r.mode=='stage'&&r.room>=r.plan.rooms.length){r.state='win';r.winT=2.2;me.sh=9;me.brn=0;ents=[];return}
 const cp=freeSpot([[450,300],[450,200],[450,400],[330,300],[570,300],[300,150]]),pp=freeSpot([[450,60],[450,540],[90,300],[810,300]]);
 chest={x:cp.x,y:cp.y,open:false};portal={x:pp.x,y:pp.y};if(quiet){pk.push({x:cp.x-60,y:cp.y+40,t:'hp',v:.3},{x:cp.x+60,y:cp.y+40,t:'en',v:40})}}
function nextRoom(){const r=raid;r.room++;if(r.mode!='stage'&&r.room>5){r.floor++;r.room=1}sfx('port');spawnRoom()}
function openChoice(){const l=BUFFS.filter(b=>!(b.run&&me.hp>me.mx*.85)).sort(()=>Math.random()-.5).slice(0,3);choice={list:l};UI.choice(l)}
function pickBuff(i){if(!choice||!choice.list[i])return;const b=choice.list[i];b.f(raid);raid.bf[b.n]=(raid.bf[b.n]||0)+1;bfStr(raid);say(me.x,me.y-60,b.n+'!','#ffe14d');burst(me.x,me.y,'#ffe14d',24);sfx('buff');choice=null;UI.choice(null)}
function raidTick(dt){const r=raid;if(r.state=='over')return;
 if(r.state=='down'){r.downT-=dt;if(r.downT<=0){paused=1;UI.down(r)}return}
 if(r.state=='win'){r.winT-=dt;if(r.winT<=0){endRun(true);return}}
 r.t+=dt;
 if(r.state=='fight'){r.spawnT-=dt;let live=0;for(const id in others)if(others[id].raidE&&others[id].al)live++;
  if(!live&&r.spawnT<=0){if(r.queue.length){spawnFoes(r.queue.shift());if(!r.queue.length&&r.rm.elite)spawnFoes(r.rm.elite,1);r.spawnT=.7}else roomClear(false)}}
 // loot flies in once the room is cleared; potions wait until they are needed
 const suck=r.state!='fight';
 for(const p of pk){const d=Math.hypot(me.x-p.x,me.y-p.y),want=p.t!='hp'||me.hp<me.mx;
  if(me.al&&want&&d>1&&(d<110||(suck&&p.t!='hp'))){const v=Math.min(d,(suck?520:280)*dt);p.x+=(me.x-p.x)/d*v;p.y+=(me.y-p.y)/d*v}
  if(me.al&&want&&d<22){p.dead=1;if(p.t=='coin'){r.gold+=p.v*r.gv*r.gm;r.score+=p.v;sfx('coin')}else if(p.t=='hp'){me.hp=Math.min(me.mx,me.hp+me.mx*p.v);say(me.x,me.y-50,'+HP','#7dffb0');sfx('heal')}else{me.aw=Math.min(100,(me.aw||0)+p.v)}}}
 pk=pk.filter(p=>!p.dead);
 if(chest&&!chest.open&&me.al&&Math.hypot(me.x-chest.x,me.y-chest.y)<38){chest.open=true;openChoice()}
 if(portal&&me.al&&r.state=='clear'&&Math.hypot(me.x-portal.x,me.y-portal.y)<40)nextRoom()}
function decal(x,y,r,col,g){const big=r>=40;decals.push({x,y,r:r*(.8+Math.random()*.3),col,l:big?5:2.5,m:big?5:2.5,cr:Array.from({length:big?7:3},()=>[Math.random()*6.283,.5+Math.random()*.6]),rot:Math.random()*6.283});if(decals.length>45)decals.shift();
 for(let i=0;i<Math.min(14,r/5);i++){const a=Math.random()*6.283,d=Math.random()*r*.8;P(x+Math.cos(a)*d,y+Math.sin(a)*d,(Math.random()-.5)*14,-18-Math.random()*30,1.1+Math.random()*1.2,col,2+Math.random()*3)}}
function awaken(){if(!me||!me.al||me.awt>0||(me.aw||0)<100)return;me.aw=0;me.awt=15;shake=.45;say(me.x,me.y-64,'AWAKENING!','#ffe14d');burst(me.x,me.y,'#ffe14d',40);burst(me.x,me.y,'#ffffff',20);sendPres()}
function tick(id,e,dt){e.stn=Math.max(0,(e.stn||0)-dt);e.hst=Math.max(0,(e.hst||0)-dt);if(id=='me')e.awt=Math.max(0,(e.awt||0)-dt);
 if(e.sm>0&&e.al){const k=id=='me'&&raid?raid.sr:1;e.sdt-=dt*k;if(e.sdt<=0&&e.sd<e.sm)e.sd=Math.min(e.sm,e.sd+e.sm*SHR*k*dt)}
 if(e.brn>0&&e.al){e.brn-=dt;dmgTo(e,e.bd*dt,1);if(Math.random()<dt*14)P(e.x+(Math.random()-.5)*14,e.y-6,0,-50,.4,'#ff8a3c',4);
  if(e.hp<=0){if(id=='me'){lastHit=e.bo;die()}else{e.al=0;e.rt=3;credit(e.bo,e)}}}}
const ent=o=>o=='me'?me:others[o];
function upd2(q,dt){q.age=(q.age||0)+dt;const oe=ent(q.o);
 if(q.t=='c'||q.t=='l'){q.life-=dt}
 if(q.t=='c'&&!q.done&&q.age>.06){q.done=1;for(const [id,e] of all()){if(id==q.o||!e.al)continue;const dd=Math.hypot(e.x-q.x,e.y-q.y);let da=Math.atan2(e.y-q.y,e.x-q.x)-q.a;da=Math.abs(Math.atan2(Math.sin(da),Math.cos(da)));if(dd<q.r+16&&da<q.arc/2){burst(e.x,e.y,q.col,10);hurt(id,e,q.dmg,q.sl,q.o,q)}}}
 else if(q.t=='b'){if(!oe||!oe.al||q.age>q.dur){q.life=0;return}q.x=oe.x;q.y=oe.y;q.a=oe.a;q.tk-=dt;if(q.tk<=0){q.tk=.12;const ca=Math.cos(q.a),sa=Math.sin(q.a);for(const [id,e] of all()){if(id==q.o||!e.al)continue;const px=e.x-q.x,py=e.y-q.y,t=px*ca+py*sa,pd=Math.abs(-px*sa+py*ca);if(t>0&&t<q.len&&pd<q.w/2+16){hurt(id,e,q.dmg,q.sl,q.o,q)}}}}
 else if(q.t=='o'){if(!oe||!oe.al||q.age>q.dur){q.life=0;return}const bl=[];for(let i=0;i<q.n;i++){const an=q.age*7+i*6.283/q.n;bl.push([oe.x+Math.cos(an)*q.rad,oe.y+Math.sin(an)*q.rad])}q.bl=bl;for(const [id,e] of all()){if(id==q.o||!e.al||(q.h[id]||0)>q.age)continue;for(const b of bl)if(Math.hypot(e.x-b[0],e.y-b[1])<30){q.h[id]=q.age+.45;burst(e.x,e.y,q.col,8);hurt(id,e,q.dmg,q.sl,q.o,{x:oe.x,y:oe.y});break}}}
 else if(q.t=='z'){if(q.age>q.dur){decal(q.x,q.y,q.r*.8,q.col);q.life=0;return}for(const [id,e] of all()){if(!e.al)continue;const dd=Math.hypot(e.x-q.x,e.y-q.y);if(dd>q.r)continue;const mine=id=='me'||e.bot||e.loc;
  if(id==q.o){if(q.heal&&mine)e.hp=Math.min(e.mx,e.hp+q.heal*dt);continue}
  if(tmode){const ow3=ent(q.o);if(ow3&&ow3.tm===e.tm)continue}
  if(raid&&e.raidE&&raid.fid[q.o])continue;
  if(mine){if(q.pull&&dd>4){const f=Math.min(q.pull*dt,dd);move(e,(q.x-e.x)/dd*f,(q.y-e.y)/dd*f)}if(q.dps){const zd=dmgTo(e,q.dps*(q.dm||1)*dt,1);if(id=='me'){lastHit=q.o;if(raid)raid.hit+=zd}if(e.hp<=0){if(id=='me')die();else{e.al=0;e.rt=3;credit(q.o,e)}}}if(q.sl)e.sl=Math.max(e.sl,.2)}}
  if(Math.random()<dt*20){const an=Math.random()*6.283,rd=q.r*Math.random();P(q.x+Math.cos(an)*rd,q.y+Math.sin(an)*rd,-Math.sin(an)*60,Math.cos(an)*60,.5,q.col,3)}}}
function credit(o,v){const kr=o=='me'?me:others[o];if(o=='me'){me.k++;me.aw=Math.min(100,(me.aw||0)+15)}else if(others[o]&&(others[o].bot||others[o].loc))others[o].k++;if(kr&&v)feedKill(kr,v)}
function ann(t,c){an.push({s:t,c,l:2.4,m:2.4});if(an.length>3)an.shift()}
function feedKill(k,v){if(raid)return;kf.unshift({a:k.nm,b:v.nm,ta:k.tm,tb:v.tm,l:6});if(kf.length>5)kf.pop();
 k.ks=(k.kt&&tm-k.kt<7)?(k.ks||0)+1:1;k.kt=tm;const mine=k===me||(tmode&&k.tm===me.tm),N=['','','DOUBLE KILL','TRIPLE KILL','QUADRA KILL','PENTA KILL','LEGENDARY!'];
 if(!fb){fb=1;ann('FIRST BLOOD!',mine?'#ffd84d':'#ff7a7a')}else if(k.ks>=2)ann((mine?'':'ENEMY ')+N[Math.min(6,k.ks)],mine?'#ffd84d':'#ff7a7a');else if(k===me)ann('YOU SLAYED '+v.nm.toUpperCase(),'#7dffb0')}
function die(){me.al=0;me.rt=3;me.dash=null;me.hp=0;sfx('die');if(raid){if(raid.state=='fight'||raid.state=='clear'){raid.pst=raid.state;raid.state='down';raid.downT=.9}return}if(R)R.emit('kill',{k:lastHit});else credit(lastHit,me);sendPres()}
// one revive per run (the menu layer charges for it); endRun hands the totals to the menu layer
function revive(){const r=raid;if(!r||r.state!='down')return;r.revived++;r.state=r.pst||'fight';me.al=1;me.hp=me.mx*.5;me.sd=me.sm;me.sh=2.5;me.stn=0;me.brn=0;ents=ents.filter(q=>q.o=='me');paused=0;burst(me.x,me.y,'#7dffb0',40);say(me.x,me.y-64,'REVIVED!','#7dffb0')}
function endRun(win){const r=raid;if(!r||r.state=='over')return;r.state='over';paused=1;UI.runEnd({mode:r.mode,stage:r.stage,win:!!win,floor:r.floor,room:r.room,wave:r.wave,rooms:r.rooms,total:r.plan?r.plan.rooms.length:0,gold:Math.round(r.gold),kills:r.kills,time:r.t,revived:r.revived,hp:Math.max(0,me.hp/me.mx)})}
function hitPil(x,y,r){for(const p of PIL)if(Math.hypot(x-p[0],y-p[1])<p[2]+r)return p}
function move(e,dx,dy){let x=e.x+dx,y=e.y+dy;x=Math.max(16,Math.min(W-16,x));y=Math.max(16,Math.min(H-16,y));
 for(const p of PIL){const d=Math.hypot(x-p[0],y-p[1]),m=p[2]+16;if(d<m){if(d<1e-6){x=p[0]+m;y=p[1]}else{x=p[0]+(x-p[0])/d*m;y=p[1]+(y-p[1])/d*m}}}e.x=x;e.y=y}
function respawn(e){const p=tmode?SP[(e.tm||0)+2*(Math.random()*2|0)]:rs();e.x=p[0];e.y=p[1];e.hp=e.mx;e.sd=e.sm;e.al=1;e.sh=1.2;e.sl=0;e.brn=0}
function update(dt){if(choice)return;allC=null;matchT+=dt;
  if(hold>0)hold-=dt;lockT=null;if(touch){if(aim&&aim.on){me.a=aim.a;mouse.x=me.x+Math.cos(me.a)*220;mouse.y=me.y+Math.sin(me.a)*220}
  else if(hold>0){mouse.x=me.x+Math.cos(me.a)*220;mouse.y=me.y+Math.sin(me.a)*220}
  else{let t=null,bd=1e9;if(autoAim)for(const [i,o] of all())if(i!='me'&&o.al&&!(tmode&&o.tm===me.tm)){const d=Math.hypot(o.x-me.x,o.y-me.y);if(d<bd){bd=d;t=o}}
   if(t){lockT=t;me.a=Math.atan2(t.y-me.y,t.x-me.x);mouse.x=t.x;mouse.y=t.y}else{if(Math.abs(joy.x)+Math.abs(joy.y)>.2)me.a=Math.atan2(joy.y,joy.x);mouse.x=me.x+Math.cos(me.a)*220;mouse.y=me.y+Math.sin(me.a)*220}}}
 if(raid)raidTick(dt);if(tmode&&R)assignTeams();me.a=Math.atan2(mouse.y-me.y,mouse.x-me.x);if(me.al&&!(me.awt>0))me.aw=Math.min(100,(me.aw||0)+(train?8:1)*(raid?raid.mg:1)*dt);
 for(const [id,e] of all()){for(const k in e.cd)e.cd[k]=Math.max(0,e.cd[k]-dt*(e.awt>0?2.5:1)*(id=='me'&&raid?raid.cd:1));e.sh=Math.max(0,e.sh-dt);e.sl=Math.max(0,e.sl-dt);if(id=='me'||e.bot||e.loc)tick(id,e,dt);if(e.awt>0&&e.al&&Math.random()<dt*40)P(e.x+(Math.random()-.5)*24,e.y+10,(Math.random()-.5)*20,-90,.5,'#ffe14d',3)}
 if(me.al){if(me.dash){const d=me.dash;d.t+=dt/.15;const u=Math.min(1,d.t);me.x=d.x0+(d.x1-d.x0)*u;me.y=d.y0+(d.y1-d.y0)*u;if(u>=1)me.dash=null}
  else if(!(me.stn>0)){let dx=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0)+joy.x,dy=(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0)+joy.y;const l=Math.max(1,Math.hypot(dx,dy)),sp=CH[me.ch].sp*(me.sl>0?.5:1)*(me.hst>0?1.6:1)*(me.awt>0?1.3:1)*(raid?raid.sp:1);move(me,dx/l*sp*dt,dy/l*sp*dt)}
  if(mouse.down||keys.f)tryCast(me,'me','a',mouse.x,mouse.y)}
 else if(!raid){me.rt-=dt;if(me.rt<=0)respawn(me)}
 for(const id in others){const e=others[id];
  if(!e.bot&&!e.loc){e.x+=(e.tx-e.x)*Math.min(1,dt*14);e.y+=(e.ty-e.y)*Math.min(1,dt*14);continue}
  if(!e.al){if(e.raidE){raid.score+=e.boss?200*raid.wave:30;raid.kills++;sfx(e.boss?'boom':'kill');dropLoot(e);delete others[id];allC=null;continue}e.rt-=dt;if(e.rt<=0)respawn(e);continue}
  if(e.dash){const d=e.dash;d.t+=dt/.15;const u=Math.min(1,d.t);e.x=d.x0+(d.x1-d.x0)*u;e.y=d.y0+(d.y1-d.y0)*u;if(u>=1)e.dash=null;continue}
  if(e.dum){e.log=e.log.filter(x=>tm-x.t<3);e.nm='DPS '+Math.round(e.log.reduce((a,x)=>a+x.d,0)/3)+' | Total '+Math.round(e.tot);e.hp=e.mx;continue}
  let t=null,bd=1e9;for(const [i2,o] of all())if(i2!=id&&o.al&&!(raid&&o.raidE)&&!(tmode&&o.tm===e.tm)){const d=Math.hypot(o.x-e.x,o.y-e.y);if(d<bd){bd=d;t=o}}
  if(!t||e.stn>0)continue;if(e.loc){const dx=(k2.arrowright?1:0)-(k2.arrowleft?1:0),dy=(k2.arrowdown?1:0)-(k2.arrowup?1:0);if(dx||dy)e.a=Math.atan2(dy,dx);const l=Math.max(1,Math.hypot(dx,dy)),sp=CH[e.ch].sp*(e.sl>0?.5:1)*(e.hst>0?1.6:1);move(e,dx/l*sp*dt,dy/l*sp*dt);if(k2.enter)tryCast(e,id,'a',e.x+Math.cos(e.a)*220,e.y+Math.sin(e.a)*220);continue}if(e.foe){e.a=Math.atan2(t.y-e.y,t.x-e.x);const ai=CH[e.ch].ai,spd=CH[e.ch].sp*1.1*(e.sl>0?.5:1);let dir=0,st=0;
   if(ai=='rush')dir=bd>55?1:0;else if(ai=='range'){dir=bd>300?1:bd<210?-1:0;st=Math.sin(tm*1.3+e.x*.01)*.7}else if(ai=='snipe')dir=bd>430?1:bd<340?-1:0;else{dir=bd>230?1:bd<150?-1:0;st=Math.sin(tm+e.y*.01)*.4}
   move(e,(Math.cos(e.a)*dir-Math.sin(e.a)*st)*spd*dt,(Math.sin(e.a)*dir+Math.cos(e.a)*st)*spd*dt);const rg=ai=='rush'?100:ai=='snipe'?600:ai=='bomb'?360:440;
   if(bd<rg&&Math.random()<dt*(ai=='rush'?4.5:2))tryCast(e,id,'a',t.x,t.y);if(bd<rg+80&&Math.random()<dt*.35)tryCast(e,id,'q',t.x,t.y);if(ai=='rush'&&bd>140&&bd<320&&Math.random()<dt*.5)tryCast(e,id,'e',t.x,t.y);continue}
  if(e.boss){e.a=Math.atan2(t.y-e.y,t.x-e.x);const dir=bd>260?1:bd<140?-1:0,sp=CH[e.ch].sp*.62*(e.sl>0?.5:1);move(e,Math.cos(e.a)*dir*sp*dt,Math.sin(e.a)*dir*sp*dt);
   if(bd<560){if(Math.random()<dt*1.8)tryCast(e,id,'a',t.x,t.y);if(Math.random()<dt*.45)tryCast(e,id,'q',t.x,t.y);if(Math.random()<dt*.2)tryCast(e,id,'e',t.x,t.y);if(Math.random()<dt*.16)tryCast(e,id,'r',t.x,t.y)}continue}
  if(e.err==null||Math.random()<dt*1.5)e.err=(Math.random()-.5)*.9;e.a=Math.atan2(t.y-e.y,t.x-e.x)+e.err;
  const dir=bd>240?1:bd<150?-1:0,st=Math.sin(tm*1.3+id.charCodeAt(1))*.7,sp=CH[e.ch].sp*.5*(e.sl>0?.5:1)*(e.hst>0?1.6:1);
  move(e,(Math.cos(e.a)*dir-Math.sin(e.a)*st)*sp*dt,(Math.sin(e.a)*dir+Math.cos(e.a)*st)*sp*dt);
  if(bd<380){if(Math.random()<dt*1.6)tryCast(e,id,'a',t.x,t.y);if(Math.random()<dt*.18)tryCast(e,id,'q',t.x,t.y);if(Math.random()<dt*.08)tryCast(e,id,'r',t.x,t.y)}
  if(Math.random()<dt*.12||(e.hp<30&&Math.random()<dt*.5))tryCast(e,id,'e',t.x,t.y)}
 for(const q of ents){if(q.t!='p'&&q.t!='a'){upd2(q,dt);continue}if(q.t=='p'){if(q.home){let t=null,bd=1e9;for(const [i2,o] of all())if(i2!=q.o&&o.al&&!ally(q.o,o)){const d=Math.hypot(o.x-q.x,o.y-q.y);if(d<bd){bd=d;t=o}}if(t){const sp=Math.hypot(q.vx,q.vy),a=Math.atan2(q.vy,q.vx);let da=Math.atan2(t.y-q.y,t.x-q.x)-a;da=Math.atan2(Math.sin(da),Math.cos(da));const na=a+Math.max(-1,Math.min(1,da))*4*dt;q.vx=Math.cos(na)*sp;q.vy=Math.sin(na)*sp}}
   q.x+=q.vx*dt;q.y+=q.vy*dt;q.life-=dt;if(Math.random()<Q.tr)P(q.x,q.y,(Math.random()-.5)*50,(Math.random()-.5)*50,.3,q.col,q.r*.6);if(q.x<0||q.x>W||q.y<0||q.y>H||hitPil(q.x,q.y,q.r))q.life=0;
   if(q.life>0)for(const [id,e] of all()){if(id==q.o||!e.al||ally(q.o,e))continue;if(Math.hypot(e.x-q.x,e.y-q.y)<q.r+16){if(q.h&&q.h[id])continue;if(q.pierce)(q.h=q.h||{})[id]=1;else q.life=0;burst(q.x,q.y,q.col,12);decal(q.x,q.y,10,q.col);hurt(id,e,q.dmg,q.sl,q.o,q);if(!q.pierce)break}}}
  else{q.age+=dt;if(q.mine&&!q.done&&q.age>.7)for(const [id,e] of all())if(id!=q.o&&e.al&&!ally(q.o,e)&&Math.hypot(e.x-q.x,e.y-q.y)<q.r*.8+16)q.delay=q.age;if(!q.done&&q.age>=q.delay){q.done=1;if(q.dmg>0){burst(q.x,q.y,q.col,q.r>60?32:14);if(q.dmg>30)shake=.35;decal(q.x,q.y,q.r,q.col)}else burst(q.x,q.y,q.col,8);for(const [id,e] of all())if(id!=q.o&&e.al&&Math.hypot(e.x-q.x,e.y-q.y)<q.r+16){if(q.dmg>0)hurt(id,e,q.dmg,q.sl,q.o,q)}}
   if(q.age>q.delay+.3)q.life=0;else q.life=1}}
 ents=ents.filter(q=>q.life>0);
 if(raid){}else if(!over){const w=tmode?(teamScore(me.tm)>=10?[0,{nm:'YOUR TEAM'}]:teamScore(1-me.tm)>=10?[0,{nm:'ENEMY TEAM'}]:null):all().find(([i,e])=>e.k>=5);if(w){over=5;winner=w[1].nm;UI.pvpEnd(tmode?teamScore(me.tm)>=10:w[1]===me,!!R,loc2||train)}}
 else{over-=dt;if(over<=0){over=0;for(const [i,e] of all()){e.k=0;if(i=='me'||e.bot)respawn(e)}ents=[]}}
 flash=Math.max(0,flash-dt);shake=Math.max(0,shake-dt);{let n=0;for(let i=0;i<parts.length;i++){const p=parts[i];p.x+=p.vx*dt;p.y+=p.vy*dt;p.l-=dt;if(p.l>0)parts[n++]=p}parts.length=n}for(const d of decals)d.l-=dt;decals=decals.filter(d=>d.l>0);if(decals.length>70)decals.splice(0,decals.length-70);for(const f of kf)f.l-=dt;kf=kf.filter(f=>f.l>0);for(const a of an)a.l-=dt;an=an.filter(a=>a.l>0);for(const t of txts){t.y-=38*dt;t.l-=dt}txts=txts.filter(t=>t.l>0);pt+=dt;if(R&&pt>.07){pt=0;sendPres()}}
function rr(x,y,w,h,r,f){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=f;ctx.fill()}
function drawDummy(e){ctx.fillStyle='#0005';ctx.beginPath();ctx.ellipse(e.x,e.y+22,18,6,0,0,7);ctx.fill();
 ctx.fillStyle='#8a5a2b';ctx.fillRect(e.x-4,e.y-4,8,26);ctx.fillRect(e.x-26,e.y-18,52,7);
 ctx.fillStyle='#d9b26a';ctx.strokeStyle='#8a5a2b';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(e.x-14,e.y-26,28,32,7);ctx.fill();ctx.stroke();
 ctx.beginPath();ctx.arc(e.x,e.y-36,11,0,7);ctx.fill();ctx.stroke();
 [[10,'#e33'],[6.5,'#fff'],[3,'#e33']].forEach(([r,c])=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc(e.x,e.y-10,r,0,7);ctx.fill()});
 ctx.fillStyle='#fff';ctx.font='bold 12px system-ui';ctx.textAlign='center';ctx.fillText(e.nm,e.x,e.y-54)}
const SHC={};function shade(c,f){const k=c+f;if(SHC[k])return SHC[k];const n=parseInt(c.slice(1,7),16),r=n>>16&255,g=n>>8&255,b=n&255,t=f<0?0:255,p=Math.abs(f);return SHC[k]='rgb('+Math.round((t-r)*p+r)+','+Math.round((t-g)*p+g)+','+Math.round((t-b)*p+b)+')'}
function drawGround(M){ctx.save();ctx.beginPath();ctx.roundRect(0,0,W,H,44);ctx.clip();
 const T=60;for(let ty=0;ty<H;ty+=T)for(let tx=0;tx<W;tx+=T){ctx.fillStyle=((tx/T+ty/T)&1)?M.sand[0]:M.sand[1];ctx.fillRect(tx,ty,T,T)}
 let g=ctx.createRadialGradient(W/2,H/2,40,W/2,H/2,Math.max(W,H)*.65);g.addColorStop(0,'rgba(255,255,255,.2)');g.addColorStop(1,'rgba(20,10,40,.28)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 ctx.fillStyle='rgba(50,80,40,.25)';for(const p of SPK){ctx.beginPath();ctx.ellipse(p[0]*W/900,p[1]*H/600,p[2]*3.2,p[2]*1.5,0,0,7);ctx.fill()}
 SP.forEach((p,i)=>{const tc=tmode?((i%2)===me.tm?'#4da3ff':'#ff5a5a'):'#ffffff';ctx.globalAlpha=.3;g=ctx.createRadialGradient(p[0],p[1],6,p[0],p[1],56);g.addColorStop(0,tc);g.addColorStop(1,tc+'00');ctx.fillStyle=g;ctx.beginPath();ctx.arc(p[0],p[1],56,0,7);ctx.fill();ctx.globalAlpha=.6;ctx.strokeStyle=tc;ctx.lineWidth=3;ctx.setLineDash([8,6]);ctx.beginPath();ctx.arc(p[0],p[1],40,0,7);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1});
 ctx.restore();ctx.strokeStyle='#1b1030';ctx.lineWidth=8;ctx.beginPath();ctx.roundRect(0,0,W,H,44);ctx.stroke();ctx.strokeStyle=M.rim;ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(4,4,W-8,H-8,40);ctx.stroke()}
const GC={k:'',c:null};
function ground(M){const sc=Math.min(2,Math.max(1,Math.ceil(K*dpr*2)/2))*(W>1000?.75:1),k=MAP+'|'+(tmode?me.tm:-1)+'|'+sc;
 if(GC.k!==k){const c=GC.c||(GC.c=document.createElement('canvas'));c.width=(W+16)*sc;c.height=(H+16)*sc;const x=c.getContext('2d'),o=ctx;x.scale(sc,sc);x.translate(8,8);ctx=x;try{drawGround(M)}finally{ctx=o}GC.k=k}
 ctx.drawImage(GC.c,-8,-8,W+16,H+16)}
// soft round glow per colour, reused for projectiles, orbs, pickups and auras
const GL={};
function glow(col){let c=GL[col];if(!c){c=GL[col]=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'#fff');g.addColorStop(.4,col);g.addColorStop(1,col+'00');x.fillStyle=g;x.fillRect(0,0,64,64)}return c}
let DSP=null;
function scorch(){if(!DSP){DSP=document.createElement('canvas');DSP.width=DSP.height=64;const x=DSP.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(20,12,10,.45)');g.addColorStop(.7,'rgba(20,12,10,.25)');g.addColorStop(1,'rgba(20,12,10,0)');x.fillStyle=g;x.fillRect(0,0,64,64)}return DSP}
function paintRock(X,x,y,r,M){const ty=y-r*.9;X.fillStyle='rgba(0,0,0,.28)';X.beginPath();X.ellipse(x+r*.3,y+r*.5,r*1.2,r*.55,0,0,7);X.fill();
 X.lineJoin='round';X.lineWidth=3;X.strokeStyle='#1b1030';const side=()=>{X.beginPath();X.moveTo(x-r,ty);X.lineTo(x-r,y);X.ellipse(x,y,r,r*.58,0,Math.PI,0,true);X.lineTo(x+r,ty);X.closePath()};
 X.fillStyle=M.rock[1];side();X.fill();X.stroke();let g=X.createLinearGradient(x-r,0,x+r,0);g.addColorStop(0,'rgba(255,255,255,.16)');g.addColorStop(.5,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.3)');X.fillStyle=g;side();X.fill();
 g=X.createRadialGradient(x-r*.3,ty-r*.2,2,x,ty,r);g.addColorStop(0,shade(M.rock[0],.5));g.addColorStop(1,M.rock[0]);X.fillStyle=g;X.beginPath();X.ellipse(x,ty,r,r*.58,0,0,7);X.fill();X.stroke();
 X.strokeStyle='rgba(27,16,48,.5)';X.lineWidth=2;X.beginPath();X.moveTo(x-r*.35,ty-r*.1);X.lineTo(x-r*.05,ty+r*.14);X.lineTo(x+r*.25,ty-r*.04);X.stroke();
 X.fillStyle='#5cc15a';X.strokeStyle='#1b1030';X.lineWidth=1.6;X.beginPath();X.ellipse(x+r*.38,ty-r*.12,r*.26,r*.13,0,0,7);X.fill();X.stroke()}
const RC={};
function rockSprite(p){const k=MAP+'|'+p[2];if(RC[k]!==undefined)return RC[k];const r=p[2],S=2,w=Math.ceil(r*3.4),h=Math.ceil(r*3.2),c=document.createElement('canvas');c.width=w*S;c.height=h*S;const x=c.getContext&&c.getContext('2d');if(!x){RC[k]=null;return null}
 x.scale(S,S);paintRock(x,w/2,h*.6,r,MAPS[MAP]);return RC[k]={c,w,h,ox:w/2,oy:h*.6}}
function drawRock(p){const sp=rockSprite(p);if(sp)ctx.drawImage(sp.c,p[0]-sp.ox,p[1]-sp.oy,sp.w,sp.h);else paintRock(ctx,p[0],p[1],p[2],MAPS[MAP])}
function paintBush(x,y,r){const sw=0;ctx.fillStyle='rgba(0,0,0,.2)';ctx.beginPath();ctx.ellipse(x,y+r*.8,r*1.1,r*.4,0,0,7);ctx.fill();ctx.lineWidth=3;ctx.strokeStyle='#14391c';ctx.lineJoin='round';
 for(const [dx,dy,sc] of [[0,.3,.8],[-.7,.1,.7],[.7,.1,.7],[-.35,-.45,.75],[.4,-.45,.75],[0,-.1,.9]]){const gx=x+dx*r+sw*(dy<0?1:.4),gy=y+dy*r,rad=r*.6*sc+5,g=ctx.createRadialGradient(gx-rad*.3,gy-rad*.35,2,gx,gy,rad);g.addColorStop(0,'#8ae885');g.addColorStop(1,'#2d9a3e');ctx.fillStyle=g;ctx.beginPath();ctx.arc(gx,gy,rad,0,7);ctx.fill();ctx.stroke()}}
const BC={};
function drawBush(b,i){const k=MAP+'|'+i;let p=BC[k];if(!p){const r=b[2],w=Math.ceil(r*2.9+16),h=Math.ceil(r*2.5+16),c=document.createElement('canvas');c.width=w*2;c.height=h*2;const x=c.getContext('2d'),o=ctx;x.scale(2,2);ctx=x;try{paintBush(w/2,h*.52,r)}finally{ctx=o}p=BC[k]={c,w,h,ox:w/2,oy:h*.52}}
 ctx.drawImage(p.c,b[0]-p.ox+Math.sin(tm*2+b[0]*.05)*1.6,b[1]-p.oy,p.w,p.h)}
function hiddenE(e){if(raid||!e||e===me||e.dum||e.raidE)return false;if(tmode&&e.tm===me.tm)return false;return BUSH.some(b=>Math.hypot(e.x-b[0],e.y-b[1])<b[2])&&Math.hypot(e.x-me.x,e.y-me.y)>150&&tm>(e.rv||0)&&tm>(e.hft||0)+1}
function drawObjs(){const L=[],vis=(x,y,r)=>x+r>cam.x-50&&x-r<cam.x+VW+50&&y+r>cam.y-90&&y-r<cam.y+VH+60;for(const p of PIL)if(vis(p[0],p[1],p[2]))L.push([p[1]+p[2]*.5,()=>drawRock(p)]);BUSH.forEach((b,i)=>{if(vis(b[0],b[1],b[2]*1.6))L.push([b[1]+b[2]*.9,()=>drawBush(b,i)])});
 for(const [id,e] of all()){if(!e.al||hiddenE(e))continue;L.push([e.y+16,()=>{const inb=BUSH.some(b=>Math.hypot(e.x-b[0],e.y-b[1])<b[2]);if(inb&&(id=='me'||(tmode&&e.tm===me.tm)))ctx.globalAlpha=.62;drawChar(e,id);ctx.globalAlpha=1}])}
 L.sort((a,b)=>a[0]-b[0]);for(const o of L)o[1]()}
const GR={};
function drawFig(e,c,bs,sq,bob,walk,hit,ph){const a=e.a,fx=Math.cos(a)>=0?1:-1,cd=c.col,dark='#1b1030';
 ctx.save();ctx.translate(e.x,e.y+17);ctx.scale(bs/sq,bs*sq);ctx.translate(0,-17+bob);ctx.lineJoin='round';ctx.lineWidth=2.6;ctx.strokeStyle=dark;
 const P2=(pts,col)=>{ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(pts[0],pts[1]);for(let i=2;i<pts.length;i+=2)ctx.lineTo(pts[i],pts[i+1]);ctx.closePath();ctx.fill();ctx.stroke()},A=c.acc,hc=hit?'#fff':(e.awt>0?'#fff3a0':c.hair);
 ctx.save();ctx.rotate(a);ctx.fillStyle='#e6efff';ctx.beginPath();ctx.roundRect(12,-2.5,19,5,2);ctx.fill();ctx.stroke();ctx.fillStyle=cd;ctx.beginPath();ctx.arc(33,0,5.5,0,7);ctx.fill();ctx.stroke();ctx.restore();
 const st=walk?Math.sin(ph)*3:0;ctx.fillStyle='#2b3350';ctx.beginPath();ctx.roundRect(-8+st*.5,12,7,9,3);ctx.fill();ctx.stroke();ctx.beginPath();ctx.roundRect(1-st*.5,12,7,9,3);ctx.fill();ctx.stroke();
 let g=GR[cd];if(!g){g=GR[cd]=ctx.createLinearGradient(0,-2,0,18);g.addColorStop(0,shade(cd,.35));g.addColorStop(1,shade(cd,-.15))}ctx.fillStyle=hit?'#fff':g;ctx.beginPath();ctx.roundRect(-10.5,-2,21,20,7);ctx.fill();ctx.stroke();ctx.fillStyle='rgba(255,255,255,.55)';ctx.fillRect(-10,9,20,3);
 if(A=='scarf'){ctx.fillStyle='#e94a4a';ctx.fillRect(-10,0,20,4.5);ctx.strokeRect(-10,0,20,4.5);P2([-fx*9,1,-fx*(23+Math.sin(tm*10)*3),6+Math.sin(tm*9)*3,-fx*9,5.5],'#e94a4a')}
 g=GR.skin;if(!g){g=GR.skin=ctx.createRadialGradient(-3,-12,2,0,-9,12);g.addColorStop(0,'#fff0e2');g.addColorStop(1,'#f3c9a5')}ctx.fillStyle=hit?'#fff':g;ctx.beginPath();ctx.arc(0,-9,11.5,0,7);ctx.fill();ctx.stroke();
 ctx.fillStyle=hc;ctx.beginPath();ctx.arc(0,-11,12.5,Math.PI,0);ctx.closePath();ctx.fill();ctx.stroke();
 for(let i=0;i<5;i++){const x=-10+i*5;ctx.beginPath();ctx.moveTo(x-3.5,-16);ctx.lineTo(x+fx*2,-27-(i%2)*5);ctx.lineTo(x+3.5,-16);ctx.closePath();ctx.fill();ctx.stroke()}
 P2([-11.5,-10,-5,-3,0,-9,5,-3,11.5,-10],hc);
 for(const sd of[-1,1]){const x=sd*4.4+fx*1.6;ctx.fillStyle='#fff';ctx.lineWidth=1.6;ctx.beginPath();ctx.ellipse(x,-8,3.4,4.4,0,0,7);ctx.fill();ctx.stroke();ctx.fillStyle=cd;ctx.beginPath();ctx.arc(x+Math.cos(a)*1.2,-7.5+Math.sin(a)*1.4,2.6,0,7);ctx.fill();ctx.fillStyle='#14102a';ctx.beginPath();ctx.arc(x+Math.cos(a)*1.4,-7.5+Math.sin(a)*1.5,1.3,0,7);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x-.8,-9.2,1,0,7);ctx.fill()}
 ctx.fillStyle='rgba(255,110,150,.35)';ctx.beginPath();ctx.ellipse(-7.5,-3.2,2.4,1.5,0,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(7.5,-3.2,2.4,1.5,0,0,7);ctx.fill();
 ctx.strokeStyle='#7a3b3b';ctx.lineWidth=1.4;ctx.beginPath();if(hit)ctx.arc(fx,-1.5,1.6,0,7);else ctx.arc(fx,-3.8,2.4,.15,Math.PI-.15);ctx.stroke();ctx.strokeStyle=dark;ctx.lineWidth=2.6;
 if(A=='hat'){ctx.fillStyle='#f4c542';ctx.beginPath();ctx.ellipse(0,-19,17,4.5,0,0,7);ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(0,-19,10,Math.PI,0);ctx.fill();ctx.stroke();ctx.fillStyle='#d33';ctx.fillRect(-10,-22,20,3)}
 if(A=='band'){ctx.fillStyle='#1e40af';ctx.fillRect(-11.5,-15.5,23,3.5);ctx.strokeRect(-11.5,-15.5,23,3.5);P2([-fx*11,-14,-fx*(22+Math.sin(tm*9)*3),-10,-fx*11,-12],'#1e40af')}
 if(A=='horn'){P2([-9,-18,-11,-30,-3,-20],'#f4f4f4');P2([9,-18,11,-30,3,-20],'#f4f4f4')}
 if(A=='bow'){const x=-fx*9;P2([x,-19,x-7,-25,x-7,-13],'#ff6fa8');P2([x,-19,x+7,-25,x+7,-13],'#ff6fa8')}
 if(A=='mask'){ctx.fillStyle='#222';ctx.fillRect(-9.5,-5,19,6.5);ctx.strokeRect(-9.5,-5,19,6.5)}
 if(A=='halo'){ctx.strokeStyle='#ffd84d';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,-29,9.5,3.2,0,0,7);ctx.stroke()}
 if(A=='crown')P2([-9.5,-20,-9.5,-28,-4.5,-23,0,-30,4.5,-23,9.5,-28,9.5,-20],'#ffd84d');
 if(A=='ears'){P2([-10,-17,-8,-30,-2,-20],hc);P2([10,-17,8,-30,2,-20],hc)}
 if(A=='star')P2([-fx*8,-23,-fx*5,-18,-fx*8,-13,-fx*11,-18],'#fff3a0');
 ctx.restore();}
const PT={};
// static portrait (data URL) for the menus; works for heroes, foes and bosses
function portrait(ch,px){const k=ch+'|'+px;if(PT[k])return PT[k];const c=document.createElement('canvas');c.width=c.height=px;const x=c.getContext('2d'),o=ctx,sc=px/72;x.scale(sc,sc);ctx=x;try{drawFig({x:32,y:46,a:-.5,awt:0},CH[ch],1.15,1,0,false,false,0)}finally{ctx=o}return PT[k]=c.toDataURL()}
function drawChar(e,id){if(e.dum)return drawDummy(e);const c=CH[e.ch],bs=e.boss?1.7:1,cd=c.col,dark='#1b1030';
 const mv=Math.hypot(e.x-(e.px==null?e.x:e.px),e.y-(e.py==null?e.y:e.py));e.px=e.x;e.py=e.y;e.mvs=(e.mvs||0)*.85+mv*.15;const walk=e.mvs>.35;
 const hv=e.hp+(e.sd||0);if(e.lhp!=null&&hv<e.lhp-.4)e.hft=tm+.12;e.lhp=hv;const hit=e.hft&&tm<e.hft,ph=tm*15+e.x*.1,sq=walk?1+Math.sin(ph)*.07:1+Math.sin(tm*3)*.025,bob=walk?-Math.abs(Math.sin(ph))*3:Math.sin(tm*3)*.8;
 const tc=tmode?(e.tm===me.tm?'#4da3ff':'#ff5a5a'):(id=='me'?'#ffffff':cd);
 ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(e.x,e.y+17,16*bs,6*bs,0,0,7);ctx.fill();
 ctx.strokeStyle=dark;ctx.lineWidth=tmode?8:6;ctx.beginPath();ctx.ellipse(e.x,e.y+17,21*bs,8.5*bs,0,0,7);ctx.stroke();ctx.strokeStyle=tc;ctx.lineWidth=tmode?4:3;ctx.beginPath();ctx.ellipse(e.x,e.y+17,21*bs,8.5*bs,0,0,7);ctx.stroke();
 if(id=='me'&&me.aw>=100&&!(me.awt>0)){ctx.globalAlpha=.5+.4*Math.sin(tm*8);ctx.strokeStyle='#ffd84d';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(e.x,e.y+17,29,11.5,0,0,7);ctx.stroke();ctx.globalAlpha=1}
 if(e.awt>0){const r=46+Math.sin(tm*12)*4;ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.6;ctx.drawImage(glow(cd),e.x-r,e.y-r,r*2,r*2);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}
 drawFig(e,c,bs,sq,bob,walk,hit,ph);
 if(e.sh>0){ctx.strokeStyle='#fff';ctx.fillStyle='#ffffff30';ctx.lineWidth=3;ctx.beginPath();for(let i=0;i<7;i++){const q=tm*2+i*.8976;ctx.lineTo(e.x+Math.cos(q)*27,e.y+Math.sin(q)*27)}ctx.closePath();ctx.fill();ctx.stroke()}
 if(e.sl>0){ctx.strokeStyle='#9fe6ff';ctx.lineWidth=2;ctx.setLineDash([4,4]);ctx.beginPath();ctx.arc(e.x,e.y,24,0,7);ctx.stroke();ctx.setLineDash([])}
 if(e.hst>0){ctx.strokeStyle=cd;ctx.globalAlpha=.7;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(e.x,e.y+17,27+Math.sin(tm*14)*3,11,0,0,7);ctx.stroke();ctx.globalAlpha=1}
 const bw=bs>1?84:54,bh=bs>1?13:11,bx=e.x-bw/2,by=e.y-(bs>1?68:e.sm?55:48),ally=!tmode||e.tm===me.tm,fc=(e.raidE||!ally)?'#ef4444':'#4ade80';
 ctx.fillStyle=dark;ctx.beginPath();ctx.roundRect(bx-2,by-2,bw+4,bh+(e.sm?11:4),7);ctx.fill();ctx.fillStyle='#3a2f55';ctx.beginPath();ctx.roundRect(bx,by,bw,bh,bh/2);ctx.fill();
 const fw=Math.max(0,bw*e.hp/e.mx);if(fw>1){ctx.fillStyle=fc;ctx.beginPath();ctx.roundRect(bx,by,fw,bh,bh/2);ctx.fill();ctx.fillStyle='rgba(255,255,255,.28)';ctx.fillRect(bx+3,by+1.5,Math.max(0,fw-6),3)}
 if(e.sm){ctx.fillStyle='#2a2444';ctx.fillRect(bx,by+bh+2,bw,5);const sw=bw*Math.max(0,e.sd)/e.sm;if(sw>.5){ctx.fillStyle=e.sdt>0?'#86a8cc':'#bfe6ff';ctx.fillRect(bx,by+bh+2,sw,5)}}
 ctx.textAlign='center';ctx.font='900 9px system-ui';ctx.lineWidth=2.5;ctx.strokeStyle=dark;const ht=Math.max(0,Math.round(e.hp))+'';ctx.strokeText(ht,e.x,by+bh-2.5);ctx.fillStyle='#fff';ctx.fillText(ht,e.x,by+bh-2.5);
 ctx.font='900 12px system-ui';ctx.lineWidth=3.5;const nt=(e.awt>0?'★ ':'')+e.nm;ctx.strokeText(nt,e.x,by-6);ctx.fillStyle=tmode?(ally?'#9ccbff':'#ff9a9a'):'#fff';ctx.fillText(nt,e.x,by-6);
 if(e.stn>0){ctx.fillStyle='#ffe14d';ctx.font='14px system-ui';for(let i=0;i<3;i++){const q=tm*6+i*2.1;ctx.fillText('★',e.x+Math.cos(q)*14,e.y-34+Math.sin(q)*4)}}}
function skillBtns(){const sk=CH[me.ch].s;
 for(const [k,x,y,r] of [['a',cw-70,chh-76,38],['q',cw-152,chh-50,27],['e',cw-140,chh-118,27],['r',cw-78,chh-152,27]]){const s=sk[k],cd=me.cd[k],fr=cd>0?Math.min(1,cd/s.cd):0;
  ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.arc(x,y+4,r+3,0,7);ctx.fill();
  const g=ctx.createRadialGradient(x-r*.3,y-r*.35,2,x,y,r);g.addColorStop(0,k=='a'?'#ffa070':shade(CH[me.ch].col,.4));g.addColorStop(1,k=='a'?'#d13a1e':shade(CH[me.ch].col,-.28));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();ctx.strokeStyle='#1b1030';ctx.lineWidth=4;ctx.stroke();
  ctx.fillStyle='#fff';ctx.font='900 '+(r*.95|0)+'px system-ui';ctx.textAlign='center';ctx.fillText(IC[s.k]||'✦',x,y+r*.32);
  if(fr>0){ctx.fillStyle='rgba(10,5,30,.74)';ctx.beginPath();ctx.moveTo(x,y);ctx.arc(x,y,r-1,-Math.PI/2,-Math.PI/2+Math.PI*2*fr);ctx.closePath();ctx.fill();ctx.fillStyle='#fff';ctx.font='900 '+(r*.7|0)+'px system-ui';ctx.fillText(cd.toFixed(cd<10?1:0),x,y+r*.25)}
  ctx.font='900 10px system-ui';ctx.lineWidth=3;ctx.strokeStyle='#1b1030';const lb=k=='a'?'MOUSE':k.toUpperCase();ctx.strokeText(lb,x,y+r+13);ctx.fillStyle='#fff';ctx.fillText(lb,x,y+r+13);
  if(k!='a'){ctx.font='bold 9px system-ui';ctx.strokeText(s.nm.slice(0,13),x,y-r-5);ctx.fillStyle='#d7e8ff';ctx.fillText(s.nm.slice(0,13),x,y-r-5)}}
 const ax=cw-214,ay=chh-98,ar=25,on=me.awt>0,pc=on?me.awt/15:Math.min(1,(me.aw||0)/100),ready=me.aw>=100&&!on;
 ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.arc(ax,ay+4,ar+3,0,7);ctx.fill();ctx.fillStyle=ready?'#d99a00':'#2b2250';ctx.beginPath();ctx.arc(ax,ay,ar,0,7);ctx.fill();ctx.strokeStyle='#1b1030';ctx.lineWidth=4;ctx.stroke();
 ctx.strokeStyle=on?'#fff3a0':'#ffd84d';ctx.lineWidth=6;ctx.beginPath();ctx.arc(ax,ay,ar-1,-Math.PI/2,-Math.PI/2+Math.PI*2*pc);ctx.stroke();
 ctx.fillStyle='#fff';ctx.font='900 17px system-ui';ctx.textAlign='center';ctx.fillText('★',ax,ay+6);ctx.font='900 9px system-ui';ctx.lineWidth=3;ctx.strokeStyle='#1b1030';const al=on?'AWAKENED':ready?'SPACE!':Math.floor(me.aw||0)+'%';ctx.strokeText(al,ax,ay+ar+13);ctx.fillText(al,ax,ay+ar+13)}
function scoreboard(){const t0=teamScore(me.tm),t1=teamScore(1-me.tm),mm=Math.floor(matchT/60),ss=Math.floor(matchT%60),tt=(mm<10?'0':'')+mm+':'+(ss<10?'0':'')+ss,cx=cw/2,y=48;
 ctx.fillStyle='#1b1030';ctx.beginPath();ctx.roundRect(cx-94,y-4,188,36,12);ctx.fill();ctx.fillStyle='#2c6fe0';ctx.beginPath();ctx.roundRect(cx-92,y-2,62,32,[10,0,0,10]);ctx.fill();ctx.fillStyle='#e04a4a';ctx.beginPath();ctx.roundRect(cx+30,y-2,62,32,[0,10,10,0]);ctx.fill();
 ctx.fillStyle='#fff';ctx.textAlign='center';ctx.font='900 22px system-ui';ctx.fillText(t0,cx-61,y+22);ctx.fillText(t1,cx+61,y+22);ctx.font='900 14px system-ui';ctx.fillText(tt,cx,y+20);ctx.font='bold 9px system-ui';ctx.fillStyle='#ccd';ctx.fillText('FIRST TO 10 KOs',cx,y+45)}
function hudFeed(){let y=54;ctx.textAlign='right';for(const f of kf){ctx.globalAlpha=Math.min(1,f.l);ctx.font='bold 12px system-ui';const t=f.a+'  ⚔  '+f.b,w=t.length*6.6+18;ctx.fillStyle='rgba(27,16,48,.85)';ctx.beginPath();ctx.roundRect(cw-w-8,y-13,w,21,8);ctx.fill();ctx.fillStyle=tmode?(f.ta===me.tm?'#9ccbff':'#ff9a9a'):'#fff';ctx.fillText(t,cw-17,y+2);y+=25}ctx.globalAlpha=1;
 let ay=chh*.22;for(const a of an){const age=a.m-a.l,sc=age<.2?1.7-age*3.5:1;ctx.save();ctx.translate(cw/2,ay);ctx.scale(sc,sc);ctx.globalAlpha=Math.min(1,a.l*2);ctx.font='900 32px system-ui';ctx.textAlign='center';ctx.lineWidth=8;ctx.lineJoin='round';ctx.strokeStyle='#1b1030';ctx.strokeText(a.s,0,0);ctx.fillStyle=a.c;ctx.fillText(a.s,0,0);ctx.restore();ay+=40}ctx.globalAlpha=1}
function draw(){
 allC=null;const M=MAPS[MAP],k=K*dpr;VW=cw/K;VH=chh/K;
 cam.x=VW<W+60?Math.max(-30,Math.min(W+30-VW,me.x-VW/2)):(W-VW)/2;cam.y=VH<H+60?Math.max(-30,Math.min(H+30-VH,me.y-VH/2)):(H-VH)/2;
 ctx.setTransform(k,0,0,k,(-cam.x+(Math.random()-.5)*shake*22)*k,(-cam.y+(Math.random()-.5)*shake*22)*k);
 let g=ctx.createLinearGradient(0,cam.y,0,cam.y+VH);g.addColorStop(0,M.sea[0]);g.addColorStop(1,M.sea[1]);ctx.fillStyle=g;ctx.fillRect(cam.x-40,cam.y-40,VW+80,VH+80);
 {const wn=Q.fx?12:6,ws=Q.fx?20:36;ctx.strokeStyle='#ffffff28';ctx.lineWidth=2;for(let j=0;j<wn;j++){const y=cam.y+j*VH/(wn-1);ctx.beginPath();for(let x=cam.x-40;x<=cam.x+VW+40;x+=ws)ctx.lineTo(x,y+Math.sin(x/45+tm*1.6+j)*5);ctx.stroke()}}
 const e0=Math.sin(tm*2)*5+5;rr(-30-e0,-30-e0,W+60+2*e0,H+60+2*e0,70,'#ffffff38');rr(-14,-14,W+28,H+28,56,M.rim);
 ground(M);
 for(const q of ents){if(q.t!='a')continue;if(q.mine&&q.age<q.delay){ctx.globalAlpha=.5+.3*Math.sin(tm*8);ctx.strokeStyle=q.col;ctx.fillStyle=q.col;ctx.lineWidth=2;ctx.beginPath();ctx.arc(q.x,q.y,9,0,7);ctx.stroke();ctx.beginPath();ctx.arc(q.x,q.y,4,0,7);ctx.fill();ctx.globalAlpha=.15;ctx.beginPath();ctx.arc(q.x,q.y,q.r*.8,0,7);ctx.stroke();ctx.globalAlpha=1;continue}
  if(q.age<q.delay){const u=q.age/q.delay;ctx.globalAlpha=.18+.1*Math.sin(tm*20);ctx.fillStyle=q.col;ctx.beginPath();ctx.arc(q.x,q.y,q.r,0,7);ctx.fill();ctx.globalAlpha=.9;ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.setLineDash([8,6]);ctx.beginPath();ctx.arc(q.x,q.y,q.r,0,7);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=.45;ctx.fillStyle=q.col;ctx.beginPath();ctx.arc(q.x,q.y,q.r*u,0,7);ctx.fill();ctx.globalAlpha=1}
  else{const u=(q.age-q.delay)/.3,rad=q.r*(.5+.5*u);ctx.globalCompositeOperation='lighter';g=ctx.createRadialGradient(q.x,q.y,0,q.x,q.y,rad);g.addColorStop(0,'#fff');g.addColorStop(.5,q.col);g.addColorStop(1,q.col+'00');ctx.globalAlpha=Math.max(0,1-u);ctx.fillStyle=g;ctx.beginPath();ctx.arc(q.x,q.y,rad,0,7);ctx.fill();ctx.strokeStyle=q.col;ctx.lineWidth=8*(1-u)+1;ctx.beginPath();ctx.arc(q.x,q.y,q.r*(.6+.6*u),0,7);ctx.stroke();ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}}
for(const d of decals){const f=Math.max(0,d.l/d.m);ctx.save();ctx.translate(d.x,d.y);
  if(d.g){ctx.globalAlpha=.4*f;ctx.fillStyle=d.col;ctx.beginPath();ctx.ellipse(0,6,13,5,0,0,7);ctx.fill();ctx.beginPath();ctx.arc(0,-6,11,0,7);ctx.fill();ctx.beginPath();ctx.arc(0,-18,8,0,7);ctx.fill()}
  else{ctx.rotate(d.rot);ctx.globalAlpha=f;ctx.drawImage(scorch(),-d.r,-d.r*.85,d.r*2,d.r*1.7);
   ctx.globalAlpha=.6*f;ctx.strokeStyle=d.col;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,0,d.r*.75,d.r*.65,0,0,7);ctx.stroke();ctx.lineWidth=2;ctx.strokeStyle='#000';
   for(const [a,l] of d.cr){ctx.beginPath();ctx.moveTo(Math.cos(a)*d.r*.15,Math.sin(a)*d.r*.15);ctx.lineTo(Math.cos(a+.15)*d.r*l*.55,Math.sin(a+.15)*d.r*l*.55);ctx.lineTo(Math.cos(a-.1)*d.r*l,Math.sin(a-.1)*d.r*l);ctx.stroke()}}
  ctx.restore()}
 ctx.globalAlpha=1;
 if(raid){
  if(portal){const f=.6+.4*Math.sin(tm*5);ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(portal.x,portal.y,4,portal.x,portal.y,52);g.addColorStop(0,'rgba(200,140,255,'+f+')');g.addColorStop(.6,'rgba(90,200,255,'+(.5*f)+')');g.addColorStop(1,'rgba(90,200,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(portal.x,portal.y,52,0,7);ctx.fill();ctx.globalCompositeOperation='source-over';
   ctx.strokeStyle='#e9d5ff';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(portal.x,portal.y,24,34,tm*.6,0,7);ctx.stroke();ctx.fillStyle='#fff';ctx.font='bold 11px system-ui';ctx.textAlign='center';ctx.fillText(raid.room==5?'NEXT FLOOR':'NEXT ROOM',portal.x,portal.y-46)}
  if(chest){ctx.fillStyle='#0004';ctx.beginPath();ctx.ellipse(chest.x,chest.y+14,20,6,0,0,7);ctx.fill();ctx.fillStyle=chest.open?'#6b4a1e':'#b9772a';ctx.beginPath();ctx.roundRect(chest.x-18,chest.y-12,36,26,5);ctx.fill();ctx.fillStyle=chest.open?'#8a6a2a':'#ffd84d';ctx.fillRect(chest.x-18,chest.y-2,36,5);ctx.fillRect(chest.x-4,chest.y-5,8,10);if(!chest.open){ctx.strokeStyle='#ffe99a';ctx.lineWidth=2;ctx.globalAlpha=.5+.5*Math.sin(tm*6);ctx.strokeRect(chest.x-20,chest.y-14,40,30);ctx.globalAlpha=1}}
  for(const p of pk){const bob=Math.sin(tm*6+p.x)*2;ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.7;ctx.drawImage(glow(p.t=='coin'?'#ffd23c':p.t=='hp'?'#ff5064':'#50b4ff'),p.x-15,p.y+bob-15,30,30);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
   ctx.fillStyle=p.t=='coin'?'#ffd23c':p.t=='hp'?'#ff4d6a':'#4db8ff';ctx.beginPath();if(p.t=='coin')ctx.arc(p.x,p.y+bob,5,0,7);else if(p.t=='hp'){ctx.arc(p.x-3,p.y+bob-1,4,0,7);ctx.arc(p.x+3,p.y+bob-1,4,0,7);ctx.moveTo(p.x-7,p.y+bob);ctx.lineTo(p.x,p.y+bob+8);ctx.lineTo(p.x+7,p.y+bob)}else{ctx.moveTo(p.x,p.y+bob-7);ctx.lineTo(p.x+5,p.y+bob);ctx.lineTo(p.x,p.y+bob+7);ctx.lineTo(p.x-5,p.y+bob)}ctx.fill()}}
 if(lockT&&lockT.al&&touch){ctx.strokeStyle='#ff5a5a';ctx.lineWidth=3;ctx.globalAlpha=.55+.35*Math.sin(tm*8);ctx.beginPath();ctx.ellipse(lockT.x,lockT.y+17,26+Math.sin(tm*8)*2,11,0,0,7);ctx.stroke();ctx.globalAlpha=1}
 if(aim&&aim.on&&me.al){const sk=CH[me.ch].s[aim.key],ux=Math.cos(aim.a),uy=Math.sin(aim.a),rg=aimRange(sk);ctx.save();ctx.globalAlpha=.6;ctx.strokeStyle='#fff';ctx.fillStyle=CH[me.ch].col;ctx.lineWidth=3;ctx.setLineDash([10,8]);
  if(sk.cur){const d=Math.max(70,rg*aim.f),tx=me.x+ux*d,ty=me.y+uy*d;ctx.beginPath();ctx.moveTo(me.x,me.y);ctx.lineTo(tx,ty);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=.3;ctx.beginPath();ctx.arc(tx,ty,sk.r||sk.rad||60,0,7);ctx.fill();ctx.globalAlpha=.8;ctx.stroke()}
  else if(sk.k=='cone'){ctx.setLineDash([]);ctx.globalAlpha=.3;ctx.beginPath();ctx.moveTo(me.x,me.y);ctx.arc(me.x,me.y,sk.r,aim.a-sk.arc/2,aim.a+sk.arc/2);ctx.closePath();ctx.fill()}
  else if(['nova','zone','mine','orbit','shield','heal','haste'].includes(sk.k)){ctx.setLineDash([]);ctx.globalAlpha=.25;ctx.beginPath();ctx.arc(me.x,me.y,sk.r||sk.rad||60,0,7);ctx.fill()}
  else{ctx.setLineDash([]);ctx.lineWidth=Math.max(6,(sk.w||sk.r||6)*2);ctx.globalAlpha=.3;ctx.beginPath();ctx.moveTo(me.x,me.y);ctx.lineTo(me.x+ux*rg,me.y+uy*rg);ctx.stroke()}
  ctx.restore()}
 drawObjs();
 ctx.globalCompositeOperation='lighter';ctx.lineCap='round';
 for(const q of ents){
  if(q.t=='z'){const u=Math.min(1,q.age/.4)*Math.min(1,(q.dur-q.age)*2+.2);ctx.globalAlpha=.4*u;g=ctx.createRadialGradient(q.x,q.y,0,q.x,q.y,q.r);g.addColorStop(0,q.col);g.addColorStop(1,q.col+'00');ctx.fillStyle=g;ctx.beginPath();ctx.arc(q.x,q.y,q.r,0,7);ctx.fill();ctx.globalAlpha=.8*u;ctx.strokeStyle=q.col;ctx.lineWidth=3;const sp=q.pull?-4:3;for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(q.x,q.y,q.r*(.35+.2*i),tm*sp+i,tm*sp+i+2.2);ctx.stroke()}ctx.globalAlpha=1}
  else if(q.t=='c'){const u=q.age/.25;ctx.globalAlpha=Math.max(0,1-u);const a0=q.a-q.arc/2+q.arc*u*.5;ctx.strokeStyle='#fff';ctx.lineWidth=12*(1-u)+2;ctx.beginPath();ctx.arc(q.x,q.y,q.r*.85,a0,a0+q.arc*.5);ctx.stroke();ctx.strokeStyle=q.col;ctx.lineWidth=7;ctx.beginPath();ctx.arc(q.x,q.y,q.r*.85,a0-.15,a0+q.arc*.5+.15);ctx.stroke();ctx.globalAlpha=1}
  else if(q.t=='b'){const ex=q.x+Math.cos(q.a)*q.len,ey=q.y+Math.sin(q.a)*q.len,w=q.w*(.85+.15*Math.sin(tm*40))*Math.min(1,q.age*8)*Math.min(1,(q.dur-q.age)*6);ctx.strokeStyle=q.col;ctx.globalAlpha=.55;ctx.lineWidth=w*1.6;ctx.beginPath();ctx.moveTo(q.x,q.y);ctx.lineTo(ex,ey);ctx.stroke();ctx.globalAlpha=1;ctx.strokeStyle='#fff';ctx.lineWidth=w*.5;ctx.beginPath();ctx.moveTo(q.x,q.y);ctx.lineTo(ex,ey);ctx.stroke()}
  else if(q.t=='o'&&q.bl){for(const b of q.bl)ctx.drawImage(glow(q.col),b[0]-19,b[1]-19,38,38)}
  else if(q.t=='l'){ctx.globalAlpha=Math.max(0,q.life/q.m);ctx.strokeStyle=q.col;ctx.lineWidth=5;for(let pass=0;pass<2;pass++){ctx.beginPath();ctx.moveTo(q.pts[0].x,q.pts[0].y);for(let i=1;i<q.pts.length;i++){const A=q.pts[i-1],B=q.pts[i];for(let j=1;j<=6;j++){const u=j/6,jt=j<6?(Math.random()-.5)*26:0;ctx.lineTo(A.x+(B.x-A.x)*u+jt,A.y+(B.y-A.y)*u+jt)}}ctx.stroke();ctx.strokeStyle='#fff';ctx.lineWidth=2}ctx.globalAlpha=1}}
 for(const q of ents){if(q.t!='p')continue;const sp=Math.hypot(q.vx,q.vy),ux=q.vx/sp,uy=q.vy/sp,len=Math.min(q.pierce?170:70,q.r*3+sp*.05);
  ctx.strokeStyle=q.col;ctx.globalAlpha=.55;ctx.lineWidth=q.r*1.8;ctx.beginPath();ctx.moveTo(q.x,q.y);ctx.lineTo(q.x-ux*len,q.y-uy*len);ctx.stroke();
  ctx.globalAlpha=1;ctx.drawImage(glow(q.col),q.x-q.r*2,q.y-q.r*2,q.r*4,q.r*4);
  if(q.r>30){ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(q.x,q.y,q.r*(.8+.15*Math.sin(tm*15)),tm*6,tm*6+4);ctx.stroke()}}
 for(const p of parts){const u=p.l/p.m,r=p.s*(.4+.6*u);ctx.globalAlpha=u>0?u:0;ctx.fillStyle=p.c;if(r<2.2)ctx.fillRect(p.x-r,p.y-r,r*2,r*2);else{ctx.beginPath();ctx.arc(p.x,p.y,r,0,7);ctx.fill()}}
 ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
 for(const q of ents){if(q.t!='p')continue;ctx.fillStyle=q.col;ctx.strokeStyle='#1b1030';ctx.lineWidth=2.2;ctx.beginPath();ctx.arc(q.x,q.y,Math.max(3,q.r*.7),0,7);ctx.fill();ctx.stroke();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(q.x-q.r*.2,q.y-q.r*.22,Math.max(1.2,q.r*.28),0,7);ctx.fill()}
 ctx.textAlign='center';ctx.lineJoin='round';for(const t of txts){const age=t.m-t.l,sc=age<.14?1+(.14-age)*5:1;ctx.save();ctx.translate(t.x,t.y);ctx.scale(sc,sc);ctx.globalAlpha=Math.min(1,t.l*3);ctx.font=(t.big?'900 16px':'900 23px')+' system-ui';ctx.lineWidth=5;ctx.strokeStyle='#1b1030';ctx.strokeText(t.s,0,0);ctx.fillStyle=t.big?t.c:(t.c||(t.s>=25?'#ffd84d':'#fff'));ctx.fillText(t.s,0,0);ctx.restore()}ctx.globalAlpha=1;
 ctx.setTransform(dpr,0,0,dpr,0,0);
 if(!VG||VG.w!=cw||VG.h!=chh){VG=ctx.createRadialGradient(cw/2,chh/2,Math.min(cw,chh)*.45,cw/2,chh/2,Math.max(cw,chh)*.75);VG.addColorStop(0,'rgba(0,0,0,0)');VG.addColorStop(1,'rgba(10,5,30,.4)');VG.w=cw;VG.h=chh;
  VR=ctx.createRadialGradient(cw/2,chh/2,Math.min(cw,chh)*.3,cw/2,chh/2,Math.max(cw,chh)*.7);VR.addColorStop(0,'rgba(255,0,0,0)');VR.addColorStop(1,'rgba(255,20,40,.75)')}
 ctx.fillStyle=VG;ctx.fillRect(0,0,cw,chh);
 if(me.al&&me.hp<me.mx*.3){ctx.globalAlpha=(.45+.25*Math.sin(tm*7))*(1-me.hp/(me.mx*.3)*.6);ctx.fillStyle=VR;ctx.fillRect(0,0,cw,chh);ctx.globalAlpha=1}
 if(raid)hudRun();else hudPvp();
 const sk=CH[me.ch].s;
 if(!touch)skillBtns();
 else{for(const k of['q','e','r']){const v=Math.round(me.cd[k]/sk[k].cd*20)*5;if(TB[k]!==v){TB[k]=v;$('b'+k).lastChild.style.height=v+'%'}}
  const av=Math.round(100-(me.awt>0?100:me.aw||0)),rdy=me.aw>=100&&!(me.awt>0);if(TB.w!==av){TB.w=av;$('bw').lastChild.style.height=av+'%'}if(TB.g!==rdy){TB.g=rdy;$('bw').style.boxShadow=rdy?'0 0 14px 4px #ffd84d':''}}
 if(touch&&!raid){const on=me.awt>0,by=chh-16,bx=cw/2-150,pct=on?me.awt/15:(me.aw||0)/100;rr(bx,by,306,9,4,'#000a');rr(bx,by,306*pct,9,4,on?'#fff3a0':'#ffd84d');ctx.font='bold 11px system-ui';ctx.textAlign='center';ctx.fillStyle='#fff';ctx.fillText(on?'AWAKENED '+me.awt.toFixed(1)+'s':(me.aw>=100?'AWAKEN READY!':'Awakening '+Math.floor(me.aw||0)+'%'),cw/2,by-3)}
 if(tmode)scoreboard();hudFeed();minimap();
 if(flash>0){ctx.fillStyle=(flashS?'rgba(120,200,255,':'rgba(255,0,0,')+flash*2+')';ctx.fillRect(0,0,cw,chh)}
 ctx.textAlign='center';if(!raid&&!me.al){ctx.fillStyle='#000a';ctx.fillRect(0,chh/2-40,cw,80);ctx.fillStyle='#fff';ctx.font='bold 26px system-ui';ctx.fillText('KO! Respawning in '+Math.ceil(me.rt),cw/2,chh/2+8)}
 if(over){ctx.fillStyle='#000c';ctx.fillRect(0,chh/2-55,cw,110);ctx.fillStyle='#ffd166';ctx.font='bold 32px system-ui';ctx.fillText('🏆 '+winner+' wins!',cw/2,chh/2);ctx.font='16px system-ui';ctx.fillStyle='#fff';ctx.fillText('New round in '+Math.ceil(over),cw/2,chh/2+30)}}
const TB={};
function hbar(x,y,w,h,f,c){rr(x-1.5,y-1.5,w+3,h+3,h/2+1.5,'#0d0820');if(f>0)rr(x,y,Math.max(h,w*Math.min(1,f)),h,h/2,c)}
function otext(t,x,y,c){ctx.strokeStyle='#1b1030';ctx.strokeText(t,x,y);ctx.fillStyle=c||'#fff';ctx.fillText(t,x,y)}
// PvP: one card per fighter along the top (the menu button owns the right corner)
function hudPvp(){const pl=all(),n=pl.length,pw=Math.min(210,(cw-54)/n-4);
 pl.forEach(([id,e],i)=>{const x=6+i*(pw+4),tc=tmode?(e.tm===me.tm?'#4da3ff':'#ff5a5a'):CH[e.ch].col;ctx.fillStyle='#1b1030';ctx.beginPath();ctx.roundRect(x-1,5,pw+2,38,10);ctx.fill();ctx.fillStyle='#2b2250';ctx.beginPath();ctx.roundRect(x+1,7,pw-2,34,8);ctx.fill();ctx.fillStyle=tc;ctx.beginPath();ctx.roundRect(x+1,7,6,34,3);ctx.fill();
  ctx.fillStyle=CH[e.ch].col;ctx.beginPath();ctx.arc(x+22,24,11,0,7);ctx.fill();ctx.strokeStyle='#1b1030';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#fff';ctx.font='900 11px system-ui';ctx.textAlign='center';ctx.fillText(CH[e.ch].n[0],x+22,28);
  ctx.textAlign='left';ctx.font='bold 11px system-ui';ctx.fillStyle='#fff';ctx.fillText(e.nm.slice(0,9),x+38,20);ctx.textAlign='right';ctx.fillStyle='#ffd166';ctx.fillText('KO '+e.k,x+pw-6,20);
  ctx.fillStyle='#14102a';ctx.beginPath();ctx.roundRect(x+38,25,pw-48,7,3.5);ctx.fill();const fw=Math.max(0,(pw-48)*e.hp/e.mx);if(fw>1){ctx.fillStyle=e.al?(tmode&&e.tm!==me.tm?'#ef4444':'#4ade80'):'#f55';ctx.beginPath();ctx.roundRect(x+38,25,fw,7,3.5);ctx.fill()}
  if(e.sm){ctx.fillStyle='#14102a';ctx.fillRect(x+38,34,pw-48,3);ctx.fillStyle='#a9dcff';ctx.fillRect(x+38,34,(pw-48)*Math.max(0,Math.min(1,e.sd/e.sm)),3)}})}
// PvE: Soul Knight style status card (health, armor, awakening), boss bar and run banners
function hudRun(){const r=raid,c=CH[me.ch],x=8,y=8,w=Math.min(264,cw-64),bx=x+62,bw=w-70,st=r.mode=='stage',mw=Math.min(150,cw*.3);
 rr(x,y,w,78,14,'rgba(27,16,48,.9)');ctx.strokeStyle='#ffffff22';ctx.lineWidth=1.5;ctx.beginPath();ctx.roundRect(x,y,w,78,14);ctx.stroke();
 ctx.fillStyle=c.col;ctx.beginPath();ctx.arc(x+25,y+47,19,0,7);ctx.fill();ctx.strokeStyle='#1b1030';ctx.lineWidth=3;ctx.stroke();ctx.fillStyle='#fff';ctx.font='900 18px system-ui';ctx.textAlign='center';ctx.fillText(c.n[0],x+25,y+53);
 ctx.font='900 11px system-ui';ctx.textAlign='left';ctx.fillStyle='#ffe14d';ctx.fillText((st?'STAGE '+(r.plan.c+1)+'-'+r.plan.i:'FLOOR '+r.floor)+' · ROOM '+r.room+'/'+(st?r.plan.rooms.length:5),x+10,y+16);
 ctx.textAlign='right';ctx.fillStyle='#ffd23c';ctx.fillText('🪙 '+Math.round(r.gold),x+w-10,y+16);
 const row=(yy,f,col,txt,ic,icc)=>{ctx.textAlign='center';ctx.font='900 12px system-ui';ctx.fillStyle=icc;ctx.fillText(ic,bx-9,yy+10);hbar(bx,yy,bw,11,f,col);if(txt){ctx.font='900 9px system-ui';ctx.lineWidth=2.5;otext(txt,bx+bw/2,yy+9)}};
 row(y+24,me.hp/me.mx,'#ef4444',Math.max(0,Math.ceil(me.hp))+' / '+me.mx,'♥','#ff6b7d');
 row(y+41,me.sm?me.sd/me.sm:0,me.sdt>0?'#7f9fc4':'#a9dcff',Math.ceil(Math.max(0,me.sd))+' / '+me.sm,'◆','#a9dcff');
 row(y+58,me.awt>0?me.awt/15:(me.aw||0)/100,me.awt>0?'#fff3a0':'#ffd84d',me.awt>0?'AWAKENED':me.aw>=100?(touch?'READY!':'SPACE!'):'','★','#ffd84d');
 let by=y+96;const bo=others.boss;
 if(bo&&bo.al){const L=w+20,Rr=cw-mw-20,wide=Rr-L>=220,bw2=wide?Math.min(440,Rr-L):cw-mw-28,bx2=wide?L+(Rr-L-bw2)/2:8,yy=wide?16:y+88;
  hbar(bx2,yy,bw2,13,bo.hp/bo.mx,'#ef4444');ctx.font='900 11px system-ui';ctx.textAlign='center';ctx.lineWidth=3;otext('👑 '+bo.nm+'  '+Math.ceil(bo.hp),bx2+bw2/2,yy+27);if(!wide)by+=36}
 if(r.bfs){ctx.font='15px system-ui';ctx.textAlign='left';ctx.fillStyle='#fff';ctx.fillText(r.bfs,x+4,by+4)}
 ctx.textAlign='center';ctx.lineJoin='round';
 if(r.state=='clear'&&!choice){const t=chest&&!chest.open?'Open the chest, then enter the portal':'Enter the portal';ctx.font='bold 13px system-ui';const tw=ctx.measureText(t).width+28,hy=chh-(touch?20:34);rr(cw/2-tw/2,hy-17,tw,25,12,'#000a');ctx.fillStyle='#7dffb0';ctx.fillText(t,cw/2,hy)}
 if(r.state=='win'||r.state=='down'){const u=r.state=='win'?Math.min(1,(2.2-r.winT)*4):1;ctx.save();ctx.translate(cw/2,chh*.36);ctx.scale(1.6-.6*u,1.6-.6*u);ctx.font='900 '+Math.min(54,cw/9|0)+'px system-ui';ctx.lineWidth=9;otext(r.state=='win'?'STAGE CLEAR!':'K.O.',0,0,r.state=='win'?'#ffd84d':'#ff6b6b');ctx.restore()}}
function minimap(){const mw=Math.min(150,cw*.3),mh=mw*H/W,x0=raid?cw-mw-8:8,y0=raid?(cw-mw-8<Math.min(264,cw-64)+16?94:52):46,sx=mw/W,sy=mh/H;rr(x0,y0,mw,mh,6,'#0b1f33cc');ctx.strokeStyle='#ffffff55';ctx.lineWidth=1.5;ctx.strokeRect(x0,y0,mw,mh);ctx.fillStyle='#8a94a8';for(const p of PIL){ctx.beginPath();ctx.arc(x0+p[0]*sx,y0+p[1]*sy,Math.max(1.3,p[2]*sx),0,7);ctx.fill()}
 ctx.strokeStyle='#ffe14d99';ctx.lineWidth=1;ctx.strokeRect(x0+Math.max(0,cam.x)*sx,y0+Math.max(0,cam.y)*sy,Math.min(W,VW)*sx,Math.min(H,VH)*sy);
 if(portal){ctx.fillStyle='#d8b4fe';ctx.fillRect(x0+portal.x*sx-3,y0+portal.y*sy-3,6,6)}
 for(const [id,e] of all()){if(!e.al||hiddenE(e))continue;ctx.fillStyle=id=='me'?'#fff':tmode?(e.tm===me.tm?'#4da3ff':'#ff5a5a'):e.raidE?'#ff5a5a':CH[e.ch].col;ctx.beginPath();ctx.arc(x0+e.x*sx,y0+e.y*sy,id=='me'?3.6:e.boss?4.2:2.8,0,7);ctx.fill();if(id=='me'){ctx.strokeStyle='#000';ctx.lineWidth=1;ctx.stroke()}}}
function loop(t){if(!run)return;const raw=(t-last)/1e3,dt=Math.min(.05,raw);last=t;
 // step down a tier after 2.5s of long frames, then check it helped: if not (30Hz screen, throttled tab) step back up and stop adjusting
 if(qset<0&&!paused&&!qa.lock&&raw<.25){fts=fts*.95+raw*.05;
  if(qa.trial>0){qa.trial-=raw;if(qa.trial<=0){if(fts>qa.prev*.85){setQ(QL.indexOf(Q)-1);qa.lock=1}slowT=0}}
  else if(fts>.024){slowT+=raw;if(slowT>2.5&&Q!==QL[2]){qa.prev=fts;qa.trial=3;slowT=0;setQ(QL.indexOf(Q)+1)}}else slowT=Math.max(0,slowT-raw)}
 if(!paused){tm+=dt;update(dt);draw();pd=0}else if(!pd){draw();pd=1}
 raf=requestAnimationFrame(loop)}
addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(!run||$('m').style.display!='none')return;if(k=='escape'){UI.pause();return}if(choice){if('123'.includes(k)&&k.length==1)pickBuff(+k-1);return}if(paused)return;(loc2&&(k.startsWith('arrow')||k=='enter')?k2:keys)[k]=1;
 if('qer'.includes(k)&&k.length==1){me.a=Math.atan2(mouse.y-me.y,mouse.x-me.x);hold=0;tryCast(me,'me',k,mouse.x,mouse.y);e.preventDefault()}
 if(loc2&&others.p2&&',./'.includes(k)&&k.length==1){const p=others.p2;tryCast(p,'p2',{',':'q','.':'e','/':'r'}[k],p.x+Math.cos(p.a)*220,p.y+Math.sin(p.a)*220);e.preventDefault()}
 if(k=='enter')e.preventDefault()
 if(k==' ')awaken();if(k==' '||k.startsWith('arrow'))e.preventDefault()});
addEventListener('keyup',e=>{const k=e.key.toLowerCase();keys[k]=0;k2[k]=0});addEventListener('blur',()=>{keys={};k2={};mouse.down=false});
const mp=e=>{const r=cv.getBoundingClientRect();mouse.x=cam.x+(e.clientX-r.left)/K;mouse.y=cam.y+(e.clientY-r.top)/K};
cv.addEventListener('mousemove',e=>{if(!touch)mp(e)});cv.addEventListener('mousedown',e=>{if(touch)return;mp(e);mouse.down=true});addEventListener('mouseup',()=>{if(!touch)mouse.down=false});
cv.addEventListener('contextmenu',e=>e.preventDefault());

function lab(){const s=CH[me.ch].s;['q','e','r'].forEach(k=>{$('b'+k).querySelector('small').textContent=s[k].nm})}
let jid=null;const js=$('js');
function jmove(e){const r=js.getBoundingClientRect();let dx=(e.clientX-r.left-r.width/2)/(r.width/2),dy=(e.clientY-r.top-r.height/2)/(r.height/2);const l=Math.hypot(dx,dy);if(l>1){dx/=l;dy/=l}joy.x=Math.abs(dx)<.12?0:dx;joy.y=Math.abs(dy)<.12?0:dy;$('kn').style.transform='translate('+dx*39+'px,'+dy*39+'px)'}
js.addEventListener('pointerdown',e=>{jid=e.pointerId;try{js.setPointerCapture(jid)}catch(err){}jmove(e)});
js.addEventListener('pointermove',e=>{if(e.pointerId==jid)jmove(e)});
const jend=e=>{if(e.pointerId==jid){jid=null;joy.x=joy.y=0;$('kn').style.transform=''}};
js.addEventListener('pointerup',jend);js.addEventListener('pointercancel',jend);
{let pid=null,cx=0,cy=0;const b=$('ba');
 b.addEventListener('pointerdown',e=>{pid=e.pointerId;try{b.setPointerCapture(pid)}catch(err){}const r=b.getBoundingClientRect();cx=r.left+r.width/2;cy=r.top+r.height/2;mouse.down=true;aim={key:'a',a:me?me.a:0,f:1,on:0};e.preventDefault()});
 b.addEventListener('pointermove',e=>{if(e.pointerId!==pid||!aim||aim.key!='a')return;const dx=e.clientX-cx,dy=e.clientY-cy;if(Math.hypot(dx,dy)>14){aim.on=1;aim.a=Math.atan2(dy,dx)}});
 const end=e=>{if(e.pointerId!==pid)return;pid=null;mouse.down=false;if(aim&&aim.key=='a')aim=null};
 ['pointerup','pointercancel'].forEach(t=>b.addEventListener(t,end))}
function aimRange(s){return Math.min(520,s.cur?380:(s.len||(s.spd&&s.life?s.spd*s.life:0)||s.dist||s.r||(s.rad||0)+120||200))}
['q','e','r'].forEach(k=>{const b=$('b'+k);let pid=null,cx=0,cy=0;
 b.addEventListener('pointerdown',e=>{if(!run||!me)return;pid=e.pointerId;try{b.setPointerCapture(pid)}catch(err){}const r=b.getBoundingClientRect();cx=r.left+r.width/2;cy=r.top+r.height/2;aim={key:k,a:me.a,f:0,on:0};e.preventDefault()});
 b.addEventListener('pointermove',e=>{if(e.pointerId!==pid||!aim)return;const dx=e.clientX-cx,dy=e.clientY-cy,l=Math.hypot(dx,dy);if(l>14){aim.on=1;aim.a=Math.atan2(dy,dx);aim.f=Math.min(1,l/90)}});
 b.addEventListener('pointerup',e=>{if(e.pointerId!==pid)return;pid=null;const a=aim;aim=null;if(!a||!run||!me)return;
  if(a.on){const sk=CH[me.ch].s[k],d=Math.max(70,aimRange(sk)*a.f);me.a=a.a;hold=.35+(sk.k=='beam'?(sk.dur||0)+(sk.delay||0):0);tryCast(me,'me',k,me.x+Math.cos(a.a)*d,me.y+Math.sin(a.a)*d)}
  else tryCast(me,'me',k,mouse.x,mouse.y)});
 b.addEventListener('pointercancel',e=>{if(e.pointerId===pid){pid=null;aim=null}})});
$('mb').onclick=()=>UI.pause();
addEventListener('pagehide',()=>{if(R)try{R.leave()}catch(e){}});
if(touch){document.body.classList.add('t');$('bl').style.display='none'}
resize();
