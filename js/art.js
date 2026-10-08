// ===== art: everything drawn inside the arena =====
// Bold ink outlines, flat cel shading, chunky readable shapes. Heroes share one rig (human) dressed by c.lk
// {wp weapon, gr gear, hs hair, acc headgear, off off-hand, sk skin, sc scale, face}; odd-shaped monsters get their own painter in MON.
const INK='#1b1030',STEEL='#dfe7f3',STEEL2='#9aa7bd',SKN='#ffdcbd',WOOD='#8a5a2b',GOLD='#ffd166',LK0={wp:'sword',gr:'light',hs:'spiky'};
let HIT=0,fxs=[];
// transient effects: k kind, r size, l life in seconds
const FX=(k,x,y,r,col,l,a)=>{if(fxs.length<90)fxs.push({k,x,y,r,col,t0:tm,l:l||.3,a:a||0})};
const aF=c=>{ctx.fillStyle=HIT?'#fff':c;ctx.fill()},aFS=c=>{ctx.fillStyle=HIT?'#fff':c;ctx.fill();ctx.stroke()};
function aPoly(p,c,ns){ctx.beginPath();ctx.moveTo(p[0],p[1]);for(let i=2;i<p.length;i+=2)ctx.lineTo(p[i],p[i+1]);ctx.closePath();ns?aF(c):aFS(c)}
function aCirc(x,y,r,c,ns){ctx.beginPath();ctx.arc(x,y,r,0,7);ns?aF(c):aFS(c)}
function aEll(x,y,rx,ry,c,ns,rot){ctx.beginPath();ctx.ellipse(x,y,rx,ry,rot||0,0,7);ns?aF(c):aFS(c)}
function aRR(x,y,w,h,r,c,ns){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ns?aF(c):aFS(c)}
// outlined limb / shaft: thick ink stroke with the colour laid on top
function aLimb(x0,y0,x1,y1,w,c){ctx.lineWidth=w+2.6;ctx.strokeStyle=INK;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.lineWidth=w;ctx.strokeStyle=HIT?'#fff':c;ctx.stroke();ctx.lineWidth=2.4;ctx.strokeStyle=INK}
function aLine(x0,y0,x1,y1,c,w){ctx.lineWidth=w||1.2;ctx.strokeStyle=c;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.lineWidth=2.4;ctx.strokeStyle=INK}
function aStar(x,y,r,n,c,rot,ns){ctx.beginPath();for(let i=0;i<n*2;i++){const a=(rot||0)+i*Math.PI/n,q=i%2?r*.45:r;ctx.lineTo(x+Math.cos(a)*q,y+Math.sin(a)*q)}ctx.closePath();ns?aF(c):aFS(c)}
const glowAt=(col,x,y,r,al)=>{ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=al;ctx.drawImage(glow(col),x-r,y-r,r*2,r*2);ctx.restore()};

// ---------- weapons: drawn at the hand, pointing along +x
const WPN={
sword(c){aRR(-4,-1.7,8,3.4,1.2,'#6b4a2e');aRR(3,-5,3.2,10,1.4,GOLD);aPoly([6,-2.8,24,-2.4,30,0,24,2.4,6,2.8],'#eef3ff');aLine(8,0,25,0,'#9fb0cc')},
gsword(c){aRR(-7,-2,12,4,1.4,'#4a3350');aRR(4,-7,4,14,1.6,GOLD);aCirc(6,0,2.2,c.col);aPoly([8,-4.6,31,-4,39,0,31,4,8,4.6],'#eef3ff');aLine(10,0,32,0,'#9fb0cc',1.6)},
katana(c){aRR(-7,-1.8,12,3.6,1.4,'#2b2140');aLine(-5,-1.6,-3,1.6,c.col,1.2);aLine(-1,-1.6,1,1.6,c.col,1.2);aEll(5.5,0,1.8,4,GOLD);ctx.beginPath();ctx.moveTo(7,-1.9);ctx.quadraticCurveTo(22,-5,35,-3.4);ctx.lineTo(36,-1.2);ctx.quadraticCurveTo(22,-1.4,7,1.9);ctx.closePath();aFS('#f4f8ff');ctx.beginPath();ctx.moveTo(9,.6);ctx.quadraticCurveTo(22,-1.6,34,-1.6);ctx.lineWidth=1;ctx.strokeStyle=c.col;ctx.stroke();ctx.lineWidth=2.4;ctx.strokeStyle=INK},
dagger(c){aRR(-3,-1.6,6,3.2,1.2,'#2b2140');aRR(2,-3.4,2.4,6.8,1,GOLD);aPoly([4,-2.2,13,-1.6,17,0,13,1.6,4,2.2],'#eef3ff')},
spear(c){aLimb(-14,0,26,0,2.4,WOOD);aCirc(23,0,2.6,c.col);aPoly([25,-3.8,39,0,25,3.8,22,0],'#eef3ff')},
lance(c){aRR(-8,-1.8,12,3.6,1.4,'#4a3350');aPoly([5,-5,40,0,5,5],'#f4f8ff');aLine(8,0,34,0,GOLD,1.4);aEll(5,0,2.6,6.6,c.col)},
axe(c){aLimb(-9,0,23,0,2.6,WOOD);aPoly([13,-3,19,-13,28,-10,25,0,28,10,19,13,13,3],'#e3e9f5');aPoly([15,-2,20,-9,24,-7,22,0],'#b9c6dd',1)},
hammer(c){aLimb(-9,0,20,0,2.8,WOOD);aRR(15,-9,12,18,3,STEEL2);aRR(15,-9,12,5,2,STEEL,1);aRR(18,-9,3,18,1,c.col,1)},
scythe(c){aLimb(-16,0,27,0,2.4,'#3a2f55');ctx.beginPath();ctx.moveTo(25,-2.5);ctx.quadraticCurveTo(40,-16,13,-22);ctx.quadraticCurveTo(31,-13,22,2.5);ctx.closePath();aFS('#e9ecff');aCirc(25,0,2.6,c.col)},
club(c){aPoly([-5,-2,15,-5.5,22,-4.5,24,0,22,4.5,15,5.5,-5,2],WOOD);aCirc(17,-3.5,1.6,'#e9e2d0');aCirc(19.5,2.5,1.6,'#e9e2d0');aCirc(13,2.8,1.4,'#e9e2d0')},
staff(c){aLimb(-13,0,20,0,2.4,WOOD);aPoly([18,-2,22,-7,26,-6,23,-2],GOLD);aPoly([18,2,22,7,26,6,23,2],GOLD);glowAt(c.col,25,0,13,.5+.2*Math.sin(tm*5));aCirc(25,0,5,c.col);aCirc(23.4,-1.6,1.5,'#fff',1)},
bstaff(c){aLimb(-13,0,19,0,2.4,'#3a2f55');aCirc(24,0,6,'#f1eee2');aCirc(22,-1.8,1.5,INK,1);aCirc(26,-1.8,1.5,INK,1);glowAt(c.col,24,0,12,.4)},
wand(c){aLimb(-3,0,12,0,2,'#fff');aStar(16,0,6.5,5,'#ffe14d',tm*2);glowAt('#ffe14d',16,0,11,.45)},
orb(c){const y=Math.sin(tm*4)*1.6;glowAt(c.col,11,y-2,15,.55);aCirc(11,y-2,6,c.col);aCirc(9,y-4,1.8,'#fff',1);ctx.beginPath();ctx.ellipse(11,y-2,9,3,tm*2,0,7);ctx.lineWidth=1.2;ctx.strokeStyle='#fff';ctx.stroke();ctx.lineWidth=2.4;ctx.strokeStyle=INK},
tome(c){aPoly([2,-7,11,-9,11,6,2,7],c.col);aPoly([11,-9,20,-7,20,7,11,6],c.col);aPoly([4,-5.5,10.5,-7,10.5,4.5,4,5.5],'#fff8e6',1);aPoly([11.5,-7,18,-5.5,18,5.5,11.5,4.5],'#fff8e6',1);glowAt(c.col,11,-10,10,.4+.2*Math.sin(tm*6))},
bow(c,L,u){const pull=u<0?4:0;ctx.lineWidth=5.4;ctx.strokeStyle=INK;ctx.beginPath();ctx.arc(-2,0,15,-1.15,1.15);ctx.stroke();ctx.lineWidth=2.8;ctx.strokeStyle=HIT?'#fff':WOOD;ctx.stroke();ctx.lineWidth=2.4;ctx.strokeStyle=INK;const tx=-2+Math.cos(1.15)*15,ty=Math.sin(1.15)*15;aLine(tx,-ty,tx-pull-1,0,'#fff',1);aLine(tx,ty,tx-pull-1,0,'#fff',1);aCirc(13,0,2.2,c.col);if(u<0){aLine(tx-pull,0,18,0,WOOD,1.6);aPoly([17,-2.6,23,0,17,2.6],'#eef3ff')}},
gun(c){aRR(1,1,5,7.5,1.5,'#3a2f55');aRR(0,-3.2,15,5.6,1.8,STEEL2);aRR(11,-2.2,5,3.4,1,STEEL,1);aRR(2,-3.2,4,2,1,c.col,1)},
rifle(c){aPoly([-13,-1,-4,-2.4,-4,2.6,-13,4.5],WOOD);aRR(-5,-2.6,36,5,1.6,'#4a4560');aRR(4,-6.4,11,3.6,1.6,STEEL2);aRR(27,-1.6,6,3,1,STEEL,1);aRR(2,2.4,4,5,1.2,'#3a2f55')},
shotgun(c){aPoly([-12,-1,-4,-3,-4,3.4,-12,5],WOOD);aRR(-5,-3.8,28,7.2,1.8,'#4a4560');aLine(-3,-.2,21,-.2,INK,1.2);aRR(7,3,10,3.4,1.4,WOOD);aRR(19,-2.8,3.4,5.2,1,STEEL,1)},
cannon(c){aRR(-4,-7,24,14,4.5,STEEL2);aRR(-4,-7,24,4.5,3,STEEL,1);aRR(15,-8,6,16,2.5,'#4a4560');glowAt(c.col,22,0,10,.6+.25*Math.sin(tm*8));aCirc(21.5,0,3.6,c.col,1)},
flamer(c){aCirc(-5,4,5.6,'#d13a1e');aRR(-2,-3.2,22,6.4,2,'#4a4560');aRR(17,-4.2,5,8.4,1.6,STEEL2);const f=Math.sin(tm*20)*1.5;aPoly([22,-2.2,29+f,0,22,2.2],'#ffb02e');aPoly([22,-1.1,25.5+f*.5,0,22,1.1],'#fff3a0',1)},
bomb(c){aCirc(9,0,7.2,'#2b2f3a');aCirc(6.8,-2.4,1.8,'#7a8194',1);aRR(13,-6.5,3.4,3.4,1,STEEL2);aLine(15,-6,18,-10,WOOD,1.6);aStar(18.5,-10.5,3.2+Math.sin(tm*25),4,'#ffe14d',tm*9,1)},
kunai(c){aCirc(-3,0,2.4,'#2b2140');aRR(-1,-1.2,5,2.4,1,'#2b2140');aPoly([3,-3,15,0,3,3],'#eef3ff')},
fist(c,L){const s=L.fr||6.6;aCirc(5,0,s,L.fc||'#e94a4a');aLine(5+s*.25,-s*.55,5+s*.25,s*.55,INK,1.2);aLine(5+s*.6,-s*.35,5+s*.6,s*.35,INK,1.2);aRR(-2.5,-3.4,4,6.8,1.5,'#fff')},
claws(c){aCirc(2,0,4,'#2b2140');for(const y of[-3.2,0,3.2])aPoly([4,y-1.2,17,y*1.4,4,y+1.2],'#eef3ff')},
mega(c){aRR(-2,1,3.4,7,1.2,'#3a2f55');aPoly([-1,-2.6,14,-8,14,8,-1,2.6],'#f4f8ff');aRR(13,-8.6,3,17.2,1.2,c.col)},
none(){}};
const W_SWING=/sword|katana|dagger|axe|hammer|scythe|club|claws/,W_THRUST=/spear|lance|fist/,W_TWO=/gsword|spear|lance|axe|hammer|scythe|rifle|shotgun|flamer|staff|bstaff/,W_PAIR=/dagger|fist|claws/;
function shield(x,y,c){aPoly([x-6,y-8,x+6,y-8,x+7,y+1,x,y+9,x-7,y+1],STEEL);aPoly([x-3.4,y-5,x+3.4,y-5,x+4,y,x,y+5.4,x-4,y],c.col,1);aCirc(x,y-.6,1.6,GOLD,1)}

// ---------- the shared hero rig. Origin = feet, facing +x (the caller mirrors it)
function human(e,c,L,o){
 const g=L.gr||'light',sk=L.sk||SKN,col=c.col,c2=L.c2||shade(col,-.34),hair=e.awt>0?'#fff3a0':(c.hair||'#333'),hs=L.hs||'spiky',acc=L.acc||c.acc,wp=L.wp||'none';
 const sw=o.walk?Math.sin(o.ph):0,la=o.la,sway=Math.sin(tm*3+e.x*.02)*1.6-(o.walk?3:0),u=o.atk,bare=/vest|rag|bare/.test(g),arm=/armor|tech/.test(g);
 const slv=bare?sk:arm?STEEL:col,robe=g.includes('robe'),hood=g.includes('hood'),face=L.face,flap=Math.sin(tm*(o.walk?9:4))*3;
 ctx.lineJoin=ctx.lineCap='round';ctx.lineWidth=2.4;ctx.strokeStyle=INK;
 // back layer
 if(g.includes('wings')){const wc=L.wc||'#fff';aPoly([-5,-25,-24,-42+flap,-31,-28+flap,-23,-20,-27,-12+flap,-9,-14],wc);aPoly([6,-25,21,-40+flap,25,-27+flap,13,-16],wc);aLine(-8,-24,-25,-36+flap,shade(wc,-.25),1.2);aLine(-8,-20,-24,-24+flap,shade(wc,-.25),1.2)}
 if(g.includes('tail'))aLimb(-5,-10,-17,-5+sway,3,L.tc||sk);
 if(g.includes('cape'))aPoly([-8,-25,7,-25,5,-12,-3+sway*.3,-3,-16+sway,-2,-13+sway*.5,-15],L.cc||c2);
 if(!hood){
  if(hs=='long')aPoly([-12,-41,5,-45,7,-30,-5,-12,-15+sway*.6,-11,-15,-30],hair);
  else if(hs=='pony')aPoly([-9,-41,-14,-43,-21+sway,-31,-18+sway,-17,-12+sway*.5,-23,-11,-35],hair);
  else if(hs=='twin'){aPoly([-10,-38,-17,-35,-19+sway,-17,-13+sway,-16,-11,-30],hair);aPoly([11,-38,16,-35,17+sway*.5,-18,12,-17,10,-30],hair)}
  else if(hs=='bob')aRR(-13.5,-45,28,25,10,hair);
  else if(hs=='wild')aPoly([-12,-30,-20,-34,-15,-40,-22,-47,-13,-48,-14,-56,-6,-51,-2,-59,4,-51,11,-56,11,-48,19,-47,14,-40,18,-33,12,-30],hair)}
 // arms and weapon
 const sfx=8,sfy=-21,hx=sfx+Math.cos(la)*9,hy=sfy+Math.sin(la)*8+2,sbx=-8,sby=-21,pair=(W_PAIR.test(wp)||L.pair)&&!L.one,two=W_TWO.test(wp)&&!L.off&&!pair,alt=pair&&(e.atn&1);
 let rot=pair?la-.16:la,th=0,th2=0,rot2=la+.5;
 if(u>=0){const s=Math.sin(u*Math.PI);if(W_SWING.test(wp)){const q=(u<.45?-1.25+u/.45*2.35:1.1-(u-.45)/.55*1.1);alt?rot2=la+.5+q:rot=la+q}else if(W_THRUST.test(wp)){alt?th2=s*9:th=s*9}else th=-s*4}
 const bx=pair?sbx+Math.cos(la)*8:two?hx-Math.cos(rot)*7:-10,by=pair?sby+Math.sin(la)*7+3:two?hy-Math.sin(rot)*7:-13+sw*2;
 const drawW=()=>{aLimb(sfx,sfy,hx+Math.cos(rot)*th,hy+Math.sin(rot)*th,4.2,slv);ctx.save();ctx.translate(hx+Math.cos(rot)*th,hy+Math.sin(rot)*th);ctx.rotate(rot);(WPN[wp]||WPN.none)(c,L,u);if(L.fl){const f=Math.sin(tm*22);aPoly([10,-3,17,-8-f*2,22,-3,27,-7+f*2,30,0,10,3],'#ff8a3c',1);aPoly([12,-1,18,-4-f,26,0,12,2],'#ffe14d',1)}ctx.restore();if(wp!='fist')aCirc(hx+Math.cos(rot)*th,hy+Math.sin(rot)*th,3.3,bare||!arm?sk:STEEL2)};
 const drawB=()=>{aLimb(sbx,sby,bx+Math.cos(la)*th2,by+Math.sin(la)*th2,4.2,slv);if(pair){ctx.save();ctx.translate(bx+Math.cos(la)*th2,by+Math.sin(la)*th2);ctx.rotate(rot2);WPN[wp](c,L,u);ctx.restore()}if(wp!='fist'||!pair)aCirc(bx+Math.cos(la)*th2,by+Math.sin(la)*th2,3.3,sk)};
 const wBack=Math.sin(la)<-.5;
 drawB();if(wBack)drawW();
 // legs / skirt
 if(!robe){const pc=g.includes('rag')||g.includes('bare')?sk:g.includes('armor')?STEEL2:c2,bc=g.includes('rag')?sk:g.includes('armor')?STEEL:'#3b2f4a';
  for(const i of[0,1]){const s=i?-sw:sw,lx=(i?2:-7)+s*2.2,ly=Math.max(0,s)*3;aRR(lx,-12-ly,6.6,9,2.6,pc);aRR(lx-.6,-5-ly,8,5,2.2,bc)}}
 if(g.includes('coat')){aPoly([-10.5,-15,-3,-15,-5,-3,-13+sway*.4,-2],col);aPoly([3,-15,10.5,-15,13,-3,6,-4],col)}
 if(robe){aPoly([-10.5,-15,10.5,-15,13+sw*.8,-1,-13+sw*.8,-1],col);aPoly([-12.4,-5,12.4,-5,13+sw*.8,-1,-13+sw*.8,-1],c2,1);aLine(-12.4,-5,12.4,-5,INK,1.2);aRR(-1.6,-15,3.2,10,1,c2,1)}
 if(g.includes('dress')){aPoly([-10,-16,10,-16,15+sw,-7,-15+sw,-7],col);aPoly([-13.6,-9.5,13.6,-9.5,15+sw,-7,-15+sw,-7],c2,1)}
 // torso
 const tc=bare?sk:g.includes('armor')?STEEL:g.includes('tech')?'#6b7388':g.includes('ninja')?shade(col,-.5):col;
 aRR(-10,-26,20,14.5,6,tc);aRR(-8.8,-17.2,17.6,4.6,3.6,shade(tc,-.16),1);aRR(-7.4,-24.4,6,3,1.5,shade(tc,.32),1);
 if(g.includes('armor')){aRR(-3.4,-25,6.8,12,1.4,col,1);aCirc(-9.6,-23.5,4.6,STEEL);aCirc(9.6,-23.5,4.6,STEEL);aRR(-10,-14.6,20,3,1.2,c2)}
 else if(g.includes('gi')){aLine(-6,-26,1,-16,INK,1.6);aLine(8,-26,1,-16,INK,1.6);aPoly([-6,-26,1,-16,8,-26],sk,1);aRR(-10,-15.4,20,3.6,1.2,'#2b2140');aPoly([-4,-13,-7,-6+sway*.3,-3,-7],'#2b2140')}
 else if(g.includes('coat')){aLine(1,-26,1,-12,INK,1.4);aCirc(4,-21,1.1,GOLD,1);aCirc(4,-16.5,1.1,GOLD,1);aPoly([-6,-26,1,-20,8,-26],c2,1)}
 else if(g.includes('ninja')){aPoly([-10,-22,10,-16,10,-12.5,-10,-18.5],col,1);aRR(-10,-15,20,3,1.2,'#1b1030',1)}
 else if(g.includes('tech')){aRR(-10,-26,20,5,3,STEEL2,1);glowAt(col,1,-19,9,.5+.25*Math.sin(tm*6));aCirc(1,-19,3.2,col);aCirc(-9.6,-23.5,4.2,STEEL2);aCirc(9.6,-23.5,4.2,STEEL2)}
 else if(g.includes('vest')){aPoly([-10,-26,-4,-26,-5,-12,-10,-12],col);aPoly([6,-26,10,-26,10,-12,7,-12],col);aRR(-10,-14.6,20,3.2,1.2,c2)}
 else if(g.includes('rag'))aPoly([-10,-16,10,-16,9,-8,5,-11,1,-7,-4,-11,-9,-8],'#7a5a3a');
 else if(g.includes('bare')){aLine(-4,-21,6,-21,shade(sk,-.3),1.4);aLine(1,-20,1,-14,shade(sk,-.3),1.2);aRR(-10,-14.6,20,3.6,1.2,'#3a2f55')}
 else if(g.includes('dress')){aPoly([-3,-24,1,-21,5,-24,1,-18],c2,1)}
 else if(!robe)aRR(-10,-14.8,20,3,1.2,c2,1);
 if(L.off=='shield')shield(-9.5,-17,c);
 if(acc=='scarf'){aRR(-9,-28.5,19,5.4,2.6,L.bc||'#e94a4a');aPoly([-7,-27,-19+sway,-24+sway*.4,-18+sway,-19,-7,-23.5],L.bc||'#e94a4a')}
 // head
 const hx0=1,hy0=-34,R=12;
 if(hood){aCirc(hx0,hy0,13.8,col);aPoly([-9,-44,-16+sway*.3,-51,-3,-47],col);aEll(hx0+2.5,hy0+1.5,8.8,8.6,face=='glow'?'#1a1030':sk)}else aCirc(hx0,hy0,R,sk);
 const lx=Math.cos(la)*1.3,ly=Math.sin(la)*1,ex=[-1.6+lx+(hood?1.5:0),6.6+lx+(hood?1.2:0)],ey=hy0+1.2+ly;
 if(face=='glow'){for(const x of ex){glowAt(col,x,ey,7,.9);aCirc(x,ey,1.9,'#fff',1)}}
 else if(face=='skull'){for(const x of ex)aEll(x,ey,2.8,3.4,INK,1);aPoly([2.6+lx,ey+4,1.4+lx,ey+6.4,3.8+lx,ey+6.4],INK,1);aLine(-2+lx,ey+8.6,8+lx,ey+8.6,INK,1.3);for(let i=0;i<4;i++)aLine(-.6+lx+i*2.6,ey+7.2,-.6+lx+i*2.6,ey+10,INK,1)}
 else if(acc=='tmask'){aEll(hx0+2,hy0+1,9.4,10.6,'#c9a26a');aRR(-2.6+lx,ey-1.4,4.4,2.6,1,INK,1);aRR(5.2+lx,ey-1.4,4.4,2.6,1,INK,1);aLine(-4,hy0-5,8,hy0-5,col,2);aLine(-1,hy0+7,7,hy0+7,col,2);aLine(3,hy0+3,3,hy0+9,'#e94a4a',1.6)}
 else if(acc!='blind'){
  ctx.lineWidth=1.5;for(const x of ex){aEll(x,ey,2.7,face=='rage'?2.6:3.7,'#fff');aCirc(x+lx*.5,ey+.4+ly*.5,face=='rage'?1.2:2.1,face=='rage'?INK:shade(col,-.25),1);if(face!='rage'){aCirc(x+lx*.6,ey+.6+ly*.6,1,INK,1);aCirc(x-.8,ey-1.4,.9,'#fff',1)}}ctx.lineWidth=2.4;
  if(face=='rage'||u>=0){aLine(ex[0]-3,ey-5.4,ex[0]+2,ey-3.8,INK,1.8);aLine(ex[1]+3,ey-5.4,ex[1]-2,ey-3.8,INK,1.8)}
  if(!HIT){ctx.globalAlpha*=.4;aEll(ex[0]-2,ey+5,2.4,1.5,'#ff6e96',1);aEll(ex[1]+2.4,ey+5,2.4,1.5,'#ff6e96',1);ctx.globalAlpha/=.4}
  if(face=='rage'){aRR(-.4+lx,ey+5.6,7.4,3,1,'#fff');aLine(3.3+lx,ey+5.6,3.3+lx,ey+8.6,INK,1)}
  else if(acc!='mask'){ctx.lineWidth=1.4;ctx.strokeStyle='#7a3b3b';ctx.beginPath();if(u>=0||HIT)ctx.ellipse(3+lx,ey+6.6,1.7,2.2,0,0,7);else ctx.arc(3+lx,ey+5.2,2.4,.2,Math.PI-.2);ctx.stroke();ctx.lineWidth=2.4;ctx.strokeStyle=INK}}
 if(acc=='tusk'){aPoly([-2+lx,ey+8,-1+lx,ey+3,1+lx,ey+8],'#fff');aPoly([6+lx,ey+8,7+lx,ey+3,9+lx,ey+8],'#fff')}
 // hair, then headgear
 if(!hood&&hs!='bald'){
  if(hs=='spiky')for(let i=0;i<5;i++){const x=-8+i*4.6;aPoly([x-3.4,-43,x-3.5,-53-(i%2)*4,x+3.6,-44],hair)}
  if(hs=='mohawk')aPoly([-6,-45,-5,-56,0,-49,3,-58,7,-49,11,-55,10,-44],hair);
  else if(hs=='flame'){const f=Math.sin(tm*14)*3;aPoly([-11,-41,-7,-56+f,-2,-46,2,-61-f,6,-46,10,-54+f,13,-41],'#ffb02e');aPoly([-6,-42,-3,-50,1,-44,3,-53-f,7,-42],'#ffe14d',1)}
  else{ctx.beginPath();ctx.arc(hx0,hy0-1,R+.8,Math.PI*1.03,Math.PI*1.97);if(hs=='short'||hs=='bob'||hs=='wild'){ctx.lineTo(13,-36);ctx.lineTo(6,-39);ctx.lineTo(-3,-38);ctx.lineTo(-11.6,-36)}else{ctx.lineTo(13,-34);ctx.lineTo(9.5,-38);ctx.lineTo(7,-33.5);ctx.lineTo(3.5,-38.5);ctx.lineTo(0,-34);ctx.lineTo(-4,-38.5);ctx.lineTo(-7.5,-34.5);ctx.lineTo(-11.6,-36.5)}ctx.closePath();aFS(hair);
   ctx.beginPath();ctx.arc(hx0-2,hy0-3,7,Math.PI*1.15,Math.PI*1.6);ctx.lineWidth=1.6;ctx.strokeStyle=HIT?'#fff':shade(hair,.4);ctx.stroke();ctx.lineWidth=2.4;ctx.strokeStyle=INK}}
 if(acc=='hat'){aEll(1,-43,18.5,4.8,'#f4c542');ctx.beginPath();ctx.arc(1,-43,10.6,Math.PI,0);ctx.closePath();aFS('#f4c542');aRR(-9.4,-47,20.8,3,1,'#d33',1)}
 else if(acc=='band'){aRR(-11.4,-42.5,24.8,4.2,1.6,L.bc||'#e94a4a');aPoly([-11,-41,-20+sway,-38,-19+sway,-33.5,-11,-38.5],L.bc||'#e94a4a')}
 else if(acc=='horn'){aPoly([-8,-43,-13,-56,-2.5,-46],'#f6f1e4');aPoly([9,-44,15,-56,4,-46],'#f6f1e4')}
 else if(acc=='bow'){aPoly([-7,-45,-15,-51,-14,-40],'#ff6fa8');aPoly([-7,-45,1,-52,1,-41],'#ff6fa8');aCirc(-7,-45,2.2,'#ff9cc4')}
 else if(acc=='mask')aRR(-4+lx,ey+2,17,8.6,3.4,'#2b2140');
 else if(acc=='halo'){ctx.beginPath();ctx.ellipse(1,-52,10.5,3.4,0,0,7);ctx.lineWidth=5.6;ctx.stroke();ctx.lineWidth=3;ctx.strokeStyle='#ffe14d';ctx.stroke();ctx.lineWidth=2.4;ctx.strokeStyle=INK}
 else if(acc=='crown'){aPoly([-8,-45,-8,-54,-3.5,-49,1,-57,5.5,-49,10,-54,10,-45],'#ffd84d');aCirc(1,-48,1.6,'#ff5a7a',1)}
 else if(acc=='ears'){aPoly([-10,-42,-10,-57,-1,-46],hair);aPoly([11,-42,12,-57,3,-46],hair);aPoly([-8.4,-45,-8.4,-52.5,-3.6,-46.6],'#ffb3c8',1);aPoly([9.6,-45,10.4,-52.5,5.4,-46.6],'#ffb3c8',1)}
 else if(acc=='star')aStar(-8,-45,5.6,5,'#fff3a0',-.3);
 else if(acc=='goggles'){aRR(-11.6,-42,25.2,3.2,1,'#3b2f4a');aCirc(-2.4,-40.5,3.8,'#9be7ff');aCirc(7,-40.5,3.8,'#9be7ff');aCirc(-3.4,-41.5,1,'#fff',1);aCirc(6,-41.5,1,'#fff',1)}
 else if(acc=='wizhat'){aPoly([-9,-44,-3+sway*.5,-67,-1+sway*.5,-60,11,-44],c2);aEll(1,-43.4,17,4.4,c2);aRR(-8.4,-47.4,18.8,3,1,GOLD,1)}
 else if(acc=='helm'){ctx.beginPath();ctx.arc(hx0,hy0-1,R+1.4,Math.PI,0);ctx.closePath();aFS(STEEL);aRR(3,-37,3,9,1,STEEL);aPoly([-2,-47,-9+sway*.5,-56,3,-50],col)}
 else if(acc=='blind'){aRR(-10.6,-37.5,24,6.2,2,'#1b1030');aPoly([-10,-36,-19+sway,-34,-18+sway,-30,-10,-33],'#1b1030')}
 else if(acc=='gob'){aPoly([-10,-35,-25,-42,-11,-28],sk);aPoly([12,-35,24,-43,13,-28],sk)}
 if(!wBack)drawW()}

// ---------- monsters and bosses with their own bodies
const MON={
slime(e,c,L,o){const s=1+Math.sin(tm*6+e.x*.1)*.1+(o.atk>=0?Math.sin(o.atk*Math.PI)*.25:0),w=17/s,h=25*s,col=c.col;ctx.lineJoin='round';ctx.lineWidth=2.4;ctx.strokeStyle=INK;
 ctx.beginPath();ctx.moveTo(-w,0);ctx.bezierCurveTo(-w-2,-h*.9,-w*.5,-h,0,-h);ctx.bezierCurveTo(w*.5,-h,w+2,-h*.9,w,0);ctx.quadraticCurveTo(0,4,-w,0);aFS(col);
 ctx.beginPath();ctx.moveTo(-w+2.5,-2);ctx.quadraticCurveTo(0,2,w-2.5,-2);ctx.quadraticCurveTo(0,-7,-w+2.5,-2);aF(shade(col,-.22));aEll(-w*.4,-h*.72,w*.3,h*.13,'#ffffffaa',1,-.5);
 for(const x of[1,9]){aEll(x,-h*.45,2.6,3.8,INK,1);aCirc(x+.8,-h*.45-1.4,1,'#fff',1)}ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(5,-h*.3,3,.2,Math.PI-.2);ctx.stroke();ctx.lineWidth=2.4;aCirc(-w-2,-3,2.4,col);aCirc(w+3,-2,1.8,col)},
bat(e,c,L,o){const f=Math.sin(tm*20+e.x)*.7,by=-22+Math.sin(tm*5)*2,col=c.col,d=shade(col,-.4);ctx.lineJoin='round';ctx.lineWidth=2.2;ctx.strokeStyle=INK;
 for(const s of[-1,1]){ctx.save();ctx.translate(s*5,by);ctx.scale(s,1);ctx.rotate(-f);aPoly([0,-2,13,-12,24,-7,20,-1,23,5,15,3,12,8,6,4,0,5],d);aLine(1,0,22,-6,col,1.2);ctx.restore()}
 aPoly([-6,by-7,-8,by-17,-1,by-10],col);aPoly([6,by-7,8,by-17,1,by-10],col);aEll(0,by,8.5,9.5,col);aEll(0,by+3,5,4.4,shade(col,.25),1);
 for(const x of[-3.2,3.2]){glowAt('#ff5a5a',x,by-2,6,.8);aCirc(x,by-2,1.8,'#ffdada',1)}aPoly([-2.4,by+3,-1.2,by+7,0,by+3],'#fff',1);aPoly([0,by+3,1.2,by+7,2.4,by+3],'#fff',1)},
ghost(e,c,L,o){const col=c.col,d=shade(col,-.45),w=Math.sin(tm*5+e.x*.1)*2,la=o.la;ctx.lineJoin='round';ctx.lineWidth=2.4;ctx.strokeStyle=INK;ctx.translate(0,-6+Math.sin(tm*3)*2.5);ctx.globalAlpha*=.9;
 ctx.beginPath();ctx.moveTo(-12,-28);ctx.quadraticCurveTo(-13,-47,1,-47);ctx.quadraticCurveTo(14,-47,13,-28);ctx.lineTo(15,-6+w);ctx.lineTo(9,-11);ctx.lineTo(5,-2-w);ctx.lineTo(0,-10);ctx.lineTo(-5,-1+w);ctx.lineTo(-9,-10);ctx.lineTo(-15,-5-w);ctx.closePath();aFS(col);
 aPoly([-9,-20,9,-20,12,-8+w,6,-12,2,-5,-3,-12,-8,-6,-12,-9],d,1);aEll(2,-35,8.6,8,'#150c2a');for(const x of[-1.5+Math.cos(la),5.5+Math.cos(la)]){glowAt('#9ff5ff',x,-35,7,.9);aEll(x,-35,1.7,2.4,'#eaffff',1)}
 const hx=10+Math.cos(la)*8,hy=-24+Math.sin(la)*7-(o.atk>=0?Math.sin(o.atk*Math.PI)*4:0);aLimb(8,-25,hx,hy,2.6,d);aCirc(hx,hy,3,'#e8e2d0');glowAt(col,hx+3,hy,9,.5)},
maw(e,c,L,o){const col=c.col,d=shade(col,-.35),op=.35+.3*Math.sin(tm*4)+(o.atk>=0?Math.sin(o.atk*Math.PI)*.5:0),br=1+Math.sin(tm*3)*.03,la=o.la;ctx.lineJoin='round';ctx.lineWidth=2.4;ctx.strokeStyle=INK;ctx.scale(br,1/br);
 for(const s of[-1,1]){const wv=Math.sin(tm*6+s)*4;aLimb(s*18,-16,s*27,-8+wv,5,d);aCirc(s*27,-8+wv,3.4,col)}
 aEll(0,-22,23,22,col);aEll(0,-12,19,9,d,1);aEll(-8,-34,7,4,shade(col,.3),1,-.5);
 const my=-19,mh=5+op*9;aEll(3,my,15,mh,'#3a0a1e');aEll(3,my+mh*.45,9,mh*.4,'#ff5a7a',1);
 for(let i=0;i<6;i++){const x=-9+i*4.8;aPoly([x-2.2,my-mh+1.6,x,my-mh+7,x+2.2,my-mh+1.6],'#fff8e6');aPoly([x-2.2,my+mh-1.6,x,my+mh-6.4,x+2.2,my+mh-1.6],'#fff8e6')}
 const lx=Math.cos(la)*1.4;for(const [x,y,r] of[[-9,-36,3.4],[1,-40,4.2],[11,-36,3.2],[-3,-31,2.2],[7,-31,2.2]]){aCirc(x,y,r,'#ffe14d');aCirc(x+lx,y+.4,r*.45,INK,1)}
 aPoly([-12,-41,-17,-52,-7,-44],'#f6f1e4');aPoly([13,-41,19,-52,8,-44],'#f6f1e4')},
golem(e,c,L,o){const col=c.col,d=shade(col,-.35),l=shade(col,.3),sw=o.walk?Math.sin(o.ph*.6):0,a=o.atk>=0?Math.sin(o.atk*Math.PI):0,la=o.la;ctx.lineJoin='round';ctx.lineWidth=2.6;ctx.strokeStyle=INK;
 for(const i of[0,1]){const s=i?-sw:sw;aRR((i?3:-12)+s*2,-11-Math.max(0,s)*3,10,11,3,d)}
 aLimb(-15,-25,-21,-10-a*3,8,col);aRR(-27,-12-a*3,12,12,4,d);
 aPoly([-15,-30,-11,-36,13,-36,17,-30,14,-9,-12,-9],col);aPoly([-10,-33,12,-33,13,-28,-11,-28],l,1);aPoly([-12,-13,14,-13,14,-9,-12,-9],d,1);
 aLine(-2,-27,-6,-20,INK,1.4);aLine(-6,-20,-1,-15,INK,1.4);glowAt('#ffb02e',4,-21,11,.5+.3*Math.sin(tm*5));aPoly([1,-24,7,-24,8,-19,4,-16,0,-19],'#ffb02e');for(const [x,y] of[[-9,-31],[11,-31],[-9,-12],[11,-12]])aCirc(x,y,1.2,d,1);
 aRR(-7,-47,17,13,4,col);aRR(-5,-45,13,3.4,1.5,l,1);glowAt('#ff5a3c',2+Math.cos(la)*2,-39,11,.9);aRR(-3+Math.cos(la)*2,-41,11,3.6,1.6,'#ffe14d');
 const fx=18+Math.cos(la)*(6+a*12),fy=-22+Math.sin(la)*(6+a*10);aLimb(15,-27,fx,fy,8,col);aRR(fx-6,fy-6,13,13,4,d);aLine(fx-2,fy-3,fx+4,fy-3,INK,1.2)},
dragon(e,c,L,o){const col=c.col,d=shade(col,-.35),bel='#ffe2a8',fl=Math.sin(tm*5)*4,sw=o.walk?Math.sin(o.ph*.7):0,a=o.atk>=0?Math.sin(o.atk*Math.PI):0,la=o.la,sway=Math.sin(tm*3)*3;ctx.lineJoin=ctx.lineCap='round';ctx.lineWidth=2.4;ctx.strokeStyle=INK;
 for(const s of[-1,1])aPoly([s*4,-28,s*20,-48+fl,s*33,-38+fl,s*27,-30,s*31,-20+fl,s*21,-21,s*18,-13,s*8,-18],d);
 aLimb(-6,-8,-20,-4+sway,6,col);aLimb(-20,-4+sway,-27,-11+sway,4,col);const f=Math.sin(tm*18)*2;aPoly([-27,-9+sway,-33,-16+sway+f,-28,-15+sway,-29,-22+sway-f,-24,-13+sway],'#ffb02e');
 for(const i of[0,1]){const s=i?-sw:sw;aRR((i?2:-9)+s*2,-11-Math.max(0,s)*3,8,10,3,col);aPoly([(i?2:-9)+s*2,-2,(i?12:1)+s*2,-2,(i?13:2)+s*2,1,(i?1:-10)+s*2,1],d)}
 aEll(0,-21,12.5,13,col);aEll(2,-18,7.5,9.5,bel);for(let i=0;i<3;i++)aLine(-3,-23+i*4.4,8,-23+i*4.4,'#d9a45a',1.2);
 const hx=4+Math.cos(la)*4,hy=-37+Math.sin(la)*3;aPoly([hx-9,hy-6,hx-15,hy-19,hx-4,hy-10],'#f6f1e4');aPoly([hx+3,hy-9,hx+2,hy-22,hx+9,hy-9],'#f6f1e4');
 aEll(hx,hy,11,9.5,col);aPoly([hx+4,hy-4,hx+18,hy-2,hx+19,hy+3,hx+5,hy+5],col);aPoly([hx+6,hy+4,hx+18,hy+3,hx+16,hy+6+a*5,hx+6,hy+7+a*3],d);
 for(let i=0;i<3;i++)aPoly([hx+8+i*3.4,hy+3.6,hx+9.6+i*3.4,hy+6.6,hx+11.2+i*3.4,hy+3.6],'#fff',1);aCirc(hx+16,hy-.6,.9,INK,1);
 glowAt('#ffe14d',hx+3,hy-2,7,.8);aEll(hx+3,hy-2,2.6,3,'#ffe14d');aEll(hx+3.4,hy-2,.9,2.4,INK,1);aLine(hx-1,hy-6.4,hx+7,hy-4.6,INK,1.8);
 if(a>.2){glowAt('#ff8a3c',hx+24,hy+4,14*a,.9);aPoly([hx+18,hy+2,hx+30+f,hy+4,hx+18,hy+7],'#ffb02e',1)}
 aLimb(9,-25,14+Math.cos(la)*5,-19+Math.sin(la)*4,4,col);aCirc(14+Math.cos(la)*5,-19+Math.sin(la)*4,3,d)},
lord(e,c,L,o){const col=c.col,d=shade(col,-.55),w=Math.sin(tm*4)*2.5,la=o.la,a=o.atk>=0?Math.sin(o.atk*Math.PI):0;ctx.lineJoin=ctx.lineCap='round';ctx.lineWidth=2.4;ctx.strokeStyle=INK;ctx.translate(0,-7+Math.sin(tm*2.4)*3);
 aPoly([-13,-30,-22,-22,-25+w,-2,-15,-9,-12,2-w,-8,-12],d);aPoly([13,-30,22,-22,24-w,-3,15,-9],d);
 ctx.beginPath();ctx.moveTo(-12,-32);ctx.lineTo(13,-32);ctx.lineTo(15,-10);ctx.lineTo(9,-3+w);ctx.lineTo(5,-9);ctx.lineTo(1,1-w);ctx.lineTo(-3,-9);ctx.lineTo(-8,-2+w);ctx.lineTo(-14,-10);ctx.closePath();aFS(col);
 aPoly([-3,-32,5,-32,3,-8,1,1-w,-1,-8],d,1);for(const [x,y] of[[-8,-22],[9,-18],[-6,-12],[8,-27]]){const t=.5+.5*Math.sin(tm*5+x);ctx.globalAlpha*=t;aStar(x,y,2.2,4,'#fff',0,1);ctx.globalAlpha/=t||1}
 aEll(-13,-31,6.5,5,'#ffd84d');aEll(14,-31,6.5,5,'#ffd84d');aCirc(1,-41,10.5,d);aEll(2.5,-40,7.4,7.2,'#0c0620');
 for(const x of[-.5+Math.cos(la)*1.2,6+Math.cos(la)*1.2]){glowAt('#fff',x,-40,8,.9);aEll(x,-40,1.5,2.6,'#fff',1)}
 aPoly([-9,-48,-10,-60,-4.5,-52,1,-63,6.5,-52,12,-60,11,-48],'#ffd84d');aCirc(1,-52,1.8,col,1);
 const ox=17+Math.cos(la)*(8+a*8),oy=-22+Math.sin(la)*(8+a*6);aLimb(12,-27,ox-5,oy+2,3.4,d);glowAt(col,ox,oy,20+a*10,.8);aCirc(ox,oy,7,'#0c0620');ctx.beginPath();ctx.ellipse(ox,oy,10.5,3.6,tm*3,0,7);ctx.lineWidth=1.6;ctx.strokeStyle='#e9d5ff';ctx.stroke();ctx.lineWidth=2.4;ctx.strokeStyle=INK;aCirc(ox-2,oy-2,1.6,'#e9d5ff',1)}};

// ---------- one fighter: shadow, ring, body, status marks, bars
function drawFig(e,c,sc,sq,bob,walk,hit,ph){const L=c.lk||LK0,fx=Math.cos(e.a)>=0?1:-1,at=e.at!=null?(tm-e.at)/.24:9;
 ctx.save();ctx.translate(e.x,e.y+20);ctx.scale(fx*sc/sq,sc*sq);ctx.translate(0,bob);HIT=hit?1:0;
 try{(MON[L.sh]||human)(e,c,L,{walk,ph,la:fx>0?e.a:Math.PI-e.a,atk:at>=0&&at<1?at:-1})}finally{HIT=0;ctx.restore()}}
const PT={};
// static portrait (data URL) for the menus; works for heroes, monsters and bosses
function portrait(ch,px){const k=ch+'|'+px;if(PT[k])return PT[k];const c=document.createElement('canvas');c.width=c.height=px;const x=c.getContext('2d'),o=ctx,s=px/88,L=CH[ch].lk||LK0;x.scale(s,s);ctx=x;
 try{drawFig({x:L.sh?40:30,y:58,a:-.32,awt:0},CH[ch],1.15*(L.ps||1),1,0,false,false,0)}finally{ctx=o}return PT[k]=c.toDataURL()}
const figScale=(e,c)=>(c.lk&&c.lk.sc)||(e.boss?1.7:1);
function hiddenE(e){if(raid||!e||e===me||e.dum||e.raidE)return false;if(tmode&&e.tm===me.tm)return false;return BUSH.some(b=>Math.hypot(e.x-b[0],e.y-b[1])<b[2])&&Math.hypot(e.x-me.x,e.y-me.y)>150&&tm>(e.rv||0)&&tm>(e.hft||0)+1}
function drawChar(e,id){if(e.dum)return drawDummy(e);const c=CH[e.ch],bs=figScale(e,c),cd=c.col,fly=c.lk&&/bat|ghost|lord/.test(c.lk.sh||'');
 const mv=Math.hypot(e.x-(e.px==null?e.x:e.px),e.y-(e.py==null?e.y:e.py));e.px=e.x;e.py=e.y;e.mvs=(e.mvs||0)*.85+mv*.15;const walk=e.mvs>.35;
 const hv=e.hp+(e.sd||0);if(e.lhp!=null&&hv<e.lhp-.4)e.hft=tm+.12;e.lhp=hv;const hit=e.hft&&tm<e.hft,ph=tm*15+e.x*.1,sq=walk?1+Math.sin(ph)*.06:1+Math.sin(tm*3)*.025,bob=walk?-Math.abs(Math.sin(ph))*3:0;
 const mine=id=='me',tc=tmode?(e.tm===me.tm?'#4da3ff':'#ff5a5a'):mine?'#ffffff':e.raidE?'#ff6b6b':cd,fy=e.y+20;
 ctx.fillStyle='rgba(10,5,30,.32)';ctx.beginPath();ctx.ellipse(e.x,fy,(fly?11:15)*bs,(fly?4:5.6)*bs,0,0,7);ctx.fill();
 if(mine||tmode||e.boss){ctx.strokeStyle=INK;ctx.lineWidth=tmode?7:5;ctx.beginPath();ctx.ellipse(e.x,fy,20*bs,8*bs,0,0,7);ctx.stroke();ctx.strokeStyle=tc;ctx.lineWidth=tmode?3.6:2.4;ctx.stroke()}
 if(c.rar==4){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.34+.12*Math.sin(tm*4);ctx.drawImage(glow(cd),e.x-34,fy-18,68,30);ctx.globalAlpha=.9;for(let i=0;i<3;i++){const q=tm*2.2+i*2.09;ctx.drawImage(glow('#ffffff'),e.x+Math.cos(q)*23-4,fy-22+Math.sin(q)*8-Math.sin(q*2)*14-4,8,8)}ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}
 if(mine&&me.aw>=100&&!(me.awt>0)){ctx.globalAlpha=.5+.4*Math.sin(tm*8);ctx.strokeStyle='#ffd84d';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(e.x,fy,28,11,0,0,7);ctx.stroke();ctx.globalAlpha=1}
 if(e.awt>0){const r=48+Math.sin(tm*12)*4;ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.6;ctx.drawImage(glow(cd),e.x-r,e.y-r,r*2,r*2);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}
 if(e.van>0){ctx.globalAlpha=.25;drawFig(e,c,bs,sq,bob,walk,0,ph);ctx.globalAlpha=1;return}
 drawFig(e,c,bs,sq,bob,walk,hit,ph);
 if(e.sbt&&tm<e.sbt){const u=(e.sbt-tm)/.25;ctx.globalCompositeOperation='lighter';ctx.globalAlpha=u*.9;ctx.strokeStyle='#a9dcff';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(e.x,e.y-4,24*bs,30*bs,0,0,7);ctx.stroke();ctx.globalAlpha=u*.25;ctx.fillStyle='#a9dcff';ctx.fill();ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}
 if(e.sh>0){ctx.strokeStyle='#fff';ctx.fillStyle='#ffffff26';ctx.lineWidth=2.6;ctx.beginPath();for(let i=0;i<7;i++){const q=tm*2+i*.8976;ctx.lineTo(e.x+Math.cos(q)*28*bs,e.y-4+Math.sin(q)*31*bs)}ctx.closePath();ctx.fill();ctx.stroke()}
 if(e.sl>0){ctx.strokeStyle='#9fe6ff';ctx.lineWidth=2;ctx.setLineDash([4,4]);ctx.beginPath();ctx.ellipse(e.x,fy,22*bs,9*bs,0,0,7);ctx.stroke();ctx.setLineDash([])}
 if(e.brn>0&&Q.fx){const f=Math.sin(tm*20+e.x);ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.8;ctx.drawImage(glow('#ff8a3c'),e.x-12+f*3,e.y-34*bs,24,30);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}
 if(e.hst>0){ctx.strokeStyle=cd;ctx.globalAlpha=.7;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(e.x,fy,26+Math.sin(tm*14)*3,10,0,0,7);ctx.stroke();ctx.globalAlpha=1}
 const big=bs>1.5,bw=big?92:bs>1.1?64:54,bh=big?13:11,bx=e.x-bw/2,by=fy-(c.lk&&c.lk.h||52)*bs-(e.sm?21:14)-(fly?8:0),ally=!tmode||e.tm===me.tm,fc=(e.raidE||!ally)?'#ef4444':'#4ade80';
 ctx.fillStyle=INK;ctx.beginPath();ctx.roundRect(bx-2,by-2,bw+4,bh+(e.sm?11:4),7);ctx.fill();ctx.fillStyle='#3a2f55';ctx.beginPath();ctx.roundRect(bx,by,bw,bh,bh/2);ctx.fill();
 const fw=Math.max(0,bw*e.hp/e.mx);if(fw>1){ctx.fillStyle=fc;ctx.beginPath();ctx.roundRect(bx,by,fw,bh,bh/2);ctx.fill();ctx.fillStyle='rgba(255,255,255,.28)';ctx.fillRect(bx+3,by+1.5,Math.max(0,fw-6),3)}
 if(e.sm){ctx.fillStyle='#2a2444';ctx.fillRect(bx,by+bh+2,bw,5);const sw=bw*Math.max(0,e.sd)/e.sm;if(sw>.5){ctx.fillStyle=e.sdt>0?'#86a8cc':'#bfe6ff';ctx.fillRect(bx,by+bh+2,sw,5)}}
 ctx.textAlign='center';ctx.font='900 9px system-ui';ctx.lineWidth=2.5;ctx.strokeStyle=INK;const ht=Math.max(0,Math.round(e.hp))+'';ctx.strokeText(ht,e.x,by+bh-2.5);ctx.fillStyle='#fff';ctx.fillText(ht,e.x,by+bh-2.5);
 ctx.font='900 12px system-ui';ctx.lineWidth=3.5;const nt=(e.awt>0?'★ ':'')+e.nm;ctx.strokeText(nt,e.x,by-6);ctx.fillStyle=tmode?(ally?'#9ccbff':'#ff9a9a'):CH[e.ch].elite||e.boss?'#ffd84d':'#fff';ctx.fillText(nt,e.x,by-6);
 if(e.cg&&mine){const s=CH[e.ch].s;for(const k in e.cg){const n=s[k].chg;for(let i=0;i<n;i++){ctx.fillStyle=i<e.cg[k]?'#7fe4ff':'#2a2444';ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.beginPath();ctx.arc(e.x-(n-1)*5+i*10,fy+13,3.4,0,7);ctx.fill();ctx.stroke()}}}
 if(e.stn>0){ctx.fillStyle='#ffe14d';ctx.font='14px system-ui';for(let i=0;i<3;i++){const q=tm*6+i*2.1;ctx.fillText('★',e.x+Math.cos(q)*14,by-18+Math.sin(q)*4)}}}

// ---------- terrain. Each map names a theme; the ground is painted once into an offscreen canvas
const TH={
sand:{obs:'boulder',bush:['#8ae885','#2d9a3e','#14391c'],mote:['#ffffff',.22,6,-4],tint:null},
stone:{obs:'pillar',bush:['#b4cc72','#5a7a3a','#28381c'],mote:['#fff3d6',.2,5,-3],tint:null},
grass:{obs:'boulder',moss:1,bush:['#9df07a','#2f9a3e','#14391c'],flower:1,mote:['#e8ff8a',.6,7,-6],tint:'rgba(40,120,60,.05)'},
lava:{obs:'magma',bush:['#a8584a','#5a2a24','#2a100c'],ember:1,mote:['#ff9a3c',.8,4,-34],tint:'rgba(255,80,20,.07)'},
ice:{obs:'crystal',bush:['#f6fcff','#a9d4ee','#3d6a8a'],mote:['#ffffff',.75,-14,30],tint:'rgba(170,215,255,.07)'},
night:{obs:'pillar',rune:1,bush:['#6fe0cf','#1f6a7a','#0c2a3a'],glowb:1,mote:['#8ff5ff',.8,6,-5],tint:'rgba(20,30,95,.16)'}};
const rng=s=>()=>(s=(s*16807+11)%2147483647)/2147483647;
function paintGround(M){const T=TH[M.th]||TH.sand,rnd=rng(MAP*7919+31),[c0,c1]=M.sand,th=M.th||'sand',R=(a,b)=>a+rnd()*(b-a);
 ctx.fillStyle='rgba(8,4,26,.28)';ctx.beginPath();ctx.roundRect(-10,6,W+20,H+22,58);ctx.fill();
 ctx.fillStyle=shade(M.rim,-.42);ctx.beginPath();ctx.roundRect(-13,-4,W+26,H+30,56);ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.stroke();
 ctx.fillStyle=M.rim;ctx.beginPath();ctx.roundRect(-13,-13,W+26,H+26,56);ctx.fill();ctx.stroke();ctx.strokeStyle=shade(M.rim,.35);ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(-10,-10,W+20,H+18,53);ctx.stroke();
 ctx.save();ctx.beginPath();ctx.roundRect(0,0,W,H,44);ctx.clip();
 let g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,c0);g.addColorStop(1,c1);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 if(th=='stone'||th=='night'||th=='lava'){const ts=th=='lava'?74:62;for(let y=0,r=0;y<H;y+=ts,r++)for(let x=-(r&1)*ts/2;x<W;x+=ts){const j=rnd();ctx.fillStyle=j>.5?'rgba(255,255,255,'+(j-.5)*.16+')':'rgba(0,0,0,'+(.5-j)*.18+')';ctx.beginPath();ctx.roundRect(x+1.5,y+1.5,ts-3,ts-3,7);ctx.fill()}
  ctx.strokeStyle=th=='lava'?'rgba(0,0,0,.4)':'rgba(0,0,0,.14)';ctx.lineWidth=2;for(let y=0,r=0;y<H;y+=ts,r++){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();for(let x=-(r&1)*ts/2;x<W;x+=ts){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+ts);ctx.stroke()}}}
 else{const dk=th=='ice'?'rgba(90,150,210,.1)':th=='grass'?'rgba(20,90,30,.1)':'rgba(130,90,30,.07)';for(let i=0;i<W*H/11000;i++){ctx.fillStyle=rnd()>.5?'rgba(255,255,255,.1)':dk;ctx.beginPath();ctx.ellipse(R(0,W),R(0,H),R(28,70),R(20,46),R(0,3),0,7);ctx.fill()}}
 const crack=(n,col,w,len,col2,w2)=>{ctx.lineJoin='round';for(let i=0;i<n;i++){let x=R(20,W-20),y=R(20,H-20),a=R(0,6.3);ctx.beginPath();ctx.moveTo(x,y);for(let k=0;k<4;k++){a+=R(-.9,.9);x+=Math.cos(a)*R(len*.5,len);y+=Math.sin(a)*R(len*.5,len);ctx.lineTo(x,y)}ctx.strokeStyle=col;ctx.lineWidth=w;ctx.stroke();if(col2){ctx.strokeStyle=col2;ctx.lineWidth=w2;ctx.stroke()}}};
 const N=W*H/54e4;
 if(th=='sand'){ctx.lineWidth=2;for(let i=0;i<70*N;i++){ctx.strokeStyle=rnd()>.5?'rgba(255,255,255,.3)':'rgba(140,100,40,.16)';const x=R(0,W),y=R(0,H),r=R(14,40),a=R(3.6,5);ctx.beginPath();ctx.arc(x,y+r,r,a,a+R(.7,1.3));ctx.stroke()}
  for(let i=0;i<26*N;i++){const x=R(20,W-20),y=R(20,H-20),r=R(2.5,5.5);ctx.fillStyle='rgba(0,0,0,.12)';ctx.beginPath();ctx.ellipse(x+1,y+2,r,r*.6,0,0,7);ctx.fill();ctx.fillStyle=rnd()>.5?'#c9c2b6':'#a89f93';ctx.strokeStyle='rgba(27,16,48,.5)';ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(x,y,r,r*.7,R(0,3),0,7);ctx.fill();ctx.stroke()}
  for(let i=0;i<5*N;i++){const x=R(40,W-40),y=R(40,H-40);ctx.save();ctx.translate(x,y);ctx.strokeStyle='rgba(27,16,48,.6)';ctx.lineWidth=1.4;aStar(0,0,7,5,rnd()>.5?'#ff9a6a':'#ffb3c8',R(0,6));ctx.restore()}
  for(let i=0;i<9*N;i++){const x=R(30,W-30),y=R(30,H-30);ctx.strokeStyle='#4f9a4a';ctx.lineWidth=2;for(const d of[-.5,0,.5]){ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+d*6,y-6,x+d*12,y-R(8,13));ctx.stroke()}}}
 else if(th=='grass'){for(let i=0;i<8*N;i++){const x=R(30,W-80),y=R(30,H-60),w=R(40,80),h=R(30,50);ctx.fillStyle='rgba(150,160,150,.5)';ctx.strokeStyle='rgba(27,16,48,.3)';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(x,y,w,h,8);ctx.fill();ctx.stroke()}
  ctx.lineWidth=2;for(let i=0;i<120*N;i++){const x=R(10,W-10),y=R(10,H-10);ctx.strokeStyle=rnd()>.5?'#3f8a3a':'#b8e07a';for(const d of[-.5,0,.5]){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+d*7,y-R(5,9));ctx.stroke()}}
  for(let i=0;i<34*N;i++){const x=R(14,W-14),y=R(14,H-14),col=['#fff','#ffe14d','#ff9cc4','#b9a3ff'][rnd()*4|0];ctx.fillStyle=col;for(let k=0;k<5;k++){ctx.beginPath();ctx.arc(x+Math.cos(k*1.257)*2.6,y+Math.sin(k*1.257)*2.6,1.9,0,7);ctx.fill()}ctx.fillStyle='#ff9a2e';ctx.beginPath();ctx.arc(x,y,1.5,0,7);ctx.fill()}}
 else if(th=='stone'){crack(14*N,'rgba(27,16,48,.3)',2,26);for(let i=0;i<16*N;i++){ctx.fillStyle='rgba(90,150,70,.3)';ctx.beginPath();ctx.ellipse(R(0,W),R(0,H),R(16,46),R(10,24),R(0,3),0,7);ctx.fill()}
  ctx.lineWidth=2;for(let i=0;i<30*N;i++){const x=R(10,W-10),y=R(10,H-10);ctx.strokeStyle='#5f8a4a';for(const d of[-.5,.5]){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+d*6,y-R(4,8));ctx.stroke()}}}
 else if(th=='lava'){crack(22*N,'rgba(255,90,20,.4)',7,34,'#ffc24d',2.2);
  for(let i=0;i<30*N;i++){ctx.fillStyle='rgba(255,140,40,'+R(.2,.6)+')';ctx.beginPath();ctx.arc(R(0,W),R(0,H),R(1.5,3.5),0,7);ctx.fill()}}
 else if(th=='ice'){ctx.lineWidth=14;for(let i=0;i<9*N;i++){ctx.strokeStyle='rgba(255,255,255,.2)';const x=R(-50,W),y=R(0,H),l=R(120,300);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+l,y-l*.45);ctx.stroke()}
  crack(16*N,'rgba(90,150,200,.45)',1.6,40);for(let i=0;i<12*N;i++){ctx.fillStyle='rgba(255,255,255,.8)';ctx.beginPath();ctx.ellipse(R(0,W),R(0,H),R(20,60),R(10,26),R(0,3),0,7);ctx.fill()}
  for(let i=0;i<30*N;i++)aStar(R(0,W),R(0,H),R(2,4.5),4,'#ffffff',0,1)}
 else if(th=='night'){crack(10*N,'rgba(0,0,0,.3)',2,26);for(let i=0;i<6*N;i++){const x=R(60,W-60),y=R(60,H-60),r=R(70,140);g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba(190,215,255,.2)');g.addColorStop(1,'rgba(190,215,255,0)');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2)}
  for(let i=0;i<16*N;i++){const x=R(20,W-20),y=R(20,H-20);g=ctx.createRadialGradient(x,y,0,x,y,12);g.addColorStop(0,'rgba(120,255,240,.55)');g.addColorStop(1,'rgba(120,255,240,0)');ctx.fillStyle=g;ctx.fillRect(x-12,y-12,24,24);ctx.fillStyle='#5fe0d0';ctx.strokeStyle='rgba(27,16,48,.7)';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(x,y,3.4,Math.PI,0);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#e8fff8';ctx.fillRect(x-.8,y,1.6,3)}}
 SP.forEach((p,i)=>{const tc=tmode?((i%2)===me.tm?'#4da3ff':'#ff5a5a'):'#ffffff';g=ctx.createRadialGradient(p[0],p[1],4,p[0],p[1],58);g.addColorStop(0,tc+'55');g.addColorStop(1,tc+'00');ctx.fillStyle=g;ctx.fillRect(p[0]-58,p[1]-58,116,116);
  ctx.globalAlpha=.55;ctx.strokeStyle=tc;ctx.lineWidth=3;ctx.setLineDash([9,7]);ctx.beginPath();ctx.arc(p[0],p[1],40,0,7);ctx.stroke();ctx.setLineDash([]);ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(p[0],p[1],30,0,7);ctx.stroke();ctx.globalAlpha=1});
 g=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*.25,W/2,H/2,Math.max(W,H)*.7);g.addColorStop(0,'rgba(255,255,255,.1)');g.addColorStop(1,'rgba(20,10,40,.24)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 ctx.strokeStyle='rgba(10,5,30,.2)';ctx.lineWidth=22;ctx.beginPath();ctx.roundRect(0,0,W,H,44);ctx.stroke();
 ctx.restore();ctx.strokeStyle=INK;ctx.lineWidth=5;ctx.beginPath();ctx.roundRect(0,0,W,H,44);ctx.stroke()}
const GC={k:'',c:null};
function ground(M){const sc=Math.min(2,Math.max(1,Math.ceil(K*dpr*2)/2))*(W>1000?.75:1),k=MAP+'|'+(tmode?me.tm:-1)+'|'+sc;
 if(GC.k!==k){const c=GC.c||(GC.c=document.createElement('canvas'));c.width=(W+64)*sc;c.height=(H+72)*sc;const x=c.getContext('2d'),o=ctx;x.scale(sc,sc);x.translate(32,32);ctx=x;try{paintGround(M)}finally{ctx=o}GC.k=k}
 ctx.drawImage(GC.c,-32,-32,W+64,H+72)}
// soft round glow per colour, reused everywhere light is needed
const GL={};
function glow(col){let c=GL[col];if(!c){c=GL[col]=document.createElement('canvas');c.width=c.height=64;const h=col.length==4?'#'+col[1]+col[1]+col[2]+col[2]+col[3]+col[3]:col.slice(0,7),x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'#fff');g.addColorStop(.4,h);g.addColorStop(1,h+'00');x.fillStyle=g;x.fillRect(0,0,64,64)}return c}
let DSP=null;
function scorch(){if(!DSP){DSP=document.createElement('canvas');DSP.width=DSP.height=64;const x=DSP.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(20,12,10,.45)');g.addColorStop(.7,'rgba(20,12,10,.25)');g.addColorStop(1,'rgba(20,12,10,0)');x.fillStyle=g;x.fillRect(0,0,64,64)}return DSP}
// obstacles: the collision circle is the footprint, the art rises above it
function paintObs(kind,r,M,T){const [l,d]=M.rock,rnd=rng(Math.round(r*91)+MAP*13),x=0,y=0;ctx.lineJoin='round';
 ctx.fillStyle='rgba(10,5,30,.3)';ctx.beginPath();ctx.ellipse(r*.25,r*.42,r*1.2,r*.56,0,0,7);ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=3;
 if(kind=='pillar'){const ty=-r*.95;ctx.fillStyle=d;ctx.beginPath();ctx.moveTo(-r,ty);ctx.lineTo(-r,0);ctx.ellipse(0,0,r,r*.56,0,Math.PI,0,true);ctx.lineTo(r,ty);ctx.closePath();ctx.fill();ctx.stroke();
  let g=ctx.createLinearGradient(-r,0,r,0);g.addColorStop(0,'rgba(255,255,255,.2)');g.addColorStop(.45,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.34)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-r,ty);ctx.lineTo(-r,0);ctx.ellipse(0,0,r,r*.56,0,Math.PI,0,true);ctx.lineTo(r,ty);ctx.closePath();ctx.fill();
  ctx.strokeStyle='rgba(27,16,48,.45)';ctx.lineWidth=2;for(const f of[.3,.62]){ctx.beginPath();ctx.ellipse(0,ty*f,r,r*.56,0,.15,Math.PI-.15);ctx.stroke()}
  if(T.rune){ctx.strokeStyle='#7ff5ff';ctx.lineWidth=2.4;ctx.globalCompositeOperation='lighter';ctx.beginPath();ctx.ellipse(0,ty*.46,r,r*.56,0,.3,Math.PI-.3);ctx.stroke();ctx.globalCompositeOperation='source-over'}
  ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.fillStyle=l;ctx.beginPath();ctx.ellipse(0,ty,r,r*.56,0,0,7);ctx.fill();ctx.stroke();ctx.fillStyle=shade(l,.4);ctx.beginPath();ctx.ellipse(-r*.25,ty-r*.1,r*.5,r*.24,-.2,0,7);ctx.fill();
  ctx.strokeStyle='rgba(27,16,48,.5)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-r*.35,ty-r*.1);ctx.lineTo(-r*.05,ty+r*.14);ctx.lineTo(r*.3,ty-r*.02);ctx.stroke();
  ctx.fillStyle='#5cc15a';ctx.strokeStyle=INK;ctx.lineWidth=1.6;ctx.beginPath();ctx.ellipse(r*.4,ty-r*.1,r*.26,r*.13,0,0,7);ctx.fill();ctx.stroke()}
 else if(kind=='crystal'){for(const [ox,h,w,t] of[[-.45,1.25,.42,-.14],[.42,1.05,.4,.16],[0,1.75,.5,0]]){const bx=ox*r,top=-h*r,hw=w*r;ctx.save();ctx.translate(bx,0);ctx.rotate(t);ctx.fillStyle='#bfe8ff';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-hw,r*.2);ctx.lineTo(-hw,top*.72);ctx.lineTo(0,top);ctx.lineTo(hw,top*.72);ctx.lineTo(hw,r*.2);ctx.closePath();ctx.fill();ctx.stroke();
   ctx.fillStyle='#f4fbff';ctx.beginPath();ctx.moveTo(-hw,r*.2);ctx.lineTo(-hw,top*.72);ctx.lineTo(0,top);ctx.lineTo(-hw*.1,r*.2);ctx.closePath();ctx.fill();ctx.fillStyle='rgba(60,120,180,.35)';ctx.beginPath();ctx.moveTo(hw,r*.2);ctx.lineTo(hw,top*.72);ctx.lineTo(0,top);ctx.lineTo(hw*.4,r*.2);ctx.closePath();ctx.fill();ctx.restore()}
  ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(0,r*.25,r*.95,r*.3,0,0,7);ctx.fill()}
 else{const n=9,pts=[];for(let i=0;i<n;i++){const a=i/n*6.283,q=.82+rnd()*.3;pts.push([Math.cos(a)*r*q,-r*.62+Math.sin(a)*r*.86*q])}
  const path=()=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath()};
  ctx.fillStyle=kind=='magma'?'#3a2622':d;path();ctx.fill();ctx.stroke();ctx.save();path();ctx.clip();ctx.fillStyle=kind=='magma'?'#5a3a32':l;ctx.beginPath();ctx.ellipse(-r*.22,-r*.95,r*.95,r*.72,-.25,0,7);ctx.fill();ctx.fillStyle='rgba(255,255,255,.3)';ctx.beginPath();ctx.ellipse(-r*.35,-r*1.12,r*.42,r*.22,-.4,0,7);ctx.fill();
  if(kind=='magma'){ctx.globalCompositeOperation='lighter';for(const w of[6,2.2]){ctx.strokeStyle=w>3?'rgba(255,90,20,.5)':'#ffc24d';ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(-r*.6,-r*.9);ctx.lineTo(-r*.1,-r*.55);ctx.lineTo(-r*.3,-r*.1);ctx.moveTo(-r*.1,-r*.55);ctx.lineTo(r*.5,-r*.75);ctx.lineTo(r*.3,-r*.2);ctx.stroke()}ctx.globalCompositeOperation='source-over'}
  else{ctx.strokeStyle='rgba(27,16,48,.4)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-r*.5,-r*.5);ctx.lineTo(-r*.1,-r*.35);ctx.lineTo(r*.2,-r*.6);ctx.stroke()}
  if(T.moss){ctx.fillStyle='#5cc15a';ctx.beginPath();ctx.ellipse(0,-r*1.3,r*.9,r*.42,0,0,7);ctx.fill();ctx.fillStyle='#8ae885';ctx.beginPath();ctx.ellipse(-r*.2,-r*1.38,r*.5,r*.2,0,0,7);ctx.fill()}
  ctx.restore();ctx.strokeStyle=INK;ctx.lineWidth=3;path();ctx.stroke()}}
const RC={};
function drawRock(p){const M=MAPS[MAP],T=TH[M.th]||TH.sand,k=MAP+'|'+p[2];let s=RC[k];if(!s){const r=p[2],w=Math.ceil(r*3.6+12),h=Math.ceil(r*4+12),c=document.createElement('canvas');c.width=w*2;c.height=h*2;const x=c.getContext('2d'),o=ctx;x.scale(2,2);x.translate(w/2,h*.7);ctx=x;try{paintObs(T.obs,r,M,T)}finally{ctx=o}s=RC[k]={c,w,h,ox:w/2,oy:h*.7}}
 ctx.drawImage(s.c,p[0]-s.ox,p[1]-s.oy,s.w,s.h)}
function paintBush(x,y,r,T,sd){const [l,d,o]=T.bush,rnd=rng(sd);ctx.fillStyle='rgba(10,5,30,.24)';ctx.beginPath();ctx.ellipse(x,y+r*.8,r*1.1,r*.4,0,0,7);ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=o;ctx.lineJoin='round';
 for(const [dx,dy,sc] of[[0,.3,.8],[-.7,.1,.7],[.7,.1,.7],[-.35,-.45,.75],[.4,-.45,.75],[0,-.1,.9]]){const gx=x+dx*r,gy=y+dy*r,rad=r*.6*sc+5;ctx.fillStyle=d;ctx.beginPath();ctx.arc(gx,gy,rad,0,7);ctx.fill();ctx.stroke();ctx.fillStyle=l;ctx.beginPath();ctx.arc(gx-rad*.18,gy-rad*.22,rad*.72,0,7);ctx.fill();ctx.fillStyle='rgba(255,255,255,.28)';ctx.beginPath();ctx.arc(gx-rad*.34,gy-rad*.4,rad*.26,0,7);ctx.fill()}
 for(let i=0;i<5;i++){const a=rnd()*6.283,q=rnd()*r*.8,px=x+Math.cos(a)*q,py=y-r*.1+Math.sin(a)*q*.7;if(T.flower){ctx.fillStyle=['#fff','#ff9cc4','#ffe14d'][i%3];ctx.beginPath();ctx.arc(px,py,2.6,0,7);ctx.fill()}else if(T.ember){ctx.fillStyle='#ffb02e';ctx.beginPath();ctx.arc(px,py,2,0,7);ctx.fill()}else if(T.glowb){const g=ctx.createRadialGradient(px,py,0,px,py,7);g.addColorStop(0,'rgba(190,255,250,.9)');g.addColorStop(1,'rgba(120,255,240,0)');ctx.fillStyle=g;ctx.fillRect(px-7,py-7,14,14)}}}
const BC={};
function drawBush(b,i){const k=MAP+'|'+i;let p=BC[k];if(!p){const r=b[2],w=Math.ceil(r*2.9+16),h=Math.ceil(r*2.5+16),c=document.createElement('canvas');c.width=w*2;c.height=h*2;const x=c.getContext('2d'),o=ctx;x.scale(2,2);ctx=x;try{paintBush(w/2,h*.52,r,TH[MAPS[MAP].th]||TH.sand,MAP*131+i*17+5)}finally{ctx=o}p=BC[k]={c,w,h,ox:w/2,oy:h*.52}}
 ctx.drawImage(p.c,b[0]-p.ox+Math.sin(tm*2+b[0]*.05)*1.6,b[1]-p.oy,p.w,p.h)}
function drawObjs(){const L=[],vis=(x,y,r)=>x+r>cam.x-60&&x-r<cam.x+VW+60&&y+r>cam.y-110&&y-r<cam.y+VH+70;for(const p of PIL)if(vis(p[0],p[1],p[2]))L.push([p[1]+p[2]*.5,()=>drawRock(p)]);BUSH.forEach((b,i)=>{if(vis(b[0],b[1],b[2]*1.6))L.push([b[1]+b[2]*.9,()=>drawBush(b,i)])});
 for(const [id,e] of all()){if(!e.al||hiddenE(e))continue;L.push([e.y+16,()=>{const inb=BUSH.some(b=>Math.hypot(e.x-b[0],e.y-b[1])<b[2]);if(inb&&(id=='me'||(tmode&&e.tm===me.tm)))ctx.globalAlpha=.62;drawChar(e,id);ctx.globalAlpha=1}])}
 L.sort((a,b)=>a[0]-b[0]);for(const o of L)o[1]()}

// ---------- projectiles: drawn pointing along +x, sized for a radius of 7
const PSH={
orb(q){aCirc(0,0,5.4,q.col);aCirc(-1.4,-1.6,1.9,'#fff',1)},
arrow(q){aLimb(-15,0,6,0,1.6,WOOD);aPoly([5,-3.6,13,0,5,3.6],'#f4f8ff');aPoly([-15,0,-19,-3.4,-12,-1],q.col);aPoly([-15,0,-19,3.4,-12,1],q.col)},
bullet(q){aRR(-7,-2.6,13,5.2,2.6,'#ffe27a');aRR(2,-2.6,4,5.2,2,'#fff',1)},
star(q){ctx.rotate(tm*22);aStar(0,0,8,4,'#e6efff');aCirc(0,0,1.6,INK,1)},
kunai(q){aCirc(-9,0,2,'#2b2140');aRR(-8,-1.1,6,2.2,1,'#2b2140');aPoly([-3,-3.2,11,0,-3,3.2],'#eef3ff')},
wave(q){ctx.beginPath();ctx.arc(-9,0,15,-1,1);ctx.arc(-15,0,16,.78,-.78,true);ctx.closePath();ctx.fillStyle=q.col;ctx.fill();ctx.lineWidth=2;ctx.strokeStyle='#fff';ctx.beginPath();ctx.arc(-9,0,14.4,-.9,.9);ctx.stroke()},
fire(q){const f=Math.sin(tm*26+q.x)*2;aPoly([-16-f,0,-5,-5.6,4,-5,8,0,4,5,-5,5.6],'#ff7a2e');aPoly([-9-f,0,-2,-3.2,4,-2.8,5.6,0,4,2.8,-2,3.2],'#ffd84d',1);aCirc(2,0,2.2,'#fff',1)},
ice(q){aPoly([-10,0,-1,-5,12,0,-1,5],'#bfe8ff');aPoly([-10,0,-1,-5,2,0],'#f4fbff',1);aLine(-8,0,10,0,'#fff',1)},
dark(q){aCirc(0,0,6,'#1a1030');aCirc(0,0,3.2,q.col,1);ctx.lineWidth=1.6;ctx.strokeStyle=q.col;ctx.beginPath();ctx.ellipse(0,0,9,3.2,tm*8,0,7);ctx.stroke()},
fist(q){aRR(-6,-6,13,12,4.5,q.fc||'#e94a4a');aLine(1,-4,1,4,INK,1.3);aLine(4,-3,4,3,INK,1.3);aRR(-9,-4.4,4,8.8,1.5,'#fff')},
lance(q){aPoly([-16,0,-2,-3.4,16,0,-2,3.4],'#fff8d6');aLine(-12,0,13,0,GOLD,1.4)},
needle(q){aPoly([-13,0,-2,-2,12,0,-2,2],q.col);aLine(-9,0,9,0,'#fff',1)},
note(q){aEll(-2,3,4,3,q.col,0,-.4);aLine(1.6,3,1.6,-8,INK,2);aPoly([1.6,-8,8,-5,8,-1.5,1.6,-4.4],q.col)},
rock(q){ctx.rotate(tm*5);aPoly([-7,-3,-3,-7,4,-6,7,-1,5,6,-2,7,-7,3],'#9aa3b8');aPoly([-5,-3,-2,-5,3,-4,1,0,-4,1],'#c6cee0',1)},
vortex(q){}};
function drawProj(q){const sp=Math.hypot(q.vx,q.vy)||1,ux=q.vx/sp,uy=q.vy/sp,r=q.r,ps=q.ps||'orb';
 if(ps=='fist'){const o=ent(q.o);if(o&&o.al&&Math.hypot(o.x-q.x,o.y-q.y)<520){ctx.lineCap='round';ctx.lineWidth=9;ctx.strokeStyle=INK;ctx.beginPath();ctx.moveTo(o.x,o.y-2);ctx.lineTo(q.x,q.y);ctx.stroke();ctx.lineWidth=5.6;ctx.strokeStyle=SKN;ctx.stroke()}}
 ctx.globalCompositeOperation='lighter';const len=Math.min(q.pierce?150:64,r*3+sp*.05);ctx.strokeStyle=q.col;ctx.globalAlpha=.45;ctx.lineWidth=r*1.5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(q.x,q.y);ctx.lineTo(q.x-ux*len,q.y-uy*len);ctx.stroke();ctx.globalAlpha=.9;ctx.drawImage(glow(q.col),q.x-r*2.1,q.y-r*2.1,r*4.2,r*4.2);ctx.globalAlpha=1;
 if(ps=='vortex'){ctx.strokeStyle='#fff';ctx.lineWidth=3;for(let i=0;i<3;i++){ctx.globalAlpha=.9-i*.22;ctx.beginPath();ctx.arc(q.x,q.y,r*(.35+.28*i),tm*(7-i*1.5)+i*2,tm*(7-i*1.5)+i*2+3.6);ctx.stroke()}ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.fillStyle='#0c0620cc';ctx.beginPath();ctx.arc(q.x,q.y,r*.24,0,7);ctx.fill();return}
 if(ps=='wave'){ctx.save();ctx.translate(q.x,q.y);ctx.rotate(Math.atan2(uy,ux));const s=Math.max(.7,r/9);ctx.scale(s,s);PSH.wave(q);ctx.restore();ctx.globalCompositeOperation='source-over';return}
 ctx.globalCompositeOperation='source-over';ctx.save();ctx.translate(q.x,q.y);ctx.rotate(Math.atan2(uy,ux));const s=Math.max(.75,r/7);ctx.scale(s,s);ctx.lineJoin=ctx.lineCap='round';ctx.lineWidth=2.2/s+.6;ctx.strokeStyle=INK;(PSH[ps]||PSH.orb)(q);ctx.restore()}
function drawPickup(p){const bob=Math.sin(tm*6+p.x)*2.2,x=p.x,y=p.y+bob;ctx.fillStyle='rgba(10,5,30,.25)';ctx.beginPath();ctx.ellipse(p.x,p.y+9,6,2.4,0,0,7);ctx.fill();
 glowAt(p.t=='coin'?'#ffd23c':p.t=='hp'?'#ff5064':'#50b4ff',x,y,15,.6);ctx.lineJoin='round';ctx.lineWidth=2;ctx.strokeStyle=INK;
 if(p.t=='coin'){const w=Math.abs(Math.cos(tm*4+p.x))*5.4+1.2;aEll(x,y,w,6.4,'#ffd23c');aEll(x,y,w*.55,4,'#ffe98a',1);aEll(x-w*.3,y-2.6,w*.2,1.3,'#fff',1)}
 else if(p.t=='hp'){aRR(x-2.6,y-10,5.2,4.4,1,'#e9e2d0');aRR(x-3.4,y-11.4,6.8,2.4,1,WOOD);ctx.beginPath();ctx.moveTo(x-2.6,y-6);ctx.lineTo(x-7,y+3);ctx.quadraticCurveTo(x,y+9,x+7,y+3);ctx.lineTo(x+2.6,y-6);ctx.closePath();aFS('#ff4d6a');aEll(x-2.6,y+.6,1.6,2.6,'#ffb3c0',1,.5)}
 else{aPoly([x,y-9,x+6,y-1,x,y+9,x-6,y-1],'#4db8ff');aPoly([x,y-9,x+6,y-1,x,y-1],'#bfe6ff',1);aLine(x-6,y-1,x+6,y-1,INK,1)}}
function drawChest(c){const x=c.x,y=c.y;ctx.fillStyle='rgba(10,5,30,.3)';ctx.beginPath();ctx.ellipse(x,y+15,23,7,0,0,7);ctx.fill();ctx.lineJoin='round';ctx.lineWidth=2.6;ctx.strokeStyle=INK;
 if(!c.open){glowAt('#ffd84d',x,y,40,.35+.2*Math.sin(tm*5));aRR(x-19,y-4,38,19,4,'#a8641f');aRR(x-19,y+6,38,9,[0,0,4,4],'#7d4a17',1);ctx.beginPath();ctx.moveTo(x-19,y-3);ctx.quadraticCurveTo(x-19,y-18,x,y-18);ctx.quadraticCurveTo(x+19,y-18,x+19,y-3);ctx.closePath();aFS('#c47a2a');
  for(const d of[-12,12])aRR(x+d-2.4,y-17,4.8,32,1.2,'#ffd84d');aRR(x-19,y-5,38,4,1,'#ffd84d');aRR(x-4.5,y-8,9,10,2,'#ffe98a');aCirc(x,y-3.6,1.6,INK,1);aStar(x+15+Math.sin(tm*5)*2,y-20,3.4,4,'#fff',tm*3,1)}
 else{aRR(x-19,y-2,38,17,4,'#7d4a17');aRR(x-16,y-1,32,7,2,'#2b1a0c',1);ctx.save();ctx.translate(x,y-4);ctx.rotate(-.5);ctx.beginPath();ctx.moveTo(-19,0);ctx.quadraticCurveTo(-19,-15,0,-15);ctx.quadraticCurveTo(19,-15,19,0);ctx.closePath();aFS('#8a5a22');ctx.restore();for(const d of[-12,12])aRR(x+d-2.4,y-2,4.8,17,1.2,'#b8962e')}}
function drawPortal(p){const x=p.x,y=p.y;ctx.fillStyle='rgba(10,5,30,.3)';ctx.beginPath();ctx.ellipse(x,y+30,26,8,0,0,7);ctx.fill();glowAt('#b06bff',x,y,62,.6+.2*Math.sin(tm*5));
 ctx.fillStyle='#1a0c3a';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(x,y,22,31,0,0,7);ctx.fill();ctx.stroke();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';
 for(let i=0;i<4;i++){ctx.strokeStyle=i%2?'#7fe4ff':'#d8b4fe';ctx.lineWidth=3-i*.4;ctx.globalAlpha=.9-i*.15;const a=tm*(2.4+i*.6)+i*1.7;ctx.beginPath();ctx.ellipse(x,y,20-i*4.4,29-i*6.4,0,a,a+3.2);ctx.stroke()}
 ctx.globalAlpha=1;for(let i=0;i<5;i++){const a=tm*1.6+i*1.257,d=30+Math.sin(tm*3+i)*6;ctx.drawImage(glow('#d8b4fe'),x+Math.cos(a)*d-4,y+Math.sin(a)*d*1.3-4,8,8)}ctx.globalCompositeOperation='source-over';
 ctx.fillStyle='#fff';ctx.font='900 11px system-ui';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle=INK;const t=raid.mode!='stage'&&raid.room==5?'NEXT FLOOR':'NEXT ROOM';ctx.strokeText(t,x,y-42);ctx.fillText(t,x,y-42)}
const hostile=o=>raid?!!raid.fid[o]:o!='me'&&!(tmode&&ent(o)&&ent(o).tm===me.tm);

// ---------- the world pass: water, island, ground effects, sorted objects, air effects, weather
function drawWorld(){const M=MAPS[MAP],T=TH[M.th]||TH.sand,k=K*dpr;VW=cw/K;VH=chh/K;
 cam.x=VW<W+60?Math.max(-30,Math.min(W+30-VW,me.x-VW/2)):(W-VW)/2;cam.y=VH<H+60?Math.max(-30,Math.min(H+30-VH,me.y-VH/2)):(H-VH)/2;
 ctx.setTransform(k,0,0,k,(-cam.x+(Math.random()-.5)*shake*22)*k,(-cam.y+(Math.random()-.5)*shake*22)*k);
 let g=ctx.createLinearGradient(0,cam.y,0,cam.y+VH);g.addColorStop(0,M.sea[0]);g.addColorStop(1,M.sea[1]);ctx.fillStyle=g;ctx.fillRect(cam.x-40,cam.y-40,VW+80,VH+80);
 {const wn=Q.fx?9:5,ws=Q.fx?26:40,lv=M.th=='lava';ctx.strokeStyle=lv?'rgba(255,190,90,.3)':'#ffffff26';ctx.lineWidth=lv?3:2;for(let j=0;j<wn;j++){const y=cam.y+j*VH/(wn-1);ctx.beginPath();for(let x=cam.x-40;x<=cam.x+VW+40;x+=ws)ctx.lineTo(x,y+Math.sin(x/45+tm*(lv?.8:1.6)+j)*5);ctx.stroke()}
  const e0=Math.sin(tm*2)*5+6;ctx.strokeStyle=lv?'rgba(255,200,90,.5)':'rgba(255,255,255,.5)';ctx.lineWidth=5;ctx.beginPath();ctx.roundRect(-22-e0,-22-e0,W+44+2*e0,H+52+2*e0,66);ctx.stroke();ctx.fillStyle=lv?'rgba(255,150,50,.22)':'rgba(255,255,255,.2)';ctx.beginPath();ctx.roundRect(-22-e0,-22-e0,W+44+2*e0,H+52+2*e0,66);ctx.fill()}
 ground(M);
 // ---- ground layer
 ctx.lineCap='round';
 for(const q of ents){if(q.t!='z')continue;const u=Math.min(1,q.age/.4)*Math.min(1,(q.dur-q.age)*2+.2),bad=hostile(q.o)&&!q.heal;ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.55*u;ctx.drawImage(glow(q.col),q.x-q.r,q.y-q.r,q.r*2,q.r*2);ctx.globalCompositeOperation='source-over';
  ctx.globalAlpha=.85*u;ctx.strokeStyle=bad?'#ff6b6b':q.col;ctx.lineWidth=3;ctx.setLineDash([12,9]);ctx.lineDashOffset=-tm*30;ctx.beginPath();ctx.arc(q.x,q.y,q.r,0,7);ctx.stroke();ctx.setLineDash([]);ctx.strokeStyle=q.col;const sp=q.pull?-4:3;for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(q.x,q.y,q.r*(.3+.22*i),tm*sp+i*2,tm*sp+i*2+2.2);ctx.stroke()}
  if(q.heal)for(let i=0;i<4;i++){const a=tm+i*1.57,d=q.r*.55;ctx.fillStyle='#7dffb0';ctx.fillRect(q.x+Math.cos(a)*d-1.5,q.y+Math.sin(a)*d-5,3,10);ctx.fillRect(q.x+Math.cos(a)*d-5,q.y+Math.sin(a)*d-1.5,10,3)}ctx.globalAlpha=1}
 for(const q of ents){if(q.t!='a')continue;const bad=hostile(q.o);
  if(q.mine&&q.age<q.delay){const bl=.5+.5*Math.sin(tm*8);ctx.globalAlpha=.16;ctx.strokeStyle=bad?'#ff6b6b':q.col;ctx.lineWidth=2;ctx.setLineDash([6,6]);ctx.beginPath();ctx.arc(q.x,q.y,q.r*.8,0,7);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.lineJoin='round';aStar(q.x,q.y,10,6,'#3a2f55',tm);aCirc(q.x,q.y,4.4,bad?'#ff5a5a':q.col);glowAt(bad?'#ff5a5a':q.col,q.x,q.y,10,bl*.8);continue}
  if(q.age<q.delay){const u=q.age/q.delay;if(q.r<=30&&!q.dmg)continue;ctx.globalAlpha=.16+.08*Math.sin(tm*20);ctx.fillStyle=bad?'#ff5a5a':q.col;ctx.beginPath();ctx.arc(q.x,q.y,q.r,0,7);ctx.fill();ctx.globalAlpha=.5;ctx.beginPath();ctx.arc(q.x,q.y,q.r*u,0,7);ctx.fill();
   ctx.globalAlpha=.95;ctx.strokeStyle=bad?'#ffd0d0':'#fff';ctx.lineWidth=3;ctx.setLineDash([9,7]);ctx.lineDashOffset=-tm*40;ctx.beginPath();ctx.arc(q.x,q.y,q.r,0,7);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;
   if(q.fol){ctx.strokeStyle='#fff';ctx.lineWidth=2.4;for(let i=0;i<4;i++){const a=tm*4+i*1.571,d=q.r*(1.2-u*.7);ctx.beginPath();ctx.moveTo(q.x+Math.cos(a)*d,q.y+Math.sin(a)*d);ctx.lineTo(q.x+Math.cos(a)*(d+16),q.y+Math.sin(a)*(d+16));ctx.stroke()}}}}
 for(const d of decals){const f=Math.max(0,d.l/d.m);ctx.save();ctx.translate(d.x,d.y);
  if(d.g){ctx.globalAlpha=.4*f;ctx.fillStyle=d.col;ctx.beginPath();ctx.ellipse(0,8,13,5,0,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(0,-6,10,13,0,0,7);ctx.fill();ctx.beginPath();ctx.arc(0,-22,9,0,7);ctx.fill()}
  else{ctx.rotate(d.rot);ctx.globalAlpha=f;ctx.drawImage(scorch(),-d.r,-d.r*.85,d.r*2,d.r*1.7);ctx.globalAlpha=.5*f;ctx.strokeStyle=d.col;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,0,d.r*.75,d.r*.65,0,0,7);ctx.stroke();ctx.lineWidth=2;ctx.strokeStyle='#000';
   if(Q.fx)for(const [a,l] of d.cr){ctx.beginPath();ctx.moveTo(Math.cos(a)*d.r*.15,Math.sin(a)*d.r*.15);ctx.lineTo(Math.cos(a+.15)*d.r*l*.55,Math.sin(a+.15)*d.r*l*.55);ctx.lineTo(Math.cos(a-.1)*d.r*l,Math.sin(a-.1)*d.r*l);ctx.stroke()}}
  ctx.restore()}
 ctx.globalAlpha=1;
 if(raid){if(portal)drawPortal(portal);if(chest)drawChest(chest);for(const p of pk)drawPickup(p)}
 if(lockT&&lockT.al&&touch){ctx.strokeStyle='#ff5a5a';ctx.lineWidth=3;ctx.globalAlpha=.55+.35*Math.sin(tm*8);ctx.beginPath();ctx.ellipse(lockT.x,lockT.y+20,26+Math.sin(tm*8)*2,11,0,0,7);ctx.stroke();ctx.globalAlpha=1}
 if(aim&&aim.on&&me.al){const sk=CH[me.ch].s[aim.key],ux=Math.cos(aim.a),uy=Math.sin(aim.a),rg=aimRange(sk);ctx.save();ctx.globalAlpha=.6;ctx.strokeStyle='#fff';ctx.fillStyle=CH[me.ch].col;ctx.lineWidth=3;ctx.setLineDash([10,8]);
  if(sk.cur){const d=Math.max(70,rg*aim.f),tx=me.x+ux*d,ty=me.y+uy*d;ctx.beginPath();ctx.moveTo(me.x,me.y);ctx.lineTo(tx,ty);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=.3;ctx.beginPath();ctx.arc(tx,ty,sk.r||sk.rad||60,0,7);ctx.fill();ctx.globalAlpha=.8;ctx.stroke()}
  else if(sk.k=='cone'){ctx.setLineDash([]);ctx.globalAlpha=.3;ctx.beginPath();ctx.moveTo(me.x,me.y);ctx.arc(me.x,me.y,sk.r,aim.a-sk.arc/2,aim.a+sk.arc/2);ctx.closePath();ctx.fill()}
  else if(['nova','zone','mine','orbit','shield','heal','haste'].includes(sk.k)){ctx.setLineDash([]);ctx.globalAlpha=.25;ctx.beginPath();ctx.arc(me.x,me.y,sk.r||sk.rad||60,0,7);ctx.fill()}
  else{ctx.setLineDash([]);ctx.lineWidth=Math.max(6,(sk.w||sk.r||6)*2);ctx.globalAlpha=.3;ctx.beginPath();ctx.moveTo(me.x,me.y);ctx.lineTo(me.x+ux*rg,me.y+uy*rg);ctx.stroke()}
  ctx.restore()}
 drawObjs();
 // ---- air layer
 for(const q of ents){if(q.t!='a'||q.mine||q.age>=q.delay||!q.rn)continue;const u=q.age/q.delay,fs=q.fs||'orb';
  if(fs=='bomb'){const x=q.sx+(q.x-q.sx)*u,y=q.sy+(q.y-q.sy)*u-Math.sin(u*Math.PI)*90;ctx.fillStyle='rgba(10,5,30,.25)';ctx.beginPath();ctx.ellipse(q.sx+(q.x-q.sx)*u,q.sy+(q.y-q.sy)*u+8,7,3,0,0,7);ctx.fill();ctx.save();ctx.translate(x-9,y);ctx.lineJoin='round';ctx.lineWidth=2.2;ctx.strokeStyle=INK;WPN.bomb({col:q.col});ctx.restore()}
  else if(fs!='bolt'){const h=(1-u)*(1-u)*340;ctx.globalCompositeOperation='lighter';ctx.strokeStyle=q.col;ctx.lineWidth=6;ctx.globalAlpha=.5;ctx.beginPath();ctx.moveTo(q.x+h*.25,q.y-h);ctx.lineTo(q.x+h*.25+12,q.y-h-46);ctx.stroke();ctx.globalAlpha=1;ctx.drawImage(glow(q.col),q.x+h*.25-11,q.y-h-11,22,22);ctx.globalCompositeOperation='source-over'}}
 ctx.globalCompositeOperation='lighter';ctx.lineCap='round';
 for(const q of ents){
  if(q.t=='a'&&q.age>=q.delay&&!(q.mine&&!q.done)){const u=Math.min(1,(q.age-q.delay)/.3),rad=q.r*(.6+.6*u),al=1-u;if(q.dmg>0||q.r>30){ctx.globalAlpha=al;ctx.drawImage(glow(q.col),q.x-rad*1.25,q.y-rad*1.25,rad*2.5,rad*2.5);ctx.strokeStyle='#fff';ctx.lineWidth=7*al+1;ctx.beginPath();ctx.arc(q.x,q.y,rad,0,7);ctx.stroke();ctx.strokeStyle=q.col;ctx.lineWidth=3;
    for(let i=0;i<8;i++){const a=i*.785+q.x*.01;ctx.beginPath();ctx.moveTo(q.x+Math.cos(a)*rad*.5,q.y+Math.sin(a)*rad*.5);ctx.lineTo(q.x+Math.cos(a)*rad*(1.05+.3*u),q.y+Math.sin(a)*rad*(1.05+.3*u));ctx.stroke()}
    if(q.rn&&q.fs=='bolt'&&u<.6){ctx.strokeStyle='#fff';ctx.lineWidth=4;ctx.beginPath();let x=q.x,y=q.y;ctx.moveTo(x,y);for(let i=0;i<7;i++){x+=(Math.random()-.5)*26;y-=44;ctx.lineTo(x,y)}ctx.stroke()}
    if(q.tp){ctx.strokeStyle='#fff';ctx.lineWidth=9*al+1;for(const s of[-1,1]){ctx.beginPath();ctx.moveTo(q.x-q.r*.9,q.y-q.r*.9*s);ctx.lineTo(q.x+q.r*.9,q.y+q.r*.9*s);ctx.stroke()}}}
   else{ctx.globalAlpha=al*.8;ctx.drawImage(glow(q.col),q.x-30,q.y-40,60,70)}ctx.globalAlpha=1}
  else if(q.t=='c'){const u=Math.min(1,q.age/.25),a0=q.a-q.arc/2,a1=a0+q.arc*Math.min(1,u*1.7+.3),al=1-u*u,full=q.arc>5;ctx.globalAlpha=al*.8;ctx.fillStyle=q.col;ctx.beginPath();ctx.arc(q.x,q.y,q.r,a0,a1);
   if(full)ctx.arc(q.x,q.y,q.r*.62,a1,a0,true);else{const m=(a0+a1)/2;ctx.arc(q.x+Math.cos(m)*q.r*.2,q.y+Math.sin(m)*q.r*.2,q.r*.72,a1+.12,a0-.12,true)}ctx.closePath();ctx.fill();
   ctx.globalAlpha=al;ctx.strokeStyle='#fff';ctx.lineWidth=q.emp?6:3.6;ctx.beginPath();ctx.arc(q.x,q.y,q.r*.97,a0+(a1-a0)*.2,a1);ctx.stroke();if(q.emp){ctx.strokeStyle=q.col;ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(q.x,q.y,q.r*1.1,a0,a1);ctx.stroke()}ctx.globalAlpha=1}
  else if(q.t=='s'){const u=q.age/q.dur,al=1-u,dx=q.x1-q.x0,dy=q.y1-q.y0;ctx.globalAlpha=al*.55;ctx.strokeStyle=q.col;ctx.lineWidth=q.w*(1-u*.6);ctx.beginPath();ctx.moveTo(q.x0,q.y0);ctx.lineTo(q.x1,q.y1);ctx.stroke();ctx.globalAlpha=al;ctx.strokeStyle='#fff';ctx.lineWidth=4*al+1;ctx.beginPath();ctx.moveTo(q.x0+dx*u*.5,q.y0+dy*u*.5);ctx.lineTo(q.x1,q.y1);ctx.stroke();ctx.globalAlpha=1}
  else if(q.t=='b'){const ex=q.x+Math.cos(q.a)*q.len,ey=q.y+Math.sin(q.a)*q.len,w=q.w*(.85+.15*Math.sin(tm*40))*Math.min(1,q.age*8)*Math.min(1,(q.dur-q.age)*6+.05);ctx.strokeStyle=q.col;ctx.globalAlpha=.4;ctx.lineWidth=w*1.9;ctx.beginPath();ctx.moveTo(q.x,q.y);ctx.lineTo(ex,ey);ctx.stroke();ctx.globalAlpha=.9;ctx.lineWidth=w;ctx.stroke();ctx.globalAlpha=1;ctx.strokeStyle='#fff';ctx.lineWidth=w*.42;ctx.stroke();
   ctx.setLineDash([14,26]);ctx.lineDashOffset=-tm*520;ctx.lineWidth=w*.7;ctx.globalAlpha=.7;ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;ctx.drawImage(glow(q.col),q.x-w*1.3,q.y-w*1.3,w*2.6,w*2.6);ctx.drawImage(glow(q.col),ex-w*1.6,ey-w*1.6,w*3.2,w*3.2)}
  else if(q.t=='o'&&q.bl){ctx.globalCompositeOperation='source-over';q.bl.forEach((b,i)=>{glowAt(q.col,b[0],b[1],19,.8);ctx.save();ctx.translate(b[0],b[1]);ctx.rotate(q.age*7+i*6.283/q.n+1.9);ctx.lineJoin='round';ctx.lineWidth=2;ctx.strokeStyle=INK;aPoly([-11,0,-2,-4.4,12,0,-2,4.4],'#f4f8ff');aPoly([-11,0,-2,-4.4,1,0],q.col,1);ctx.restore()});ctx.globalCompositeOperation='lighter'}
  else if(q.t=='l'){ctx.globalAlpha=Math.max(0,q.life/q.m);ctx.strokeStyle=q.col;ctx.lineWidth=6;for(let pass=0;pass<2;pass++){ctx.beginPath();ctx.moveTo(q.pts[0].x,q.pts[0].y);for(let i=1;i<q.pts.length;i++){const A=q.pts[i-1],B=q.pts[i];for(let j=1;j<=6;j++){const u=j/6,jt=j<6?(Math.random()-.5)*26:0;ctx.lineTo(A.x+(B.x-A.x)*u+jt,A.y+(B.y-A.y)*u+jt)}}ctx.stroke();ctx.strokeStyle='#fff';ctx.lineWidth=2.2}for(let i=1;i<q.pts.length;i++)ctx.drawImage(glow(q.col),q.pts[i].x-16,q.pts[i].y-16,32,32);ctx.globalAlpha=1}}
 ctx.globalCompositeOperation='source-over';
 for(const q of ents)if(q.t=='p')drawProj(q);
 // ---- short-lived sparks, rings and puffs
 ctx.globalCompositeOperation='lighter';ctx.lineCap='round';{let n=0;for(let i=0;i<fxs.length;i++){const f=fxs[i],u=(tm-f.t0)/f.l;if(u>=1||u<0)continue;fxs[n++]=f;const al=1-u;ctx.globalAlpha=al;
  if(f.k=='hit'){ctx.strokeStyle='#fff';ctx.lineWidth=3*al+1;for(let j=0;j<4;j++){const a=f.a+j*1.571+.4;ctx.beginPath();ctx.moveTo(f.x+Math.cos(a)*f.r*(.3+u*.5),f.y+Math.sin(a)*f.r*(.3+u*.5));ctx.lineTo(f.x+Math.cos(a)*f.r*(.8+u),f.y+Math.sin(a)*f.r*(.8+u));ctx.stroke()}ctx.drawImage(glow(f.col),f.x-f.r,f.y-f.r,f.r*2,f.r*2)}
  else if(f.k=='ring'){ctx.strokeStyle=f.col;ctx.lineWidth=5*al+1;ctx.beginPath();ctx.arc(f.x,f.y,f.r*(.3+.9*u),0,7);ctx.stroke()}
  else if(f.k=='poof'){ctx.strokeStyle='#fff';ctx.lineWidth=4*al+1;ctx.beginPath();ctx.arc(f.x,f.y,f.r*(.3+u),0,7);ctx.stroke();for(let j=0;j<6;j++){const a=f.a+j*1.047,d=f.r*(.3+u*.9),s=f.r*.42*al+2;ctx.drawImage(glow(f.col),f.x+Math.cos(a)*d-s,f.y-6+Math.sin(a)*d*.8-u*12-s,s*2,s*2)}}
  else if(f.k=='slash'){ctx.strokeStyle='#fff';ctx.lineWidth=5*al+1;const c=Math.cos(f.a),s=Math.sin(f.a),d=f.r*(.6+u*.6);ctx.beginPath();ctx.moveTo(f.x-c*d,f.y-s*d);ctx.lineTo(f.x+c*d,f.y+s*d);ctx.stroke();ctx.strokeStyle=f.col;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(f.x-c*d*1.3,f.y-s*d*1.3);ctx.lineTo(f.x+c*d*1.3,f.y+s*d*1.3);ctx.stroke()}
  else if(f.k=='heal'){ctx.fillStyle=f.col;for(let j=0;j<3;j++){const x=f.x+(j-1)*12,y=f.y-u*36-j*5;ctx.fillRect(x-1.6,y-5,3.2,10);ctx.fillRect(x-5,y-1.6,10,3.2)}}
  else if(f.k=='tp'){ctx.drawImage(glow(f.col),f.x-f.r*(1-u*.5),f.y-f.r*2.2,f.r*2*(1-u*.5),f.r*3.2);ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(f.x,f.y+18,f.r*(.4+u),f.r*(.16+u*.4),0,0,7);ctx.stroke()}}
  fxs.length=n}
 for(const p of parts){const u=p.l/p.m,r=p.s*(.4+.6*u);ctx.globalAlpha=u>0?u:0;ctx.fillStyle=p.c;if(r<2.2)ctx.fillRect(p.x-r,p.y-r,r*2,r*2);else{ctx.beginPath();ctx.arc(p.x,p.y,r,0,7);ctx.fill()}}
 // ---- weather: stateless motes drifting through the camera view
 {const [mc,ma,vx,vy]=T.mote,n=Q.fx?22:9,gs=glow(mc),ww=VW+60,hh=VH+60;for(let i=0;i<n;i++){const s=i*97.31,x=cam.x-30+(((s*53+tm*(vx+(i%5)*2))%ww)+ww)%ww,y=cam.y-30+(((s*31+tm*(vy+(i%4)*3))%hh)+hh)%hh,z=4+(i%3)*2.4;ctx.globalAlpha=ma*(.45+.55*Math.sin(tm*1.7+i));ctx.drawImage(gs,x+Math.sin(tm*.9+i)*14-z,y-z,z*2,z*2)}}
 ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
 if(T.tint){ctx.fillStyle=T.tint;ctx.fillRect(cam.x-40,cam.y-40,VW+80,VH+80)}
 ctx.textAlign='center';ctx.lineJoin='round';for(const t of txts){const age=t.m-t.l,sc=(age<.14?1+(.14-age)*5:1)*(t.c=='#ff9d2e'?1.35:1);ctx.save();ctx.translate(t.x,t.y);ctx.scale(sc,sc);ctx.globalAlpha=Math.min(1,t.l*3);ctx.font=(t.big?'900 16px':'900 23px')+' system-ui';ctx.lineWidth=5;ctx.strokeStyle=INK;ctx.strokeText(t.s,0,0);ctx.fillStyle=t.big?t.c:(t.c||(t.s>=25?'#ffd84d':'#fff'));ctx.fillText(t.s,0,0);ctx.restore()}ctx.globalAlpha=1}
