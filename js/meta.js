// ===== menu layer: accounts, saved progress, levelling, shop and every screen outside the arena =====
const LS={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},del(k){try{localStorage.removeItem(k)}catch(e){}}};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),fmt=n=>Math.floor(n).toLocaleString('en-US'),esc=s=>String(s).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');

// ---- text (vi / en). Arena callouts drawn on the canvas stay in English.
const TX={vi:{tapStart:'NHẤN ĐỂ BẮT ĐẦU',login:'Đăng nhập',register:'Đăng ký',username:'Tên tài khoản',password:'Mật khẩu',password2:'Nhập lại mật khẩu',or:'hoặc',guest:'🎮 Chơi nhanh (Khách)',
 hintCloud:'☁️ Tài khoản lưu trên máy chủ: đăng nhập ở máy nào cũng giữ nguyên tiến trình.',hintDev:'💾 Chưa kết nối máy chủ tài khoản: tài khoản và tiến trình chỉ lưu trên thiết bị này.',
 tagCloud:'☁️ Lưu cloud',tagDev:'💾 Lưu trên thiết bị',wait:'Đang xử lý…',
 errName:'Tên 3–16 ký tự: chữ không dấu, số, gạch dưới',errPass:'Mật khẩu tối thiểu 6 ký tự',errPass2:'Hai mật khẩu không khớp',errTaken:'Tên này đã có người dùng',errLogin:'Sai tên hoặc mật khẩu',errNet:'Không kết nối được máy chủ, thử lại sau',errRate:'Thử quá nhiều lần, đợi vài phút rồi thử lại',errAdminOff:'Tài khoản admin chưa được cấu hình',errAuth:'Phiên đăng nhập hết hạn, hãy đăng nhập lại',offline:'Đang chơi ngoại tuyến, tiến trình sẽ đồng bộ khi có mạng',
 nHome:'Sảnh',nStages:'Màn chơi',nHeroes:'Nhân vật',nStats:'Nâng cấp',nShop:'Cửa hàng',
 campaign:'CHIẾN DỊCH',raid:'RAID VÔ TẬN',arena:'ĐẤU TRƯỜNG',play:'CHƠI ▶',open:'MỞ ▶',stage:'Màn',campDone:'Đã phá đảo! Chơi lại để cày vàng và XP',raidSub:'Kỷ lục: tầng {0} · phòng {1}',raidNew:'Leo tầng không giới hạn, boss mỗi 5 phòng',raidLock:'🔒 Qua màn 1-3 để mở khoá',arenaCard:'Đấu bot · 2v2 · Online PvP',change:'Đổi nhân vật',
 daily:'Quà hằng ngày',dailyd:'Đăng nhập mỗi ngày để nhận vàng. Chuỗi ngày càng dài, quà càng lớn (tối đa 7 ngày).',claim:'Nhận 🪙 {0}',claimed:'Đã nhận hôm nay · chuỗi {0} ngày',nextBuffs:'Buff cho lượt kế',noBuff:'Chưa có, mua ở Cửa hàng',
 rar0:'Cơ bản',rar1:'Hiếm',rar2:'Sử thi',rar3:'Huyền thoại',locked:'Chưa mở khoá',start:'BẮT ĐẦU',stInfo:'{0} phòng',first:'lần đầu ×2',stars3:'3★: không hồi sinh và còn từ 50% máu',
 select:'CHỌN',using:'✔ Đang dùng',upgrade:'⬆ Nâng Lv {0} · 🪙 {1}',maxed:'ĐÃ MAX',unlock:'Mở khoá · 🪙 {0}',orChest:'hoặc thử vận may với rương ở Cửa hàng',upDone:'{0} lên Lv {1}!',noGold:'Không đủ vàng',charNote:'Mỗi cấp nhân vật: +5% máu và sát thương (màn chơi & raid)',
 level:'Cấp',points:'Điểm',sHp:'Máu',sSh:'Khiên',sDm:'Sát thương',sSp:'Tốc độ',respec:'Đặt lại điểm · 🪙 {0}',respecDone:'Đã hoàn lại toàn bộ điểm',noPts:'Hết điểm, lên cấp để nhận thêm',statNote:'Mỗi lần lên cấp nhận 1 điểm. Chỉ số cộng thêm áp dụng cho Màn chơi và Raid; đấu PvP luôn cân bằng.',base:'Gốc',now:'Hiện tại',
 chest1:'Rương Anh Hùng',chest1d:'Mở ngẫu nhiên 1 nhân vật chưa có. Hiếm 70% · Sử thi 25% · Huyền thoại 5%',chest2:'Rương Huyền Thoại',chest2d:'Mở ngẫu nhiên 1 nhân vật chưa có. Sử thi 70% · Huyền thoại 30%',lucky:'Buff May Mắn',luckyd:'Nhận 1 buff ngẫu nhiên, tự kích hoạt ở lượt chơi kế tiếp (giữ tối đa 3).',luckyFull:'Đã giữ đủ 3 buff, hãy vào trận dùng trước',allOwned:'Bạn đã có tất cả nhân vật!',owned:'Đã có {0}/{1} nhân vật',newHero:'NHÂN VẬT MỚI!',useNow:'Dùng ngay',got:'Nhận được {0}',
 settings:'Cài đặt',language:'Ngôn ngữ',sound:'Âm thanh',graphics:'Đồ hoạ',qAuto:'Tự động',qHigh:'Cao',qMed:'Vừa',qLow:'Thấp (mượt nhất)',autoAim:'📱 Tự ngắm trên điện thoại (ATK và chiêu tự nhắm địch gần nhất)',fullscreen:'⛶ Toàn màn hình',howto:'❓ Cách chơi',account:'Tài khoản',logout:'Đăng xuất',adminPanel:'🛠 Quản trị',accCloud:'Tài khoản cloud',accDev:'Tài khoản trên thiết bị này',accGuest:'Khách (chưa có tài khoản)',mkAcc:'Tạo tài khoản để giữ tiến trình',
 arenaSub:'Đấu đối kháng: ai hạ 5 mạng trước sẽ thắng. Thắng nhận 🪙 và XP.',map:'Bản đồ',mBots:'🤖 Đấu 3 Bot',m2v2:'👥 2v2 cùng Bot',mDummy:'🎯 Tập luyện',mLocal:'⌨️ 2 người 1 máy',online:'Online PvP (tối đa 4 người)',onlineSub:'Mọi người chọn CÙNG máy chủ trung gian và nhập CÙNG mã phòng.',room:'Mã phòng',team2:'👥 Chia đội 2v2 (bản đồ lớn)',broker:'Máy chủ trung gian',joinOnline:'🌐 Vào phòng Online',advServer:'🖥️ Dùng server riêng',advServerSub:'Dán địa chỉ server WebSocket của bạn (wss://…). Mọi người dùng chung địa chỉ và mã phòng.',joinServer:'Vào bằng server',advCode:'🌍 1v1 bằng mã copy-paste',advCodeSub:'Chủ phòng: bấm Host, gửi mã cho bạn, dán mã trả lời rồi bấm Connect. Khách: dán mã của chủ phòng, bấm Join, gửi lại mã trả lời.',pasteHere:'Dán mã vào đây',yourCode:'Mã của bạn hiện ở đây',
 paused:'TẠM DỪNG',resume:'TIẾP TỤC',restart:'Chơi lại từ đầu',quit:'Thoát về sảnh',onlineNoPause:'Trận online vẫn đang diễn ra!',chooseBuff:'CHỌN 1 BUFF',downed:'BẠN ĐÃ GỤC NGÃ',reviveQ:'Hồi sinh với 50% máu và đầy khiên? (1 lần mỗi lượt)',noRevive:'Đã dùng lượt hồi sinh',revive:'HỒI SINH',giveup:'Bỏ cuộc',
 victory:'CHIẾN THẮNG!',defeat:'THẤT BẠI',raidOver:'KẾT THÚC RAID',raidReach:'Tới tầng {0} · phòng {1}',newBest:'Kỷ lục mới!',gold:'Vàng',kills:'Hạ gục',time:'Thời gian',lvup:'LÊN CẤP {0}! +{1} điểm nâng cấp · +{2} 🪙',nextStage:'MÀN TIẾP ▶',again:'Chơi lại',retry:'THỬ LẠI',toStats:'💪 Nâng cấp',toHub:'Về sảnh',pvpWin:'Thắng trận! +{0} 🪙 · +{1} XP',failTip:'Mẹo: nâng điểm chỉ số, nâng cấp nhân vật hoặc mua Buff May Mắn rồi thử lại.',
 howtoBody:'<b>Máy tính:</b> WASD di chuyển · chuột trái tấn công theo hướng chuột · Q / E / R dùng chiêu · Space thức tỉnh khi thanh vàng đầy · Esc tạm dừng.<br><b>Điện thoại:</b> cần điều khiển bên trái · ATK và Q/E/R bên phải, kéo nút để ngắm tay.<br><b>Khiên & máu:</b> khiên (thanh xanh) đỡ đòn trước và tự hồi sau 3,5 giây không trúng đòn. Hết khiên mới mất máu, và máu <u>không tự hồi</u>, chỉ hồi bằng bình máu, chiêu hồi máu hoặc buff.<br><b>Tiến trình:</b> qua màn nhận vàng và XP → lên cấp nhận điểm cộng Máu / Khiên / Sát thương / Tốc độ → dùng vàng mở rương nhân vật, nâng cấp nhân vật và mua buff.',
 admTitle:'Quản trị người chơi',admNone:'Chưa có người chơi nào',admGold:'+5000🪙',admAll:'Mở hết',admMax:'Max',admReset:'Reset',admDel:'Xoá',admSure:'Xoá hẳn tài khoản {0}?',admOk:'Đã cập nhật {0}',admPass:'Đổi MK',admNewPass:'Mật khẩu mới cho {0} (tối thiểu 6 ký tự):',name:'Tên',heroes:'Nhân vật'},
en:{tapStart:'TAP TO START',login:'Log in',register:'Sign up',username:'Username',password:'Password',password2:'Repeat password',or:'or',guest:'🎮 Quick play (Guest)',
 hintCloud:'☁️ Cloud account: your progress follows you to any device.',hintDev:'💾 Account server not connected: accounts and progress stay on this device only.',
 tagCloud:'☁️ Cloud saves',tagDev:'💾 Saved on this device',wait:'Working…',
 errName:'Name must be 3–16 letters, digits or underscores',errPass:'Password needs at least 6 characters',errPass2:'Passwords do not match',errTaken:'That name is taken',errLogin:'Wrong name or password',errNet:'Could not reach the server, try again later',errRate:'Too many attempts, wait a few minutes',errAdminOff:'The admin account is not configured',errAuth:'Session expired, please log in again',offline:'Playing offline, progress will sync when you are back online',
 nHome:'Lobby',nStages:'Stages',nHeroes:'Heroes',nStats:'Upgrade',nShop:'Shop',
 campaign:'CAMPAIGN',raid:'ENDLESS RAID',arena:'ARENA',play:'PLAY ▶',open:'OPEN ▶',stage:'Stage',campDone:'Campaign cleared! Replay to farm gold and XP',raidSub:'Best: floor {0} · room {1}',raidNew:'Climb forever, a boss every 5 rooms',raidLock:'🔒 Clear stage 1-3 to unlock',arenaCard:'Bots · 2v2 · Online PvP',change:'Change hero',
 daily:'Daily gift',dailyd:'Log in every day for gold. Longer streaks pay more (up to 7 days).',claim:'Claim 🪙 {0}',claimed:'Claimed today · {0} day streak',nextBuffs:'Buffs for next run',noBuff:'None yet, buy in the Shop',
 rar0:'Basic',rar1:'Rare',rar2:'Epic',rar3:'Legendary',locked:'Locked',start:'START',stInfo:'{0} rooms',first:'first clear ×2',stars3:'3★: no revive and at least 50% health left',
 select:'SELECT',using:'✔ In use',upgrade:'⬆ To Lv {0} · 🪙 {1}',maxed:'MAXED',unlock:'Unlock · 🪙 {0}',orChest:'or try your luck with a chest in the Shop',upDone:'{0} reached Lv {1}!',noGold:'Not enough gold',charNote:'Each hero level: +5% health and damage (stages & raid)',
 level:'Level',points:'Points',sHp:'Health',sSh:'Shield',sDm:'Damage',sSp:'Speed',respec:'Reset points · 🪙 {0}',respecDone:'All points refunded',noPts:'No points left, level up for more',statNote:'Every level grants 1 point. Bonuses apply in Stages and Raid; PvP is always even.',base:'Base',now:'Now',
 chest1:'Hero Chest',chest1d:'Unlocks a random hero you do not own. Rare 70% · Epic 25% · Legendary 5%',chest2:'Legend Chest',chest2d:'Unlocks a random hero you do not own. Epic 70% · Legendary 30%',lucky:'Lucky Buff',luckyd:'Get a random buff that triggers on your next run (hold up to 3).',luckyFull:'Already holding 3 buffs, go use them first',allOwned:'You own every hero!',owned:'{0}/{1} heroes owned',newHero:'NEW HERO!',useNow:'Use now',got:'Got {0}',
 settings:'Settings',language:'Language',sound:'Sound',graphics:'Graphics',qAuto:'Auto',qHigh:'High',qMed:'Medium',qLow:'Low (smoothest)',autoAim:'📱 Mobile auto-aim (ATK and skills target the nearest enemy)',fullscreen:'⛶ Fullscreen',howto:'❓ How to play',account:'Account',logout:'Log out',adminPanel:'🛠 Admin',accCloud:'Cloud account',accDev:'Account on this device',accGuest:'Guest (no account yet)',mkAcc:'Create an account to keep progress',
 arenaSub:'Deathmatch: first to 5 KOs wins. Wins pay 🪙 and XP.',map:'Map',mBots:'🤖 vs 3 Bots',m2v2:'👥 2v2 with Bots',mDummy:'🎯 Training',mLocal:'⌨️ Local 2-Player',online:'Online PvP (up to 4 players)',onlineSub:'Everyone picks the SAME relay and types the SAME room code.',room:'Room code',team2:'👥 2v2 teams (big map)',broker:'Relay',joinOnline:'🌐 Join online room',advServer:'🖥️ Use your own server',advServerSub:'Paste your WebSocket server address (wss://…). Everyone uses the same address and room code.',joinServer:'Join with server',advCode:'🌍 1v1 with copy-paste codes',advCodeSub:'Host: press Host, send the code, paste the reply, press Connect. Guest: paste the host code, press Join, send your reply back.',pasteHere:'Paste a code here',yourCode:'Your code appears here',
 paused:'PAUSED',resume:'RESUME',restart:'Restart run',quit:'Quit to lobby',onlineNoPause:'The online match is still running!',chooseBuff:'CHOOSE A BUFF',downed:'YOU WERE DOWNED',reviveQ:'Revive with 50% health and a full shield? (once per run)',noRevive:'Revive already used',revive:'REVIVE',giveup:'Give up',
 victory:'VICTORY!',defeat:'DEFEAT',raidOver:'RAID OVER',raidReach:'Reached floor {0} · room {1}',newBest:'New best!',gold:'Gold',kills:'Kills',time:'Time',lvup:'LEVEL {0}! +{1} upgrade points · +{2} 🪙',nextStage:'NEXT STAGE ▶',again:'Play again',retry:'RETRY',toStats:'💪 Upgrade',toHub:'Lobby',pvpWin:'Match won! +{0} 🪙 · +{1} XP',failTip:'Tip: spend stat points, level your hero or grab a Lucky Buff, then try again.',
 howtoBody:'<b>Desktop:</b> WASD to move · left click attacks toward the mouse · Q / E / R cast skills · Space awakens when the gold bar is full · Esc pauses.<br><b>Mobile:</b> stick on the left · ATK and Q/E/R on the right, drag a button to aim by hand.<br><b>Shield & health:</b> the shield (blue bar) takes hits first and recharges 3.5s after you stop getting hit. Health only drops once the shield is gone and <u>never regenerates</u>: only potions, healing skills and buffs restore it.<br><b>Progress:</b> clear stages for gold and XP → level up for points in Health / Shield / Damage / Speed → spend gold on hero chests, hero levels and buffs.',
 admTitle:'Player admin',admNone:'No players yet',admGold:'+5000🪙',admAll:'All heroes',admMax:'Max',admReset:'Reset',admDel:'Delete',admSure:'Delete account {0} for good?',admOk:'Updated {0}',admPass:'Password',admNewPass:'New password for {0} (6+ characters):',name:'Name',heroes:'Heroes'}};
let LANG=LS.get('cb_lang','vi');if(!TX[LANG])LANG='vi';
const t=(k,...a)=>{let s=TX[LANG][k];if(s==null)s=TX.en[k];if(s==null)return k;a.forEach((v,i)=>{s=s.split('{'+i+'}').join(v)});return s};
function applyLang(){document.documentElement.lang=LANG;document.querySelectorAll('[data-t]').forEach(e=>{e.textContent=t(e.dataset.t)});document.querySelectorAll('[data-tp]').forEach(e=>{e.placeholder=t(e.dataset.tp)})}

// ---- sound: tiny synth voices [wave, from Hz, to Hz, seconds, volume, delay]
const SND={atk:{gap:70,v:[['square',520,260,.06,.045]]},skl:{v:[['sawtooth',300,720,.14,.07]]},ult:{v:[['sawtooth',130,55,.45,.13],['square',640,200,.3,.05]]},
 hit:{gap:55,v:[['triangle',320,130,.06,.08]]},hurt:{gap:130,v:[['sawtooth',190,60,.17,.13]]},blk:{gap:110,v:[['square',940,520,.06,.05]]},brk:{v:[['square',720,90,.3,.12],['triangle',1300,300,.2,.07]]},
 kill:{gap:70,v:[['square',250,80,.12,.07]]},boom:{v:[['sawtooth',150,30,.7,.18],['square',90,40,.5,.1]]},die:{v:[['sawtooth',320,40,.6,.15]]},coin:{gap:45,v:[['square',1150,1750,.07,.035]]},heal:{v:[['sine',520,940,.22,.1]]},
 buff:{v:[['sine',520,1040,.15,.1],['sine',780,1560,.2,.08,.1]]},clear:{v:[['square',523,523,.1,.07],['square',659,659,.1,.07,.1],['square',784,784,.22,.07,.2]]},port:{v:[['sine',300,900,.3,.08]]},boss:{v:[['sawtooth',95,50,.9,.16]]},
 ui:{gap:40,v:[['square',660,880,.05,.04]]},err:{v:[['square',200,150,.15,.07]]},buy:{v:[['square',880,1320,.08,.06],['square',1320,1760,.12,.06,.08]]},
 lvl:{v:[['square',523,523,.1,.08],['square',659,659,.1,.08,.1],['square',784,784,.1,.08,.2],['square',1047,1047,.32,.08,.3]]},win:{v:[['square',523,523,.12,.08],['square',659,659,.12,.08,.12],['square',784,784,.12,.08,.24],['square',1047,1047,.4,.09,.36],['triangle',262,262,.6,.1,.36]]},lose:{v:[['sawtooth',392,370,.2,.09],['sawtooth',330,311,.2,.09,.2],['sawtooth',262,130,.6,.1,.4]]}};
const SFX={vol:LS.get('cb_vol',.6),ac:null,last:{}};
function sfx(n){const d=SND[n];if(!d||SFX.vol<=0)return;const now=performance.now();if(now-(SFX.last[n]||0)<(d.gap||30))return;SFX.last[n]=now;
 try{const ac=SFX.ac||(SFX.ac=new(window.AudioContext||window.webkitAudioContext)());if(ac.state=='suspended')ac.resume();const t0=ac.currentTime;
  for(const [type,f0,f1,dur,vol,dly] of d.v){const o=ac.createOscillator(),g=ac.createGain(),s=t0+(dly||0);o.type=type;o.frequency.setValueAtTime(f0,s);o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),s+dur);g.gain.setValueAtTime(vol*SFX.vol,s);g.gain.exponentialRampToValueAtTime(.0001,s+dur);o.connect(g);g.connect(ac.destination);o.start(s);o.stop(s+dur+.03)}}catch(e){}}

// ---- progression rules
const MAXL=50,SMAX=20,CMAX=10,RICH=9999999,BON={hp:.05,sh:.06,dm:.04,sp:.015},CHEST=[{cost:300,w:[0,70,25,5]},{cost:900,w:[0,0,70,30]}],PRICE=[0,700,1400,2800],LUCKY=120,RESPEC=100;
const need=l=>50+30*l+4*l*l,upCost=l=>100*l,reviveCost=r=>r.mode=='stage'?40+6*r.stage:60+40*r.floor;
const fresh=()=>({v:1,lvl:1,xp:0,gold:200,st:{hp:0,sh:0,dm:0,sp:0},own:{Ren:1,Kaen:1,Yuki:1,Sakura:1},sel:'Ren',stage:1,stars:{},raid:0,pb:[],daily:'',streak:0,wins:0,ts:0});
// normalise anything loaded from storage or the server so the menus can trust it
function fix(s){s=Object.assign(fresh(),s&&typeof s=='object'?s:{});s.lvl=clamp(s.lvl|0,1,MAXL);s.xp=Math.max(0,+s.xp||0);s.gold=clamp(Math.round(+s.gold||0),0,RICH);
 const st=s.st||{};s.st={hp:clamp(st.hp|0,0,SMAX),sh:clamp(st.sh|0,0,SMAX),dm:clamp(st.dm|0,0,SMAX),sp:clamp(st.sp|0,0,SMAX)};if(s.st.hp+s.st.sh+s.st.dm+s.st.sp>s.lvl-1)s.st={hp:0,sh:0,dm:0,sp:0};
 const own={},o=s.own||{};for(const i of NORM){const n=CH[i].n;if(o[n])own[n]=clamp(o[n]|0,1,CMAX)}for(const n of START)own[n]=own[n]||1;s.own=own;if(!own[s.sel])s.sel=START[0];
 s.stage=clamp(s.stage|0,1,NSTAGE+1);const sr={};for(let i=1;i<=NSTAGE;i++){const v=s.stars&&s.stars[i]|0;if(v>0)sr[i]=Math.min(3,v)}s.stars=sr;s.raid=Math.max(0,s.raid|0);
 s.pb=(Array.isArray(s.pb)?s.pb:[]).filter(n=>BUFFS.some(b=>b.n==n&&!b.run)).slice(0,3);s.daily=String(s.daily||'').slice(0,10);s.streak=Math.max(0,s.streak|0);s.wins=Math.max(0,s.wins|0);s.ts=+s.ts||0;return s}
function adminSave(old){const s=fresh();s.lvl=MAXL;s.gold=RICH;s.st={hp:SMAX,sh:SMAX,dm:SMAX,sp:SMAX};for(const i of NORM)s.own[CH[i].n]=CMAX;s.stage=NSTAGE+1;for(let i=1;i<=NSTAGE;i++)s.stars[i]=3;
 if(old){if(s.own[old.sel])s.sel=old.sel;s.raid=old.raid|0;s.daily=old.daily||'';s.streak=old.streak|0;s.pb=Array.isArray(old.pb)?old.pb.slice(0,3):[]}return s}
const pts=()=>Math.max(0,S.lvl-1-(S.st.hp+S.st.sh+S.st.dm+S.st.sp));
function addXp(x){let up=0;if(S.lvl>=MAXL)return 0;S.xp+=x;while(S.lvl<MAXL&&S.xp>=need(S.lvl)){S.xp-=need(S.lvl);S.lvl++;up++}if(S.lvl>=MAXL)S.xp=0;S.gold+=50*up;return up}
const charMul=n=>1+.05*((S.own[n]||1)-1);
// the engine asks for this when a run starts; buffs bought beforehand are spent here
function pveStats(){const cm=charMul(CH[sel].n),b=S.pb.slice();if(b.length){S.pb=[];persist()}return{hp:cm*(1+BON.hp*S.st.hp),sh:1+BON.sh*S.st.sh,dm:cm*(1+BON.dm*S.st.dm),sp:1+BON.sp*S.st.sp,buffs:b}}
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const dailyReady=()=>S.daily!==today();
function nextStreak(){const y=new Date();y.setDate(y.getDate()-1);const ys=y.getFullYear()+'-'+String(y.getMonth()+1).padStart(2,'0')+'-'+String(y.getDate()).padStart(2,'0');return S.daily===ys?Math.min(7,S.streak+1):1}
const dailyAmt=()=>80+30*nextStreak();

// ---- accounts. Cloud = /api on Vercel; device = this browser only (also the offline fallback)
let ACC=LS.get('cb_acc',null),S=null,cloudOK=false,probed=null,dirty=false,pushT=0;
const NAME_RE=/^[A-Za-z0-9_]{3,16}$/,svKey=()=>ACC.mode=='guest'?'cb_sv_guest':'cb_sv_'+ACC.mode[0]+'_'+ACC.name.toLowerCase();
async function api(path,body){const h={};if(body)h['Content-Type']='application/json';if(ACC&&ACC.tok)h.Authorization='Bearer '+ACC.tok;const c=new AbortController(),to=setTimeout(()=>c.abort(),10000);
 try{const r=await fetch('/api/'+path,{method:body?'POST':'GET',headers:h,body:body?JSON.stringify(body):undefined,signal:c.signal,cache:'no-store'}),j=await r.json();j.status=r.status;return j}finally{clearTimeout(to)}}
function probe(){return probed||(probed=(location.protocol=='file:'?Promise.resolve(null):api('auth').catch(()=>null)).then(j=>{cloudOK=!!(j&&j.ok&&j.db);$('cloudtag').textContent=t(cloudOK?'tagCloud':'tagDev')}))}
const hex=b=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
async function kdf(pass,salt,iter){if(!(window.crypto&&crypto.subtle))return null;const E=new TextEncoder(),k=await crypto.subtle.importKey('raw',E.encode(pass),'PBKDF2',false,['deriveBits']);return hex(await crypto.subtle.deriveBits({name:'PBKDF2',salt:E.encode(salt),iterations:iter,hash:'SHA-256'},k,256))}
// only reached where WebCrypto is missing (old browsers on plain http); device accounts are a convenience lock, not security
function weak(pass,salt){let h=2166136261;const s=salt+'|'+pass;for(let r=0;r<500;r++)for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return'w'+(h>>>0).toString(16)}
async function devAuth(act,name,pass){const users=LS.get('cb_users',{}),key=name.toLowerCase();
 if(key==CFG.adminUser){if(act=='register')return{err:'errTaken'};if(!CFG.adminHash)return{err:'errAdminOff'};const h=await kdf(pass,'chaos-bg-admin',150000);return h&&h===CFG.adminHash?{name:CFG.adminUser,role:'admin'}:{err:'errLogin'}}
 if(act=='register'){if(users[key])return{err:'errTaken'};const salt=hex(crypto.getRandomValues(new Uint8Array(12)));users[key]={name,salt,hash:await kdf(pass,salt,60000)||weak(pass,salt)};LS.set('cb_users',users);return{name,role:'user'}}
 const u=users[key];if(!u)return{err:'errLogin'};const h=await kdf(pass,u.salt,60000)||weak(pass,u.salt);return h===u.hash?{name:u.name,role:'user'}:{err:'errLogin'}}
// a guest who signs up keeps what they earned
const carry=()=>{const g=LS.get('cb_sv_guest',null);return g&&(g.lvl>1||g.stage>1||g.xp>0)?fix(g):null};
async function doAuth(act,name,pass){await probe();
 if(cloudOK){let j;try{j=await api('auth',{act,name,pass,save:act=='register'?carry():undefined})}catch(e){return'errNet'}if(!j.ok)return j.err||'errNet';
  ACC={name:j.name,role:j.role,mode:'cloud',tok:j.token};LS.set('cb_acc',ACC);loadSave(j.save)}
 else{const r=await devAuth(act,name,pass);if(r.err)return r.err;ACC={name:r.name,role:r.role,mode:'device'};LS.set('cb_acc',ACC);loadSave(act=='register'?carry():null)}
 if(act=='register')LS.del('cb_sv_guest');return null}
function loadSave(remote){const local=LS.get(svKey(),null);let s=remote||null;
 if(ACC.mode=='cloud'){if(local&&(!s||(local.ts||0)>(s.ts||0))){s=local;dirty=true}}else s=s||local;
 S=ACC.role=='admin'?adminSave(local):fix(s);LS.set(svKey(),S);if(dirty)push()}
async function resume(){if(!ACC||!ACC.mode||!ACC.name)return false;await probe();
 if(ACC.mode!='cloud'){loadSave(null);return true}
 if(!cloudOK){loadSave(null);toast(t('offline'),1);return true}
 try{const j=await api('save');if(j.status==401){ACC=null;LS.del('cb_acc');return false}if(j.ok)ACC.role=j.role;loadSave(j.ok?j.save:null)}catch(e){loadSave(null);toast(t('offline'),1)}return true}
function persist(){if(!S||!ACC)return;if(ACC.role=='admin')S.gold=RICH;S.ts=Date.now();LS.set(svKey(),S);if(ACC.mode=='cloud'&&ACC.role!='admin'){dirty=true;clearTimeout(pushT);pushT=setTimeout(push,1500)}}
async function push(leaving){if(!dirty||!ACC||ACC.mode!='cloud'||!S)return;dirty=false;clearTimeout(pushT);
 try{const r=await fetch('/api/save',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+ACC.tok},body:JSON.stringify({save:S}),keepalive:!!leaving});if(r.status==401){toast(t('errAuth'),1)}else if(!r.ok)dirty=true}catch(e){dirty=true}}
setInterval(()=>{if(dirty)push()},30000);addEventListener('pagehide',()=>push(1));
document.addEventListener('visibilitychange',()=>{if(document.hidden){push(1);if(run&&!R&&!paused&&!ovKind)UI.pause()}});

// ---- screens
let page='home',chapSel=0,stSel=1,heroSel=0,authMode='login',ovKind=null,lastRun=null,busy=false;
const show=id=>document.querySelectorAll('.scr').forEach(e=>e.classList.toggle('on',e.id==id));
const modal=id=>document.querySelectorAll('.modal').forEach(e=>e.classList.toggle('on',e.id==id));
function ov(kind,html){const o=$('ov');ovKind=kind;o.innerHTML=html||'';o.classList.toggle('on',!!kind)}
function toast(msg,bad){if(!msg)return;const d=document.createElement('div');d.textContent=msg;if(bad)d.className='bad';$('toast').appendChild(d);setTimeout(()=>d.remove(),3100)}
const chapName=i=>LANG=='vi'?CHAP[i].v:CHAP[i].n,bIcon=n=>(BUFFS.find(b=>b.n==n)||{}).ic||'✨',starStr=n=>'★'.repeat(n)+'<u>'+'★'.repeat(3-n)+'</u>';
function curStats(i){const c=CH[i],cm=charMul(c.n);return{hp:Math.round(c.hp*cm*(1+BON.hp*S.st.hp)),sh:Math.round(shOf(c)*(1+BON.sh*S.st.sh)),dm:Math.round((cm*(1+BON.dm*S.st.dm)-1)*100),sp:Math.round(c.sp*(1+BON.sp*S.st.sp))}}
function skillDesc(s){const a=[],d=s.k=='zone'?s.dps:s.k=='dash'?s.nova&&s.nova.dmg:['shield','heal','haste','blink'].includes(s.k)?0:s.dmg;if(d)a.push('⚔'+Math.round(d)+(s.n>1&&s.k!='orbit'&&s.k!='chain'?'×'+s.n:'')+(s.k=='zone'?'/s':s.k=='beam'?'/tick':''));if(s.heal||s.amt)a.push('✚'+(s.heal||s.amt));if(s.k=='shield')a.push('◍'+s.dur+'s');
 if(s.st||(s.nova&&s.nova.st))a.push('★');if(s.dot||(s.nova&&s.nova.dot))a.push('🔥');if(s.sl)a.push('❄');if(s.pierce)a.push('⇶');if(s.home)a.push('🎯');if(s.kb||s.pull||(s.nova&&s.nova.kb))a.push('↔');a.push('⏱'+s.cd+'s');return a.join(' ')}
function setSel(i){sel=i;S.sel=CH[i].n;heroSel=i;persist()}

function topBar(){const n=need(S.lvl),mx=S.lvl>=MAXL;$('top').innerHTML=`<div class="who"><img src="${portrait(sel,100)}" alt=""><span class="lv">${S.lvl}</span></div><div class="nmx"><b>${esc(ACC.name)}</b><span class="tag ${ACC.role=='admin'?'':ACC.mode=='cloud'?'cloud':'dev'}">${ACC.role=='admin'?'ADMIN':ACC.mode=='cloud'?'☁':'💾'}</span><div class="xp"><i style="width:${mx?100:Math.min(100,S.xp/n*100)}%"></i><span>${mx?'MAX':Math.floor(S.xp)+' / '+n+' XP'}</span></div></div><div class="gold">🪙 ${fmt(S.gold)}</div><button class="icb" data-a="settings" aria-label="${t('settings')}">⚙️</button>`}
const NAV=[['home','🏠','nHome'],['stages','🗺️','nStages'],['heroes','🦸','nHeroes'],['stats','💪','nStats'],['shop','🛒','nShop']];
function navBar(){const p=pts();$('nav').innerHTML=NAV.map(([k,ic,l])=>`<button class="${page==k?'on':''}" data-a="go" data-v="${k}"><span>${ic}</span>${t(l)}${k=='stats'&&p>0?`<i class="dot">${p}</i>`:k=='shop'&&dailyReady()?'<i class="dot">!</i>':''}</button>`).join('')}
function render(){if(!S)return;topBar();navBar();$('page').innerHTML=PAGES[page]()}
function dailyCard(){return dailyReady()?`<button class="btn sm green" data-a="daily">${t('claim',dailyAmt())}</button>`:`<span class="mut">${t('claimed',S.streak)}</span>`}
function buffRow(){return`<div class="pb">${S.pb.length?S.pb.map(n=>`<span title="${n}">${bIcon(n)}</span>`).join(''):`<span class="mut">${t('noBuff')}</span>`}</div>`}

const PAGES={
home(){const c=CH[sel],p=curStats(sel),stg=Math.min(S.stage,NSTAGE),pl=stagePlan(stg),done=S.stage>NSTAGE,rk=S.stage>3;
 return`<div class="home"><div class="card hero" style="--rc:${c.col}"><img src="${portrait(sel,300)}" alt=""><h2>${c.n}</h2><div class="sub">${c.t} · <span class="rar r${c.rar}">${t('rar'+c.rar)}</span> · Lv.${S.own[c.n]||1}</div>
 <div class="chips"><span class="chip">❤️ ${p.hp}</span><span class="chip">🛡️ ${p.sh}</span><span class="chip">⚔️ +${p.dm}%</span><span class="chip">👟 ${p.sp}</span></div><button class="btn sm blue" data-a="go" data-v="heroes">${t('change')}</button></div>
 <div class="modes"><button class="mode m-camp" data-a="playStage" data-v="${stg}"><span class="mi">🗺️</span><b>${t('campaign')}</b><small>${done?t('campDone'):t('stage')+' '+(pl.c+1)+'-'+pl.i+' · '+chapName(pl.c)}</small><em>${t('play')}</em></button>
 <button class="mode m-raid${rk?'':' lock'}" data-a="playRaid"><span class="mi">🏰</span><b>${t('raid')}</b><small>${rk?(S.raid?t('raidSub',Math.ceil(S.raid/5),(S.raid-1)%5+1):t('raidNew')):t('raidLock')}</small><em>${rk?t('play'):'🔒'}</em></button>
 <button class="mode m-pvp" data-a="arena"><span class="mi">⚔️</span><b>${t('arena')}</b><small>${t('arenaCard')}</small><em>${t('open')}</em></button>
 <div class="mini"><div class="card"><b>🎁 ${t('daily')}</b>${dailyCard()}</div><div class="card"><b>✨ ${t('nextBuffs')}</b>${buffRow()}</div></div></div></div>`},
stages(){const cs=chapSel,cp=CHAP[cs],lo=cs*10+1;if(stSel<lo||stSel>lo+9)stSel=clamp(S.stage,lo,lo+9);
 const pl=stagePlan(stSel),lock=stSel>S.stage,base=60+25*stSel,foes=[...new Set((pl.i==10?[chi(cp.boss)]:[]).concat(pl.rooms[0].pool))];
 return`<div><div class="chaps">${CHAP.map((c,i)=>{let g=0;for(let s=i*10+1;s<=i*10+10;s++)g+=S.stars[s]||0;return`<button class="chap ${i==cs?'on':''} ${S.stage<=i*10?'lock':''}" style="--cc:${c.col}" data-a="chap" data-v="${i}">${i+1}. ${chapName(i)}<small>★ ${g}/30</small></button>`}).join('')}</div>
 <div class="stg" style="--cc:${cp.col}">${Array.from({length:10},(_,k)=>{const s=lo+k,i=k+1;return`<button class="st ${s>S.stage?'lock':''} ${s==stSel?'on':''} ${s==S.stage?'cur':''}" data-a="stSel" data-v="${s}">${i==10?'<span class="bd">👑</span>':i==5?'<span class="bd">💀</span>':''}${cs+1}-${i}<span class="sr">${s>S.stage?'🔒':starStr(S.stars[s]||0)}</span></button>`}).join('')}</div>
 <div class="card sti"><div class="grow"><h3>${t('stage')} ${pl.c+1}-${pl.i} · ${chapName(cs)}</h3><div class="mut">${t('stInfo',pl.rooms.length)}${pl.i==10?' · 👑 '+cp.boss:''} · 🪙 ${40+12*stSel}+ · XP ${base}${S.stars[stSel]?'':' ('+t('first')+')'}<br>${t('stars3')}</div><div class="foes">${foes.map(i=>`<img src="${portrait(i,76)}" title="${CH[i].n}" alt="${CH[i].n}">`).join('')}</div></div>
 <button class="btn big${lock?' off':''}" data-a="playStage" data-v="${stSel}">${lock?'🔒 '+t('locked'):t('start')}</button></div></div>`},
heroes(){const c=CH[heroSel],lv=S.own[c.n]||0,sk=c.s,list=NORM.slice().sort((a,b)=>(S.own[CH[b].n]?1:0)-(S.own[CH[a].n]?1:0)||CH[a].rar-CH[b].rar);
 const acts=lv?`<button class="btn${heroSel==sel?' off':' green'}" data-a="pick">${heroSel==sel?t('using'):t('select')}</button>`+(lv<CMAX?`<button class="btn sm blue${S.gold<upCost(lv)?' off':''}" data-a="upChar">${t('upgrade',lv+1,fmt(upCost(lv)))}</button>`:`<button class="btn sm off">${t('maxed')}</button>`)
  :`<button class="btn${S.gold<PRICE[c.rar]?' off':''}" data-a="buyChar">${t('unlock',fmt(PRICE[c.rar]))}</button><span class="mut">${t('orChest')}</span>`;
 return`<div class="hsplit"><div><div class="hgrid">${list.map(i=>{const h=CH[i],o=S.own[h.n];return`<button class="hc ${o?'':'lock'} ${i==heroSel?'on':''} ${i==sel?'use':''}" style="--rc:var(--r${h.rar})" data-a="hero" data-v="${i}"><img loading="lazy" src="${portrait(i,128)}" alt=""><span>${h.n}</span>${o?`<span class="lvb">Lv${o}</span>`:''}</button>`}).join('')}</div><p class="mut" style="margin-top:10px">${t('owned',Object.keys(S.own).length,NORM.length)} · ${t('charNote')}</p></div>
 <div class="card hinfo"><img src="${portrait(heroSel,300)}" alt=""${lv?'':' style="filter:brightness(.35)"'}><div><h3 style="color:${c.col}">${c.n}</h3><div class="mut">${c.t} · <span class="rar r${c.rar}">${t('rar'+c.rar)}</span>${lv?' · Lv.'+lv+'/'+CMAX:''}</div><div class="chips" style="justify-content:inherit;margin:6px 0 0"><span class="chip">❤️ ${c.hp}</span><span class="chip">🛡️ ${shOf(c)}</span><span class="chip">👟 ${c.sp}</span></div></div>
 <div class="skl">${['a','q','e','r'].map(k=>`<kbd>${k=='a'?'ATK':k.toUpperCase()}</kbd><span>${IC[sk[k].k]||''} <b>${sk[k].nm}</b> <span class="mut">${skillDesc(sk[k])}</span></span>`).join('')}</div><div class="hact">${acts}</div></div></div>`},
stats(){const p=pts(),c=CH[sel],cur=curStats(sel),used=S.lvl-1-p,rows=[['hp','❤️','sHp','#ff6b7d'],['sh','🛡️','sSh','#a9dcff'],['dm','⚔️','sDm','#ffb02e'],['sp','👟','sSp','#7dffb0']];
 return`<div class="stats"><div class="card"><div class="ptl"><b>${t('level')} ${S.lvl}${S.lvl>=MAXL?' (MAX)':''}</b><span class="pp">${t('points')}: ${p}</span></div>
 ${rows.map(([k,ic,nm,col])=>{const v=S.st[k];return`<div class="srow" style="--sc:${col}"><span class="si">${ic}</span><div class="sn"><span>${t(nm)} <small>${v}/${SMAX}</small></span><small>+${Math.round(v*BON[k]*100)}%${v<SMAX?' → +'+Math.round((v+1)*BON[k]*100)+'%':''}</small></div><div class="pips">${Array.from({length:SMAX},(_,i)=>`<i${i<v?' class="f"':''}></i>`).join('')}</div><button class="btn sm green${p>0&&v<SMAX?'':' off'}" data-a="stat" data-v="${k}">+</button></div>`}).join('')}
 <div class="hact"><button class="btn sm ghost${used?'':' off'}" data-a="respec">${t('respec',RESPEC)}</button></div><p class="mut" style="margin-top:8px">${t('statNote')}</p></div>
 <div class="card"><h3 style="color:${c.col}">${c.n} · Lv.${S.own[c.n]||1}</h3><div class="kv" style="margin-top:8px"><span></span><i>${t('base')}</i><i>${t('now')}</i><span>❤️ ${t('sHp')}</span><i>${c.hp}</i><b>${cur.hp}</b><span>🛡️ ${t('sSh')}</span><i>${shOf(c)}</i><b>${cur.sh}</b><span>⚔️ ${t('sDm')}</span><i>100%</i><b>${100+cur.dm}%</b><span>👟 ${t('sSp')}</span><i>${c.sp}</i><b>${cur.sp}</b></div><p class="mut" style="margin-top:10px">${t('charNote')}</p></div></div>`},
shop(){const all=Object.keys(S.own).length>=NORM.length;
 return`<div><div class="shop">${[0,1].map(k=>`<div class="card item c${k+1}"><div class="big">${k?'💎':'🎁'}</div><h3>${t('chest'+(k+1))}</h3><p class="mut">${all?t('allOwned'):t('chest'+(k+1)+'d')}</p><button class="btn${all||S.gold<CHEST[k].cost?' off':''}" data-a="chest" data-v="${k}">🪙 ${CHEST[k].cost}</button></div>`).join('')}
 <div class="card item"><div class="big">🎲</div><h3>${t('lucky')}</h3><p class="mut">${t('luckyd')}</p>${buffRow()}<button class="btn purple${S.gold<LUCKY||S.pb.length>=3?' off':''}" data-a="lucky">🪙 ${LUCKY}</button></div>
 <div class="card item"><div class="big">📅</div><h3>${t('daily')}</h3><p class="mut">${t('dailyd')}</p>${dailyCard()}</div></div><p class="mut" style="margin-top:10px">${t('owned',Object.keys(S.own).length,NORM.length)}</p></div>`}};

function enterHub(){sel=chi(S.sel);if(sel<0||!NORM.includes(sel))sel=NORM[0];heroSel=sel;$('nm').value=ACC.name;chapSel=clamp((Math.min(S.stage,NSTAGE)-1)/10|0,0,CHAP.length-1);stSel=Math.min(S.stage,NSTAGE);page='home';show('s-hub');render();if(!LS.get('cb_seen',0)){LS.set('cb_seen',1);ACT.howto()}}
function spend(n){if(S.gold<n){toast(t('noGold'),1);sfx('err');return false}S.gold-=n;return true}
function roll(k){const un=NORM.filter(i=>!S.own[CH[i].n]);if(!un.length)return-1;const w=CHEST[k].w.map((x,r)=>un.some(i=>CH[i].rar==r)?x:0),tot=w.reduce((a,b)=>a+b,0);if(!tot)return un[Math.random()*un.length|0];
 let x=Math.random()*tot,r=0;while(x>=w[r]){x-=w[r];r++}const pool=un.filter(i=>CH[i].rar==r);return pool[Math.random()*pool.length|0]}
function reveal(i){const c=CH[i],b=$('md-x-body');b.className='sheet reveal';b.style.setProperty('--rc','var(--r'+c.rar+')');b.innerHTML=`<div class="ray"></div><div class="rar r${c.rar}">${t('newHero')} · ${t('rar'+c.rar)}</div><img src="${portrait(i,300)}" alt=""><h3>${c.n}</h3><div class="mut">${c.t}</div><div class="hact"><button class="btn green" data-a="useNew" data-v="${i}">${t('useNow')}</button><button class="btn ghost" data-a="close">OK</button></div>`;modal('md-x');sfx('win')}
function startRun(cfg){if(busy)return;lastRun=cfg;ov(null);modal(null);begin(false,0,0,cfg)}
// stage / raid payout
function reward(o){let gold=o.gold,xp=0,stars=0,best=false;
 if(o.mode=='stage'){const base=60+25*o.stage;if(o.win){stars=1+(o.revived?0:1)+(!o.revived&&o.hp>=.5?1:0);const old=S.stars[o.stage]||0;S.stars[o.stage]=Math.max(old,stars);gold+=40+12*o.stage+Math.max(0,stars-old)*30;xp=base*(old?1:2);if(S.stage<=o.stage)S.stage=Math.min(NSTAGE+1,o.stage+1)}
  else{gold=Math.round(gold*.6);xp=Math.round(base*.3*o.rooms/Math.max(1,o.total))}}
 else{xp=o.rooms*(25+15*o.floor);if(o.wave>S.raid){S.raid=o.wave;best=o.rooms>0}}
 S.gold+=gold;const up=addXp(xp);persist();return{gold,xp,stars,up,best}}

const ACT={
async start(){if(busy)return;busy=true;try{await Promise.race([probe(),new Promise(r=>setTimeout(r,3500))]);if(await resume())enterHub();else{ACT.authtab(authMode);show('s-auth')}}finally{busy=false}},
authtab(v){authMode=v;document.querySelectorAll('#authf .tab').forEach(b=>b.classList.toggle('on',b.dataset.v==v));$('ap2w').hidden=v!='register';$('ap').autocomplete=v=='register'?'new-password':'current-password';$('asub').textContent=t(v);$('aerr').textContent='';$('ahint').textContent=t(cloudOK?'hintCloud':'hintDev')},
guest(){ACC={name:'Guest'+(100+Math.random()*900|0),role:'user',mode:'guest'};const old=LS.get('cb_gname',null);if(old)ACC.name=old;else LS.set('cb_gname',ACC.name);LS.set('cb_acc',ACC);loadSave(null);enterHub()},
go(v){page=v;render();$('page').scrollTop=0},lang(){setLang(LANG=='vi'?'en':'vi')},close(){modal(null)},arena(){modal('md-arena')},
settings(){$('st-lang').value=LANG;$('st-vol').value=Math.round(SFX.vol*100);$('st-q').value=qset;$('st-admin').hidden=ACC.role!='admin';
 $('st-acc').innerHTML=`<b>${esc(ACC.name)}</b> · ${t(ACC.mode=='cloud'?'accCloud':ACC.mode=='device'?'accDev':'accGuest')}${ACC.mode=='guest'?`<br><button class="btn sm green" data-a="toAuth" style="margin-top:6px">${t('mkAcc')}</button>`:''}`;modal('md-set')},
toAuth(){modal(null);ACT.authtab('register');show('s-auth')},
logout(){push(1);ACC=null;S=null;LS.del('cb_acc');modal(null);$('au').value=$('ap').value=$('ap2').value='';ACT.authtab('login');show('s-auth')},
fullscreen(){try{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()}catch(e){}},
howto(){const b=$('md-x-body');b.className='sheet';b.innerHTML=`<button class="x" data-a="close">✕</button><h3>${t('howto')}</h3><p class="mut" style="font-size:14px;line-height:1.55">${t('howtoBody')}</p><button class="btn wide" data-a="close">OK</button>`;modal('md-x')},
playStage(v){const s=+v;if(!(s>=1&&s<=NSTAGE)||s>S.stage){toast(t('locked'),1);sfx('err');return}startRun({mode:'stage',stage:s})},
playRaid(){if(S.stage<=3){toast(t('raidLock'),1);sfx('err');return}startRun({mode:'raid'})},
chap(v){chapSel=+v;stSel=0;render()},stSel(v){stSel=+v;render()},hero(v){heroSel=+v;render()},
pick(){if(S.own[CH[heroSel].n]&&heroSel!=sel){setSel(heroSel);render()}},
useNew(v){setSel(+v);modal(null);render()},
upChar(){const n=CH[heroSel].n,lv=S.own[n];if(!lv||lv>=CMAX||!spend(upCost(lv)))return;S.own[n]=lv+1;persist();sfx('buy');toast(t('upDone',n,lv+1));render()},
buyChar(){const c=CH[heroSel];if(S.own[c.n]||!spend(PRICE[c.rar]))return;S.own[c.n]=1;persist();render();reveal(heroSel)},
stat(k){if(!(k in BON))return;if(pts()<=0){toast(t('noPts'),1);sfx('err');return}if(S.st[k]>=SMAX)return;S.st[k]++;persist();sfx('buy');render()},
respec(){if(ACC.role=='admin'||pts()>=S.lvl-1||!spend(RESPEC))return;S.st={hp:0,sh:0,dm:0,sp:0};persist();toast(t('respecDone'));render()},
chest(v){const k=+v;if(!CHEST[k])return;if(Object.keys(S.own).length>=NORM.length){toast(t('allOwned'));return}if(!spend(CHEST[k].cost))return;const i=roll(k);S.own[CH[i].n]=1;persist();heroSel=i;render();reveal(i)},
lucky(){if(S.pb.length>=3){toast(t('luckyFull'),1);sfx('err');return}if(!spend(LUCKY))return;const l=BUFFS.filter(b=>!b.run),b=l[Math.random()*l.length|0];S.pb.push(b.n);persist();sfx('buy');toast(t('got',b.ic+' '+b.n));render()},
daily(){if(!dailyReady())return;const a=dailyAmt();S.streak=nextStreak();S.daily=today();S.gold+=a;persist();sfx('buy');toast('🎁 +'+a+' 🪙');render()},
// in-game overlays
resume(){ov(null);paused=0},
quit(){ov(null);if(raid&&raid.state!='over')endRun(false);else leave('')},
retry(){if(lastRun)startRun(lastRun)},
next(){const s=lastRun&&lastRun.stage+1;if(s&&s<=NSTAGE&&s<=S.stage)startRun({mode:'stage',stage:s});else ACT.home()},
home(){ov(null);leave('')},toStats(){ov(null);page='stats';leave('')},
revive(){const r=raid;if(!r||r.revived||!spend(reviveCost(r)))return;persist();ov(null);sfx('heal');revive()},
giveup(){ov(null);endRun(false)},buff(v){pickBuff(+v)},
admin(){adminPanel()}};

// what the engine calls back into
const UI={
game(){ov(null);modal(null)},
home(msg){ov(null);modal(null);if(!S){show('s-auth');return}stSel=Math.min(S.stage,NSTAGE);chapSel=(stSel-1)/10|0;show('s-hub');render();toast(msg,1)},
pause(){if(!run)return;if(ovKind=='pause'){ACT.resume();return}if(ovKind)return;if(!R)paused=1;
 ov('pause',`<div class="panel"><h2>${t('paused')}</h2>${R?`<p class="mut">${t('onlineNoPause')}</p>`:''}<div class="col"><button class="btn big green" data-a="resume">${t('resume')}</button>${raid&&lastRun?`<button class="btn blue" data-a="retry">${t('restart')}</button>`:''}<button class="btn red" data-a="quit">${t('quit')}</button></div></div>`)},
choice(l){if(!l){if(ovKind=='choice')ov(null);return}ov('choice',`<div class="panel" style="width:min(640px,100%)"><h2>${t('chooseBuff')}</h2><div class="buffs">${l.map((b,i)=>`<button class="bf" data-a="buff" data-v="${i}"><span class="bi">${b.ic}</span>${b.n}<small>${LANG=='vi'?b.dv:b.d}</small><kbd>[ ${i+1} ]</kbd></button>`).join('')}</div></div>`)},
down(r){const cost=reviveCost(r),can=!r.revived&&S.gold>=cost;sfx('lose');ov('down',`<div class="panel"><h2 class="bad">${t('downed')}</h2><p class="mut">${r.revived?t('noRevive'):t('reviveQ')}</p><div class="col">${r.revived?'':`<button class="btn big green${can?'':' off'}" data-a="revive">${t('revive')} · 🪙 ${cost}</button>`}<button class="btn red" data-a="giveup">${t('giveup')}</button></div><div class="gold" style="align-self:center">🪙 ${fmt(S.gold)}</div></div>`)},
runEnd(o){const r=reward(o),st=o.mode=='stage',pl=st?stagePlan(o.stage):null,good=!st||o.win,mm=Math.floor(o.time/60),ss=String(Math.floor(o.time%60)).padStart(2,'0'),n=need(S.lvl),mx=S.lvl>=MAXL;sfx(r.up?'lvl':good&&(st||r.best)?'win':'lose');
 const btns=st?(o.win?(o.stage<NSTAGE?`<button class="btn big green" data-a="next">${t('nextStage')}</button>`:'')+`<button class="btn blue" data-a="retry">${t('again')}</button>`:`<button class="btn big" data-a="retry">${t('retry')}</button><button class="btn purple" data-a="toStats">${t('toStats')}</button>`):`<button class="btn big" data-a="retry">${t('again')}</button>`;
 ov('result',`<div class="panel"><h2 class="${good?'':'bad'}">${st?t(o.win?'victory':'defeat'):t('raidOver')}</h2>${st&&o.win?`<div class="stars">${[1,2,3].map(i=>`<span class="${i<=r.stars?'f':''}">★</span>`).join('')}</div>`:''}
 <div class="mut">${st?t('stage')+' '+(pl.c+1)+'-'+pl.i+' · '+chapName(pl.c):t('raidReach',o.floor,o.room)+(r.best?' · 🏆 '+t('newBest'):'')}</div>
 <div class="rw"><div><small>${t('gold')}</small>🪙 +${fmt(r.gold)}</div><div><small>XP</small>⭐ +${fmt(r.xp)}</div><div><small>${t('kills')}</small>💀 ${o.kills}</div><div><small>${t('time')}</small>⏱ ${mm}:${ss}</div></div>
 ${r.up?`<div class="lvup">🎉 ${t('lvup',S.lvl,r.up,50*r.up)}</div>`:''}<div class="xp" style="max-width:none"><i style="width:${mx?100:Math.min(100,S.xp/n*100)}%"></i><span>${t('level')} ${S.lvl} · ${mx?'MAX':Math.floor(S.xp)+' / '+n+' XP'}</span></div>
 ${st&&!o.win?`<p class="mut">${t('failTip')}</p>`:''}<div class="col">${btns}<button class="btn ghost" data-a="home">${t('toHub')}</button></div></div>`)},
// deathmatch win (not training or couch play)
pvpEnd(win,online,skip){if(!win||skip||!S)return;const g=online?60:30,x=online?100:50;S.gold+=g;S.wins++;const up=addXp(x);persist();toast(t('pvpWin',g,x));if(up){sfx('lvl');toast('🎉 '+t('lvup',S.lvl,up,50*up))}}};

// ---- admin: list players and edit their saves (cloud accounts through /api/admin, device accounts straight from storage)
const ADM={
 async list(){if(ACC.mode=='cloud'){const j=await api('admin',{act:'list'});if(!j.ok)throw new Error(j.err);return j.users}
  const u=LS.get('cb_users',{});return Object.keys(u).map(k=>Object.assign({name:u[k].name},LS.get('cb_sv_d_'+k,fresh())))},
 async get(name){if(ACC.mode=='cloud'){const j=await api('admin',{act:'get',name});return j.ok?j.save:null}return LS.get('cb_sv_d_'+name.toLowerCase(),null)},
 async put(name,save){if(ACC.mode=='cloud')return(await api('admin',{act:'put',name,save})).ok;LS.set('cb_sv_d_'+name.toLowerCase(),save);return true},
 async del(name){if(ACC.mode=='cloud')return(await api('admin',{act:'del',name})).ok;const u=LS.get('cb_users',{});delete u[name.toLowerCase()];LS.set('cb_users',u);LS.del('cb_sv_d_'+name.toLowerCase());return true},
 async pass(name,pass){if(ACC.mode=='cloud')return(await api('admin',{act:'pass',name,pass})).ok;const u=LS.get('cb_users',{}),k=name.toLowerCase();if(!u[k])return false;u[k].hash=await kdf(pass,u[k].salt,60000)||weak(pass,u[k].salt);LS.set('cb_users',u);return true}};
async function adminPanel(){if(!ACC||ACC.role!='admin')return;const b=$('md-x-body');b.className='sheet wide-sheet';b.innerHTML=`<button class="x" data-a="close">✕</button><h3>${t('admTitle')}</h3><p class="mut">${t('wait')}</p>`;modal('md-x');
 let users;try{users=await ADM.list()}catch(e){b.querySelector('p').textContent=t('errNet');return}
 b.innerHTML=`<button class="x" data-a="close">✕</button><h3>${t('admTitle')}</h3>`+(users.length?`<div style="overflow:auto"><table><tr><th>${t('name')}</th><th>Lv</th><th>🪙</th><th>${t('stage')}</th><th>${t('heroes')}</th><th></th></tr>${users.map(u=>`<tr><td><b>${esc(u.name)}</b></td><td>${u.lvl|0}</td><td>${fmt(u.gold||0)}</td><td>${Math.min(NSTAGE,u.stage|0)}</td><td>${Object.keys(u.own||{}).length}/${NORM.length}</td><td>${[['gold','admGold','green'],['all','admAll','blue'],['max','admMax','purple'],['pass','admPass','ghost'],['reset','admReset','ghost'],['del','admDel','red']].map(([a,l,c])=>`<button class="btn sm ${c}" data-adm="${a}" data-n="${esc(u.name)}">${t(l)}</button>`).join('')}</td></tr>`).join('')}</table></div>`:`<p class="mut">${t('admNone')}</p>`)}
async function adminDo(act,name){if(!ACC||ACC.role!='admin')return;let ok=false;
 try{if(act=='del'){if(!confirm(t('admSure',name)))return;ok=await ADM.del(name)}
  else if(act=='pass'){const p=prompt(t('admNewPass',name));if(p==null)return;if(p.length<6){toast(t('errPass'),1);return}ok=await ADM.pass(name,p)}
  else if(act=='reset')ok=await ADM.put(name,fresh());
  else{const s=fix(await ADM.get(name));if(act=='gold')s.gold=Math.min(RICH,s.gold+5000);if(act=='all'||act=='max')for(const i of NORM)s.own[CH[i].n]=act=='max'?CMAX:s.own[CH[i].n]||1;if(act=='max'){s.lvl=MAXL;s.xp=0;s.st={hp:SMAX,sh:SMAX,dm:SMAX,sp:SMAX};s.stage=NSTAGE+1}s.ts=Date.now();ok=await ADM.put(name,s)}}catch(e){}
 toast(ok?t('admOk',name):t('errNet'),!ok);if(ok)sfx('buy');adminPanel()}

// ---- wiring
document.addEventListener('click',e=>{const a=e.target.closest('[data-adm]');if(a){adminDo(a.dataset.adm,a.dataset.n);return}const b=e.target.closest('[data-a]');if(!b)return;const f=ACT[b.dataset.a];if(f){if(!b.classList.contains('off'))sfx('ui');f(b.dataset.v,b)}});
document.querySelectorAll('.modal').forEach(m=>m.addEventListener('pointerdown',e=>{if(e.target===m&&m.id!='md-x')modal(null)}));
$('authf').addEventListener('submit',async e=>{e.preventDefault();if(busy)return;const name=$('au').value.trim(),pass=$('ap').value,er=$('aerr');
 if(!NAME_RE.test(name)){er.textContent=t('errName');return}if(pass.length<6){er.textContent=t('errPass');return}if(authMode=='register'&&pass!==$('ap2').value){er.textContent=t('errPass2');return}
 busy=true;er.textContent='';$('asub').textContent=t('wait');let err;try{err=await doAuth(authMode,name,pass)}catch(x){err='errNet'}busy=false;$('asub').textContent=t(authMode);
 if(err){er.textContent=TX.en[err]?t(err):t('errNet');sfx('err');return}$('ap').value=$('ap2').value='';enterHub()});
function setLang(l){LANG=l;LS.set('cb_lang',l);applyLang();$('cloudtag').textContent=t(cloudOK?'tagCloud':'tagDev');document.querySelectorAll('.lang').forEach(b=>{b.textContent=l=='vi'?'🌐 English':'🌐 Tiếng Việt'});ACT.authtab(authMode);render()}
$('st-lang').onchange=e=>{setLang(e.target.value);ACT.settings()};
$('st-vol').oninput=e=>{SFX.vol=e.target.value/100;LS.set('cb_vol',SFX.vol)};$('st-vol').onchange=()=>sfx('coin');
$('st-q').onchange=e=>{qset=+e.target.value;LS.set('cb_q',qset);qa.lock=qa.trial=0;setQ(qset<0?(touch?1:0):qset)};
$('aa').onchange=e=>LS.set('cb_aa',e.target.checked?1:0);
// boot
qset=LS.get('cb_q',-1);setQ(qset<0?(touch?1:0):qset);$('aa').checked=!!LS.get('cb_aa',1);setLang(LANG);
$('parade').innerHTML=NORM.slice().sort(()=>Math.random()-.5).slice(0,innerWidth<520?3:5).map(i=>`<img src="${portrait(i,168)}" alt="">`).join('');
probe();
