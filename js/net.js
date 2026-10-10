// online play: every transport (WebRTC 1v1, MQTT broker, WebSocket server) exposes the same room interface to wire()
function wire(){const my=R;begin(true);joinT=Date.now();
 my.onPeers(c=>{if(R!==my)return;const seen={};for(const p of c.peers){if(p.isMe||p.presence.ch==null||(p.presence.t===joinT&&p.presence.nm===me.nm))continue;const q=p.presence,id=p.peer,qc=CH[q.ch];if(!qc||qc.boss||qc.foe)continue;q.nm=String(q.nm||'?').slice(0,14);seen[id]=1;
  let e=others[id];if(!e){if(Object.keys(others).length>=3){leave('Room is full (4 players).');return}e=others[id]=mk(q.ch,q.x,q.y,q.nm,false)}
  if(MAPS[q.mp]&&myPeer()=='G'&&MAP!=q.mp){setMap(q.mp);ents=[];respawn(me)}Object.assign(e,{t:q.t,awt:q.aw?1:0,ch:q.ch,tx:q.x,ty:q.y,hp:q.hp,mx:CH[q.ch].hp,sd:+q.sd||0,sm:+q.sm||0,k:q.k,al:q.al,sh:q.sh?1:0,a:q.a,nm:q.nm,gq:q.gq,gc:q.gc,ga:q.ga})}
  for(const id in others)if(!others[id].bot&&!seen[id])delete others[id]});
 my.on('fx',m=>{if(R!==my)return;const d=m.data;if(m.isMe||!d||!CH[d.c]||!CH[d.c].s[d.s]||!others[m.peer])return;cast(others[m.peer],m.peer,d,false)});
 my.on('kill',m=>{if(R!==my)return;if(!m.isMe&&m.data&&m.data.k&&m.data.k===myPeer()&&me.al){me.k++;feedKill(me,others[m.peer]||{nm:'Enemy',tm:1})}});
 $('msg').textContent='';sendPres()};
function mkRTC(pc,dc,myId,otherId){const cbs={},pcbs=[];let rp=null,mine=null,last=Date.now();const iv=setInterval(()=>{if(rp&&Date.now()-last>5000){rp=null;pcbs.forEach(f=>f({peers:R2.peers()}))}},1000);
 const send=o=>{if(dc.readyState=='open')dc.send(JSON.stringify(o))};
 const R2={presence(p){mine=p;send({t:'p',d:p})},emit(n,d){send({t:'e',n,d})},on(n,f){(cbs[n]=cbs[n]||[]).push(f)},onPeers(f){pcbs.push(f)},
  peers(){return[{isMe:true,peer:myId,presence:mine||{}}].concat(rp?[{isMe:false,peer:otherId,presence:rp}]:[])},
  leave(){clearInterval(iv);try{dc.close();pc.close()}catch(e){}}};
 dc.onmessage=ev=>{let m;try{m=JSON.parse(ev.data)}catch(e){return}last=Date.now();if(m.t=='p'){rp=m.d;pcbs.forEach(f=>f({peers:R2.peers()}))}else if(m.t=='e')(cbs[m.n]||[]).forEach(f=>f({isMe:false,peer:otherId,data:m.d}))};
 dc.onclose=()=>{clearInterval(iv);rp=null;pcbs.forEach(f=>f({peers:R2.peers()}))};return R2}
const ICE={iceServers:[{urls:['stun:stun.l.google.com:19302','stun:stun1.l.google.com:19302','stun:stun.cloudflare.com:3478']}]};
function showCode(c){const o=$('pout');o.value=c;try{o.select()}catch(e){}try{navigator.clipboard.writeText(c)}catch(e){}}let pcx=null;
const perr=e=>'Failed: '+(e&&e.name||'')+' '+(e&&e.message||e)+(typeof RTCPeerConnection=='undefined'?' | WebRTC is not available in this page/browser':'');
const enc=o=>btoa(unescape(encodeURIComponent(JSON.stringify(o)))),dec=t=>JSON.parse(decodeURIComponent(escape(atob(t.replace(/\s+/g,'')))));
const gather=p=>new Promise(r=>{if(p.iceGatheringState=='complete')return r();p.addEventListener('icegatheringstatechange',()=>{if(p.iceGatheringState=='complete')r()});setTimeout(r,4000)});
function setupP(host){pcx=new RTCPeerConnection(ICE);const pc=pcx;pc.onconnectionstatechange=()=>{if(pc.connectionState=='failed')$('pmsg').textContent='Connection failed (strict network or firewall). Try another network.';if(pc.connectionState=='connected')$('pmsg').textContent='Connected!';if(pc.connectionState=='disconnected')$('pmsg').textContent='Connection lost.'};
 return ch=>{const go=()=>{R=mkRTC(pc,ch,host?'H':'G',host?'G':'H');$('pmsg').textContent='';{const mv=$('mpsel').value;onlineTeam=false;onlineMap=host?(mv=='r'?Math.random()*MAPS.length|0:(+mv||0)):0}wire()};ch.onopen=go;if(ch.readyState=='open')go()}}
$('ph').onclick=async()=>{try{const open=setupP(1);open(pcx.createDataChannel('g'));await pcx.setLocalDescription(await pcx.createOffer());await gather(pcx);showCode(enc(pcx.localDescription));$('pmsg').textContent='Code copied. Send it to your friend, paste their reply above, press Connect.'}catch(e){$('pmsg').textContent=perr(e)}};
$('pc').onclick=async()=>{try{if(!pcx)throw new Error('Press Host first');await pcx.setRemoteDescription(dec($('pin').value));$('pmsg').textContent='Connecting…'}catch(e){$('pmsg').textContent=perr(e)}};
$('pj').onclick=async()=>{try{const open=setupP(0);pcx.ondatachannel=e=>open(e.channel);await pcx.setRemoteDescription(dec($('pin').value));await pcx.setLocalDescription(await pcx.createAnswer());await gather(pcx);showCode(enc(pcx.localDescription));$('pmsg').textContent='Send this reply code to the host. The game starts when connected.'}catch(e){$('pmsg').textContent=perr(e)}};
const te=new TextEncoder(),td=new TextDecoder();
const cat=(...a)=>{const o=new Uint8Array(a.reduce((x,y)=>x+y.length,0));let p=0;for(const y of a){o.set(y,p);p+=y.length}return o};
const mstr=t=>{const b=te.encode(t);return cat(new Uint8Array([b.length>>8,b.length&255]),b)};
function mpkt(type,flags,body){const l=[];let n=body.length;do{let b=n%128;n=Math.floor(n/128);if(n>0)b|=128;l.push(b)}while(n>0);return cat(new Uint8Array([type<<4|flags]),new Uint8Array(l),body)}
function mqttConnect(url,cid,onmsg,onclose){return new Promise((res,rej)=>{let ws;try{ws=new WebSocket(url,'mqtt')}catch(e){return rej(e)}ws.binaryType='arraybuffer';let buf=new Uint8Array(0),ok=0,ping=null;
 const to=setTimeout(()=>{rej(new Error('timeout'));try{ws.close()}catch(e){}},9000),tx=u=>{if(ws.readyState==1)ws.send(u)};
 const c={sub(f){tx(mpkt(8,2,cat(new Uint8Array([0,1]),mstr(f),new Uint8Array([0]))))},pub(t,m){tx(mpkt(3,0,cat(mstr(t),te.encode(m))))},close(){clearInterval(ping);try{tx(new Uint8Array([0xe0,0]));ws.close()}catch(e){}}};
 ws.onopen=()=>tx(mpkt(1,0,cat(mstr('MQTT'),new Uint8Array([4,2,0,30]),mstr(cid))));
 ws.onerror=()=>{clearTimeout(to);if(!ok)rej(new Error('connection error'))};
 ws.onclose=()=>{clearTimeout(to);clearInterval(ping);if(!ok)rej(new Error('closed'));else if(onclose)onclose()};
 ws.onmessage=ev=>{buf=cat(buf,new Uint8Array(ev.data));for(;;){if(buf.length<2)return;let n=0,m=1,i=1,b;do{if(i>=buf.length)return;b=buf[i++];n+=(b&127)*m;m*=128}while(b&128);if(buf.length<i+n)return;const t=buf[0]>>4,body=buf.slice(i,i+n);buf=buf.slice(i+n);
  if(t==2){if(body[1]==0){ok=1;clearTimeout(to);ping=setInterval(()=>tx(new Uint8Array([0xc0,0])),20000);res(c)}else rej(new Error('refused'))}
  else if(t==3){const tl=body[0]<<8|body[1];onmsg(td.decode(body.slice(2,2+tl)),td.decode(body.slice(2+tl)))}}}})}
function mkMQ(c,room,myId){const base='tb1/'+room+'/',cbs={},pcbs=[],rp={},seen={},T0=Date.now();let mine=null,last=0,gone=0;
 const order=()=>[[mine&&mine.t||T0,myId]].concat(Object.keys(rp).map(id=>[rp[id].t||0,id])).sort((x,y)=>x[0]-y[0]||(x[1]<y[1]?-1:1)).map(x=>x[1]);
 const notify=()=>{if(gone)return;if(!order().slice(0,4).includes(myId)){gone=1;leave('Room is full (4 players max). Try another code.');return}pcbs.forEach(f=>f({peers:R4.peers()}))};
 const iv=setInterval(()=>{let ch=0;for(const id in rp)if(Date.now()-seen[id]>4000){delete rp[id];ch=1}if(ch)notify()},1000);
 const R4={rx(t,p){if(!t.startsWith(base))return;const [id,k]=t.slice(base.length).split('/');if(id==myId)return;
   if(k=='p'){try{rp[id]=JSON.parse(p)}catch(e){return}seen[id]=Date.now();notify()}
   else if(k=='e'){let m;try{m=JSON.parse(p)}catch(e){return}seen[id]=Date.now();(cbs[m.n]||[]).forEach(f=>f({isMe:false,peer:id,data:m.d}))}
   else if(k=='x'){delete rp[id];notify()}},
  presence(p){mine=p;const t=Date.now();if(t-last<90)return;last=t;c.pub(base+myId+'/p',JSON.stringify(p))},
  emit(n,d){c.pub(base+myId+'/e',JSON.stringify({n,d}))},on(n,f){(cbs[n]=cbs[n]||[]).push(f)},onPeers(f){pcbs.push(f)},
  peers(){const keep=order().slice(0,4),ids=Object.keys(rp).filter(id=>keep.includes(id));return[{isMe:true,peer:myId,presence:mine||{}}].concat(ids.filter(id=>!ids.some(o=>o!=id&&rp[o].nm===rp[id].nm&&rp[o].ch===rp[id].ch&&seen[o]-seen[id]>1200)).map(id=>({isMe:false,peer:id,presence:rp[id]})))},
  leave(){clearInterval(iv);try{c.pub(base+myId+'/x','x')}catch(e){}c.close()}};return R4}
$('bm').onclick=async()=>{if(joining)return;joining=1;try{await joinMQ()}finally{joining=0}};
function closeOld(){if(R){try{R.leave()}catch(e){}R=null}}
async function joinMQ(){closeOld();const url=$('brk').value,code=rcode(),M=$('mmsg');
 if(!code){M.textContent='Enter a room code above.';return}if(typeof WebSocket=='undefined'){M.textContent='WebSocket is not available here.';return}
 M.textContent='Connecting…';const myId='u'+Math.random().toString(36).slice(2,8);let mq=null,cl;
 try{cl=await mqttConnect(url,'tb'+myId,(t,p)=>{if(mq)mq.rx(t,p)},()=>{if(mq&&R===mq)leave('Disconnected from the broker.')})}catch(e){M.textContent='Could not reach that broker ('+(e.message||e)+'). Try another one, and tell your friends to pick the same.';return}
 mq=mkMQ(cl,code,myId);cl.sub('tb1/'+code+'/#');R=mq;M.textContent='';setOnline(code);wire()}
function mkWS(ws,myId){const cbs={},pcbs=[],rp={},seen={};let mine=null;
 const send=o=>{if(ws.readyState==1)ws.send(JSON.stringify(o))},notify=()=>pcbs.forEach(f=>f({peers:R3.peers()}));
 const iv=setInterval(()=>{let ch=0;for(const id in rp)if(Date.now()-seen[id]>6000){delete rp[id];ch=1}if(ch)notify()},1500);
 const R3={presence(p){mine=p;send({t:'p',d:p})},emit(n,d){send({t:'e',n,d})},on(n,f){(cbs[n]=cbs[n]||[]).push(f)},onPeers(f){pcbs.push(f)},
  peers(){return[{isMe:true,peer:myId,presence:mine||{}}].concat(Object.keys(rp).map(id=>({isMe:false,peer:id,presence:rp[id]})))},leave(){clearInterval(iv);try{ws.close()}catch(e){}}};
 ws.onmessage=ev=>{let m;try{m=JSON.parse(ev.data)}catch(e){return}if(m.t=='p'){rp[m.id]=m.d;seen[m.id]=Date.now();notify()}else if(m.t=='e'){seen[m.id]=Date.now();(cbs[m.n]||[]).forEach(f=>f({isMe:false,peer:m.id,data:m.d}))}else if(m.t=='left'){delete rp[m.id];notify()}};
 ws.onclose=()=>{clearInterval(iv);if(R===R3)leave('Disconnected from server.')};return R3}
try{$('srv').value=localStorage.getItem('tbsrv')||''}catch(e){}
$('bs').onclick=()=>{closeOld();const url=$('srv').value.trim(),code=rcode(),M=$('smsg');
 if(!/^wss?:\/\//i.test(url)){M.textContent='Enter the server address, starting with wss://';return}if(!code){M.textContent='Enter a room code above.';return}
 try{localStorage.setItem('tbsrv',url)}catch(e){}M.textContent='Connecting…';let ws;try{ws=new WebSocket(url)}catch(e){M.textContent=perr(e);return}
 const to=setTimeout(()=>{M.textContent='No answer from the server (free servers can take ~30s to wake up, try again).';try{ws.close()}catch(e){}},20000);
 ws.onopen=()=>ws.send(JSON.stringify({t:'join',room:code}));
 ws.onerror=()=>{clearTimeout(to);M.textContent='Could not connect. Check the address (wss://…) and that the server is running.'};
 ws.onmessage=ev=>{let m;try{m=JSON.parse(ev.data)}catch(e){return}clearTimeout(to);
  if(m.t=='full'){M.textContent='Room is full (4 players max). Try another code.';ws.close()}
  else if(m.t=='joined'){M.textContent='';R=mkWS(ws,m.id);setOnline(code);wire()}}};
