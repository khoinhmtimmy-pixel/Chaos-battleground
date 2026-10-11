const CH=[
{n:'Ren',t:'Wall Scout',col:'#8fd18a',hair:'#2b4a2a',acc:'scarf',hp:95,sp:245,pas:{x3:1.8,n:8,heal:.1},s:{
a:{k:'proj',cd:.35,spd:600,r:7,dmg:7,life:.35,nm:'Twin Blades'},
q:{k:'proj',cd:4,n:3,spread:.6,spd:560,r:10,dmg:12,life:.4,nm:'Blade Fan'},
e:{k:'dash',cd:4,dist:360,nova:{r:70,dmg:16,st:.3},hst:.7,nm:'Grapple Hook'},
r:{k:'nova',cd:15,r:165,dmg:44,delay:.5,form:{dur:9,mul:1.7,hp:.9,sh:.5,hst:9},nm:'Titan Form'}}},
{n:'Monko',t:'Rubber Pirate',col:'#ff5a4d',hair:'#3a1f1f',acc:'hat',hp:120,sp:205,s:{
a:{k:'proj',cd:.45,spd:850,r:9,dmg:9,life:.25,nm:'Stretch Punch'},
q:{k:'proj',cd:4,n:7,spread:.7,spd:720,r:7,dmg:6,life:.3,nm:'Fist Barrage'},
e:{k:'dash',cd:5,dist:260,nova:{r:70,dmg:16},nm:'Rubber Rocket'},
r:{k:'proj',cd:14,spd:380,r:46,dmg:44,life:.9,nm:'Giant Fist'}}},
{n:'Kuro',t:'Three-Sword Hunter',col:'#5fb0ff',hair:'#1b2a55',acc:'band',hp:105,sp:225,s:{
a:{k:'proj',cd:.4,spd:540,r:9,dmg:8,life:.45,nm:'Slash Wave'},
q:{k:'nova',cd:5,r:105,dmg:22,delay:.2,nm:'Demon Cyclone'},
e:{k:'dash',cd:5,dist:230,nova:{r:55,dmg:12},nm:'Shadow Dash'},
r:{k:'proj',cd:14,n:3,spread:.35,spd:700,r:16,dmg:22,life:.7,nm:'Triple Dragon'}}},
{n:'Nara',t:'Storm Navigator',col:'#ffd94d',hair:'#e08a1e',acc:'star',hp:90,sp:220,s:{
a:{k:'proj',cd:.4,spd:620,r:7,dmg:7,life:.7,nm:'Spark Bolt'},
q:{k:'nova',cd:5,cur:1,r:90,dmg:26,delay:.7,nm:'Thunder Cloud'},
e:{k:'blink',cd:6,dist:240,to:1,nm:'Mirage Step'},
r:{k:'proj',cd:14,spd:230,r:42,dmg:42,life:2.5,sl:2,nm:'Tornado'}}},
{n:'Kaen',t:'Flame Swordsman',col:'#ff6a3c',hair:'#d84a1a',acc:'horn',hp:110,sp:210,s:{
a:{k:'proj',cd:.45,spd:520,r:9,dmg:8,life:.5,nm:'Fire Slash'},
q:{k:'proj',cd:4,n:3,spread:.5,spd:480,r:12,dmg:14,life:.6,nm:'Fire Fan'},
e:{k:'dash',cd:5,dist:220,nova:{r:70,dmg:16},nm:'Flame Dash'},
r:{k:'nova',cd:14,r:150,dmg:40,delay:.5,nm:'Phoenix Burst'}}},
{n:'Yuki',t:'Frost Mage',col:'#6fd3ff',hair:'#cfefff',acc:'bow',hp:90,sp:200,s:{
a:{k:'proj',cd:.5,spd:460,r:9,dmg:7,life:.9,sl:.6,nm:'Ice Bolt'},
q:{k:'nova',cd:6,r:120,dmg:12,delay:.15,sl:2,nm:'Frost Nova'},
e:{k:'blink',cd:6,dist:200,nm:'Snow Step'},
r:{k:'proj',cd:14,spd:200,r:40,dmg:45,life:3,sl:2,nm:'Absolute Zero'}}},
{n:'Raiden',t:'Lightning Ninja',col:'#ffe14d',hair:'#e6c200',acc:'mask',hp:90,sp:250,s:{
a:{k:'proj',cd:.3,spd:640,r:6,dmg:6,life:.6,nm:'Shuriken'},
q:{k:'proj',cd:4,n:5,spread:.8,spd:600,r:7,dmg:8,life:.6,nm:'Kunai Storm'},
e:{k:'blink',cd:5,dist:280,to:1,nm:'Shadow Step'},
r:{k:'nova',cd:14,cur:1,r:95,dmg:45,delay:.8,nm:'Thunder Judgment'}}},
{n:'Sakura',t:'Spirit Archer',col:'#ff8fd0',hair:'#ff8fd0',acc:'bow',hp:100,sp:220,s:{
a:{k:'proj',cd:.5,spd:700,r:6,dmg:9,life:.8,nm:'Spirit Arrow'},
q:{k:'proj',cd:5,spd:950,r:16,dmg:26,life:.9,nm:'Spirit Beam'},
e:{k:'shield',cd:9,dur:2,nm:'Sakura Barrier'},
r:{k:'proj',cd:14,n:12,spread:6.3,spd:320,r:9,dmg:12,life:1.4,nm:'Cherry Storm'}}},
{n:'Shion',t:'Shadow Assassin',col:'#a06bff',hair:'#2a1a4a',acc:'mask',hp:85,sp:255,s:{
a:{k:'proj',cd:.28,spd:640,r:6,dmg:6,life:.3,nm:'Dagger Throw'},
q:{k:'proj',cd:4,n:3,spread:.5,spd:600,r:8,dmg:11,life:.5,nm:'Shadow Fan'},
e:{k:'blink',cd:5,dist:300,to:1,nm:'Umbral Step'},
r:{k:'nova',cd:14,cur:1,r:80,dmg:40,delay:.5,nm:'Assassinate'}}},
{n:'Aoi',t:'Water Priestess',col:'#4fd6c8',hair:'#2a8fa8',acc:'halo',hp:95,sp:215,s:{
a:{k:'proj',cd:.45,spd:520,r:9,dmg:7,life:.8,sl:.6,nm:'Water Shot'},
q:{k:'proj',cd:5,spd:400,r:26,dmg:15,life:.8,sl:.8,nm:'Tide Wave'},
e:{k:'shield',cd:9,dur:2.5,nm:'Bubble Veil'},
r:{k:'heal',cd:16,amt:45,nm:'Healing Rain'}}},
{n:'Gaia',t:'Earth Brawler',col:'#b0824a',hair:'#5a3a1a',acc:'horn',hp:135,sp:190,s:{
a:{k:'proj',cd:.5,spd:480,r:12,dmg:10,life:.3,nm:'Rock Punch'},
q:{k:'nova',cd:5,r:110,dmg:24,delay:.35,nm:'Quake'},
e:{k:'dash',cd:5,dist:200,nova:{r:80,dmg:18},nm:'Boulder Rush'},
r:{k:'nova',cd:15,cur:1,r:130,dmg:44,delay:1,nm:'Meteor Drop'}}},
{n:'Hikari',t:'Holy Knight',col:'#ffee99',hair:'#fff2b0',acc:'halo',hp:110,sp:210,s:{
a:{k:'proj',cd:.4,spd:700,r:7,dmg:8,life:.55,nm:'Light Lance'},
q:{k:'proj',cd:5,n:4,spread:6.3,spd:500,r:9,dmg:12,life:.6,nm:'Holy Cross'},
e:{k:'shield',cd:9,dur:1.8,nm:'Aegis'},
r:{k:'proj',cd:14,spd:800,r:30,dmg:38,life:1,nm:'Judgement Beam'}}},
{n:'Zephyr',t:'Wind Rogue',col:'#9dffb8',hair:'#7fe0a0',acc:'star',hp:90,sp:260,s:{
a:{k:'proj',cd:.28,spd:620,r:6,dmg:6,life:.45,nm:'Wind Blade'},
q:{k:'proj',cd:4,n:5,spread:.9,spd:520,r:7,dmg:7,life:.45,nm:'Gale Fan'},
e:{k:'dash',cd:4.5,dist:300,nova:{r:50,dmg:10},nm:'Gust Dash'},
r:{k:'nova',cd:14,r:160,dmg:30,delay:.5,sl:1.5,nm:'Cyclone'}}},
{n:'Noir',t:'Dark Sorcerer',col:'#9a5bff',hair:'#3a1a5a',acc:'crown',hp:90,sp:200,s:{
a:{k:'proj',cd:.5,spd:380,r:12,dmg:10,life:1.1,nm:'Shadow Orb'},
q:{k:'nova',cd:5,cur:1,r:100,dmg:26,delay:.8,nm:'Void Pit'},
e:{k:'blink',cd:6,dist:220,nm:'Void Step'},
r:{k:'proj',cd:15,spd:160,r:36,dmg:50,life:3.5,sl:2,nm:'Black Hole'}}},
{n:'Neko',t:'Cat Striker',col:'#ffb36b',hair:'#e8964a',acc:'ears',hp:95,sp:245,s:{
a:{k:'proj',cd:.25,spd:560,r:7,dmg:6,life:.25,nm:'Claw Slash'},
q:{k:'proj',cd:4,n:6,spread:1,spd:520,r:6,dmg:6,life:.3,nm:'Claw Storm'},
e:{k:'dash',cd:4.5,dist:260,nova:{r:55,dmg:12},nm:'Pounce'},
r:{k:'nova',cd:14,r:120,dmg:34,delay:.4,nm:'Frenzy'}}},
{n:'Ryuu',t:'Dragon Monk',col:'#ff9a2b',hair:'#8a1a1a',acc:'band',hp:115,sp:215,s:{
a:{k:'proj',cd:.4,spd:640,r:10,dmg:9,life:.4,nm:'Dragon Fist'},
q:{k:'proj',cd:4,n:3,spread:.4,spd:460,r:12,dmg:14,life:.7,nm:'Dragon Fire'},
e:{k:'dash',cd:5,dist:240,nova:{r:65,dmg:16},nm:'Dragon Leap'},
r:{k:'proj',cd:14,spd:520,r:34,dmg:40,life:1.1,sl:.8,nm:'Dragon Roar'}}}];
CH.push(...ROSTER);
// Vaen: relentless close-range skirmisher. Fastest basic attack in the game, grapples and
// gas bursts for repositioning, and an ultimate that surrounds him with a ring of blades.
CH.push({n:'Vaen',t:'Blade Captain',col:'#cbd5e1',hair:'#0f172a',acc:'mask',hp:90,sp:265,pas:{ba:1,n:10,heal:.12},s:{
 a:{k:'cone',cd:.22,r:68,arc:1.5,dmg:7,nm:'Whirl Cut'},
 q:{k:'dash',cd:3.5,dist:330,nova:{r:60,dmg:18},hst:.5,nm:'Cable Rush'},
 e:{k:'blink',cd:3,dist:340,to:1,hst:1.6,nm:'Gas Burst'},
 r:{k:'orbit',cd:13,n:7,rad:92,dur:7,dmg:13,nm:'Blade Cyclone'}}});
const MOD={Ren:{a:{kb:20},q:{n:1,spread:0,spd:820,dmg:8,life:.5,nm:'Grapple Pull',kb:-90},r:{st:.8}},
Monko:{a:{kb:25},r:{kb:170}},Kuro:{q:{kb:70},r:{pierce:1}},Nara:{q:{st:.6},r:{kb:-60}},
Kaen:{a:{dot:{d:4,t:2}},q:{dot:{d:4,t:2}},e:{nova:{r:70,dmg:16,dot:{d:5,t:2}}},r:{dot:{d:8,t:3}}},
Yuki:{q:{st:.7},r:{pierce:1}},Raiden:{q:{home:1,nm:'Homing Kunai'},r:{st:1}},
Sakura:{a:{home:1},q:{pierce:1,spd:1200,r:14},r:{home:1,life:2.2,spd:260}},Shion:{q:{pierce:1},r:{st:.7}},
Aoi:{q:{pierce:1,kb:40}},Gaia:{q:{kb:100},r:{st:1}},Hikari:{q:{pierce:1,n:6},r:{pierce:1}},
Zephyr:{e:{k:'haste',dur:3,nm:'Wind Rush'},q:{kb:60},r:{kb:-130}},
Noir:{a:{dot:{d:3,t:2}},q:{kb:-110},r:{pierce:1,dot:{d:6,t:3}}},
Neko:{q:{home:1},r:{k:'haste',dur:4,sh:1.5,nm:'Wild Rush'}},Ryuu:{a:{kb:30},q:{dot:{d:4,t:2}},r:{pierce:1,kb:110}}};
Object.entries({
Ren:{a:{k:'cone',r:75,arc:1.7,dmg:9,cd:.35,nm:'Twin Blades'}},
Monko:{q:{k:'cone',r:135,arc:.7,dmg:16,kb:60,cd:4,nm:'Gum Whip'}},
Kuro:{a:{k:'cone',r:80,arc:1.4,dmg:8,cd:.4,nm:'Slash'},q:{k:'cone',r:105,arc:6.3,dmg:22,kb:70,cd:5,nm:'Demon Cyclone'}},
Nara:{q:{k:'rain',cur:1,n:5,rad:90,r:34,dmg:11,gap:.25,cd:6,nm:'Thunder Rain'}},
Kaen:{q:{k:'beam',len:190,w:34,dur:1.2,dmg:4,cd:5,nm:'Flamethrower'}},
Yuki:{q:{k:'mine',r:85,dmg:14,st:.9,sl:2,cd:5,nm:'Ice Trap'},r:{k:'zone',cur:1,r:150,dur:4,dps:8,sl:1,cd:14,nm:'Blizzard'}},
Raiden:{q:{k:'chain',n:3,rng:270,dmg:14,st:.3,cd:5,nm:'Chain Lightning'}},
Sakura:{q:{k:'beam',len:520,w:16,dur:.8,dmg:5,cd:5,nm:'Spirit Beam'}},
Aoi:{r:{k:'zone',r:115,dur:4,heal:10,cd:16,nm:'Healing Rain'}},
Gaia:{a:{k:'cone',r:65,arc:1.5,dmg:12,kb:40,cd:.5,nm:'Rock Punch'},q:{k:'zone',cur:1,r:95,dur:2.5,dps:9,sl:1,cd:6,nm:'Fissure'}},
Hikari:{q:{k:'cone',r:115,arc:2.4,dmg:18,kb:40,cd:5,nm:'Crescent Slash'},r:{k:'beam',len:600,w:50,dur:1.2,dmg:5,cd:14,nm:'Judgement Beam'}},
Noir:{r:{k:'zone',cur:1,r:130,dur:3.5,pull:150,dps:12,sl:1,cd:15,nm:'Black Hole'}},
Neko:{a:{k:'cone',r:65,arc:1.5,dmg:7,cd:.25,nm:'Claw Slash'}},
Ryuu:{a:{k:'cone',r:70,arc:1.3,dmg:9,cd:.4,nm:'Dragon Fist'},q:{k:'beam',len:200,w:40,dur:1,dmg:4,dot:{d:4,t:2},cd:4,nm:'Dragon Breath'}}
}).forEach(([n,m])=>{const c=CH.find(c=>c.n==n);for(const k in m)Object.assign(c.s[k],m[k])});
Object.entries({
Shion:{q:{k:'mine',r:75,dmg:24,st:.6,cd:6,nm:'Shadow Trap'},r:{k:'rain',cur:1,n:7,rad:110,r:36,dmg:14,gap:.12,cd:14,nm:'Kunai Rain'}},
Aoi:{q:{k:'orbit',n:2,rad:50,dur:4,dmg:9,cd:6,nm:'Water Orbs'}},
Zephyr:{q:{k:'cone',r:110,arc:2,dmg:14,kb:90,cd:4,nm:'Gale Slash'},r:{k:'zone',r:140,dur:3,pull:200,dps:10,sl:1,cd:14,nm:'Cyclone'}},
Noir:{q:{k:'chain',n:4,rng:280,dmg:12,st:.3,cd:5,nm:'Soul Chain'}},
Sakura:{r:{k:'rain',cur:1,n:8,rad:130,r:34,dmg:10,gap:.1,cd:14,nm:'Petal Rain'}},
Raiden:{r:{k:'beam',len:500,w:30,dur:.9,dmg:6,st:.2,cd:14,nm:'Thunder Beam'}}
}).forEach(([n,m])=>{const c=CH.find(c=>c.n==n);for(const k in m)c.s[k]=m[k]});
CH.push(
{n:'Bram',t:'Scrap Shotgunner',col:'#e8833a',hair:'#4a2a1a',acc:'band',hp:120,sp:205,s:{
a:{k:'proj',n:5,spread:.55,spd:560,r:6,dmg:5,life:.28,cd:.6,nm:'Scatter Shot'},
q:{k:'proj',n:8,spread:1.1,spd:520,r:7,dmg:6,life:.3,kb:70,cd:5,nm:'Shell Burst'},
e:{k:'dash',cd:5,dist:200,nova:{r:70,dmg:14,kb:80},nm:'Shoulder Charge'},
r:{k:'proj',n:3,spread:.3,spd:700,r:20,dmg:30,life:.5,pierce:1,kb:120,cd:14,nm:'Super Slug'}}},
{n:'Dex',t:'Bomb Thrower',col:'#d9534f',hair:'#222222',acc:'hat',hp:90,sp:210,s:{
a:{k:'rain',cur:1,n:1,rad:0,r:55,dmg:12,gap:0,cd:.9,nm:'Lobbed Bomb'},
q:{k:'mine',r:80,dmg:26,st:.5,cd:6,nm:'Sticky Mine'},
e:{k:'blink',dist:220,to:1,cd:6,nm:'Rocket Hop'},
r:{k:'rain',cur:1,n:6,rad:120,r:50,dmg:16,gap:.1,cd:14,nm:'Bomb Barrage'}}},
{n:'Vesper',t:'Long-range Sniper',col:'#6ee7b7',hair:'#1b4a3a',acc:'bow',hp:80,sp:215,s:{
a:{k:'proj',spd:1100,r:7,dmg:14,life:.8,cd:1,nm:'Sniper Shot'},
q:{k:'beam',len:560,w:12,dur:.1,dmg:28,cd:5,nm:'Piercing Bolt'},
e:{k:'blink',dist:260,cd:5,nm:'Smoke Step'},
r:{k:'nova',cur:1,r:110,dmg:34,delay:.9,st:.8,cd:14,nm:'Marked Shot'}}},
{n:'Tusk',t:'Heavy Brawler',col:'#a78bfa',hair:'#3a2a5a',acc:'horn',hp:150,sp:190,s:{
a:{k:'cone',r:70,arc:1.8,dmg:12,kb:30,cd:.5,nm:'Haymaker'},
q:{k:'orbit',n:3,rad:48,dur:3.5,dmg:8,cd:7,nm:'Spinning Fists'},
e:{k:'dash',cd:5,dist:240,nova:{r:80,dmg:18,st:.4},nm:'Bull Rush'},
r:{k:'nova',r:150,dmg:36,delay:.6,st:1,cd:15,nm:'Ground Pound'}}},
{n:'Pip',t:'Healer Support',col:'#f9a8d4',hair:'#ff9bd0',acc:'halo',hp:90,sp:220,s:{
a:{k:'proj',spd:520,r:8,dmg:6,life:.8,home:1,cd:.45,nm:'Magic Note'},
q:{k:'zone',r:100,dur:4,heal:12,cd:7,nm:'Heal Aura'},
e:{k:'shield',dur:2,cd:8,nm:'Sparkle Shield'},
r:{k:'heal',amt:40,cd:15,nm:'Full Heal'}}},
{n:'Vex',t:'Shadow Assassin',col:'#64748b',hair:'#0f172a',acc:'mask',hp:75,sp:265,s:{
a:{k:'cone',r:55,arc:1.6,dmg:7,cd:.25,nm:'Twin Daggers'},
q:{k:'dash',dist:260,nova:{r:60,dmg:16},cd:4,nm:'Shadow Slash'},
e:{k:'blink',dist:240,to:1,cd:5,nm:'Vanish'},
r:{k:'haste',dur:5,sh:1,cd:14,nm:'Bloodlust'}}},
{n:'Rook',t:'Engineer',col:'#fbbf24',hair:'#5a4a1a',acc:'band',hp:100,sp:210,s:{
a:{k:'proj',spd:620,r:6,dmg:6,life:.6,cd:.3,nm:'Rivet Gun'},
q:{k:'orbit',n:2,rad:60,dur:5,dmg:7,cd:7,nm:'Saw Drones'},
e:{k:'mine',r:70,dmg:22,st:.4,cd:5,nm:'Spike Trap'},
r:{k:'beam',len:480,w:26,dur:.9,dmg:7,cd:14,nm:'Mega Laser'}}},
{n:'Zig',t:'Chain Mage',col:'#38bdf8',hair:'#e0f2fe',acc:'star',hp:90,sp:215,s:{
a:{k:'chain',n:2,rng:240,dmg:7,cd:.6,nm:'Zap'},
q:{k:'rain',cur:1,n:4,rad:90,r:40,dmg:12,gap:.12,cd:6,nm:'Storm Strike'},
e:{k:'blink',dist:200,cd:6,nm:'Static Jump'},
r:{k:'zone',cur:1,r:140,dur:4,dps:12,sl:1,cd:14,nm:'Thunder Field'}}},
{n:'Pyra',t:'Fire Thrower',col:'#fb923c',hair:'#b91c1c',acc:'ears',hp:105,sp:215,s:{
a:{k:'proj',n:2,spread:.2,spd:480,r:9,dmg:4,life:.32,dot:{d:4,t:2},cd:.2,nm:'Flame Jet'},
q:{k:'zone',cur:1,r:90,dur:3,dps:12,cd:6,nm:'Fire Pool'},
e:{k:'dash',dist:220,nova:{r:60,dmg:12,dot:{d:6,t:2}},cd:5,nm:'Fire Dash'},
r:{k:'beam',len:420,w:34,dur:1.2,dmg:8,cd:14,nm:'Inferno'}}});
const wl=(a,b,c,d,r=20)=>{const n=Math.max(1,Math.round(Math.hypot(c-a,d-b)/(r*1.5)));return Array.from({length:n+1},(_,i)=>[a+(c-a)*i/n,b+(d-b)*i/n,r])};
const MAPS=[
{n:'Tide Island',sea:['#0e7ab0','#0a3d78'],rim:'#b98f55',sand:['#f6e3a8','#e0bf78'],rock:['#a3a9c4','#464c6e'],pil:[[300,200,38],[600,200,38],[300,400,38],[600,400,38],[450,300,30]]},
{n:'Open Beach',sea:['#19a3c9','#0b5a99'],rim:'#c9a46a',sand:['#fff0bf','#ecd08c'],rock:['#b9b0a0','#6d655a'],pil:[[450,300,34]]},
{n:'Rock Maze',sea:['#0e6a8f','#0a3558'],rim:'#a07a45',sand:['#e9cf92','#cfa966'],rock:['#9a9aa8','#3f4057'],pil:[[250,150,32],[650,150,32],[250,450,32],[650,450,32],[450,200,28],[450,400,28],[150,300,28],[750,300,28],[350,300,24],[550,300,24]]},
{n:'Crossroads',sea:['#2a7a9a','#17406a'],rim:'#8a6a3a',sand:['#dcc88e','#bfa468'],rock:['#a99c85','#5a4d3a'],pil:[...wl(240,300,390,300),...wl(510,300,660,300),...wl(450,120,450,210),...wl(450,390,450,490)]},
{n:'Four Forts',sea:['#0f8ab0','#0b4a88'],rim:'#b0864e',sand:['#f1dca0','#d9b672'],rock:['#aab0c8','#4a5272'],pil:[...wl(190,170,280,170),...wl(190,170,190,250),...wl(620,170,710,170),...wl(710,170,710,250),...wl(190,430,190,510),...wl(190,510,280,510),...wl(710,430,710,510),...wl(620,510,710,510)]},
{n:'Lava Pit',sea:['#7a1a0a','#2a0a05'],rim:'#5a2a1a',sand:['#4a3a38','#2c2220'],rock:['#d4562a','#6a1a0a'],pil:Array.from({length:8},(_,i)=>[450+Math.cos(i*.7854)*130,300+Math.sin(i*.7854)*130,24])},
{n:'Frozen Lake',sea:['#6ab8e8','#2a6aa8'],rim:'#cfe8f7',sand:['#eaf6ff','#c3e0f3'],rock:['#e8f6ff','#7aa8c8'],pil:[[200,300,34],[700,300,34],[450,170,30],[450,430,30],[330,250,22],[570,350,22]]},
{n:'Jungle Ruins',sea:['#1f7a5a','#0a3a30'],rim:'#5a7a3a',sand:['#a8c868','#7aa048'],rock:['#9aa88a','#3a4a3a'],pil:[...wl(230,230,370,370),...wl(530,370,670,230),[450,300,26]]},
{n:'Sunset Dunes',sea:['#e8764a','#8a2a5a'],rim:'#a8602f',sand:['#ffd9a0','#e8a869'],rock:['#c9a07a','#6a4a3a'],pil:[[200,200,30],[700,200,30],[200,400,30],[700,400,30],[450,300,40]]},
{n:'Moonlit Night',sea:['#10163a','#05071a'],rim:'#2a3a6a',sand:['#4a5a8a','#2c3a66'],rock:['#8a9ac8','#2a3050'],pil:[...wl(300,130,300,230),...wl(600,370,600,470),...wl(150,300,250,300),...wl(650,300,750,300),[450,300,30]]}];
function setMap(i){const m=MAPS[i];MAP=i;PIL=m.pil;W=m.w||900;H=m.h||600;SP=m.sp||[[70,70],[830,70],[70,530],[830,530]];BUSH=genBush(i)}
function genBush(i){const m=MAPS[i],w=m.w||900,h=m.h||600,sp=m.sp||[[70,70],[830,70],[70,530],[830,530]],out=[],n=m.w?18:9;let sd=i*977+13;const rnd=()=>(sd=(sd*9301+49297)%233280)/233280;
 for(let k=0;k<n*14&&out.length<n;k++){const x=110+rnd()*(w-220),y=90+rnd()*(h-180),r=30+rnd()*14;
  if(!m.pil.some(p=>Math.hypot(x-p[0],y-p[1])<p[2]+r+26)&&!sp.some(p=>Math.hypot(x-p[0],y-p[1])<150)&&!out.some(b=>Math.hypot(x-b[0],y-b[1])<r+b[2]+30))out.push([x,y,r])}return out}
const BSP=[[110,380],[1290,380],[110,520],[1290,520]];
MAPS.push(
{n:'Grand Arena (BIG 2v2)',w:1400,h:900,sp:BSP,sea:['#0e7ab0','#0a3d78'],rim:'#b98f55',sand:['#f6e3a8','#e0bf78'],rock:['#a3a9c4','#464c6e'],
 pil:[[700,450,50],...wl(350,200,550,200),...wl(850,200,1050,200),...wl(350,700,550,700),...wl(850,700,1050,700),[400,450,36],[1000,450,36],[700,250,30],[700,650,30],[230,150,34],[1170,150,34],[230,750,34],[1170,750,34]]},
{n:'Canyon Pass (BIG 2v2)',w:1400,h:900,sp:BSP,sea:['#7a3a1a','#2a1008'],rim:'#6a4a2a',sand:['#e0b878','#b88a4c'],rock:['#c98b5a','#5a3a22'],
 pil:[...wl(300,300,620,300),...wl(780,300,1100,300),...wl(300,600,620,600),...wl(780,600,1100,600),...wl(700,380,700,520),[500,450,40],[900,450,40],[220,160,34],[1180,160,34],[220,740,34],[1180,740,34]]},
{n:'Sunken Temple (BIG 2v2)',w:1400,h:900,sp:BSP,sea:['#1b4d5a','#0a2a35'],rim:'#4a5a5a',sand:['#cdd5cf','#a8b5ad'],rock:['#9aa8a0','#44524c'],
 pil:[...Array.from({length:10},(_,i)=>[700+Math.cos(i*.6283)*210,450+Math.sin(i*.6283)*210,26]),...wl(300,160,460,160),...wl(940,160,1100,160),...wl(300,740,460,740),...wl(940,740,1100,740),[700,450,34]]});
const BIG=MAPS.map((m,i)=>m.w?i:-1).filter(i=>i>=0),SMALL=MAPS.map((m,i)=>m.w?-1:i).filter(i=>i>=0);
function mapFor(code){const h=[...code].reduce((a,c)=>a*31+c.charCodeAt(0),7);return code.endsWith('2v2')?BIG[h%BIG.length]:h%SMALL.length}
function setOnline(code){onlineTeam=code.endsWith('2v2');onlineMap=mapFor(code)}
function rcode(){let c=($('rc').value||'').toLowerCase().replace(/[^a-z0-9]/g,'');if(c&&$('tm2')&&$('tm2').checked&&!c.endsWith('2v2'))c+='2v2';return c}
function teamScore(t){let s=0;for(const [i,e] of all())if(e.tm===t)s+=e.k;return s}
function assignTeams(){const l=[[joinT,R.peers().find(p=>p.isMe).peer,me]];for(const id in others)l.push([others[id].t||0,id,others[id]]);l.sort((a,b)=>a[0]-b[0]||(a[1]<b[1]?-1:1));l.forEach((x,i)=>{x[2].tm=i%2});if(!me.ti){me.ti=1;respawn(me)}}
CH.push(
{n:'Riku',t:'Blood Sorcerer',col:'#dc2626',hair:'#7f1d1d',acc:'horn',hp:95,sp:220,s:{
a:{k:'proj',spd:700,r:6,dmg:7,life:.5,cd:.35,nm:'Blood Needle'},
q:{k:'proj',spd:900,r:12,dmg:20,life:.7,pierce:1,cd:5,nm:'Crimson Lance'},
e:{k:'orbit',n:3,rad:50,dur:4,dmg:9,cd:7,nm:'Blood Blades'},
r:{k:'beam',len:520,w:20,dur:.5,dmg:30,cd:14,nm:'Red Nova'}}},
{n:'Kaito',t:'Shadow Summoner',col:'#475569',hair:'#0f172a',acc:'mask',hp:100,sp:215,s:{
a:{k:'cone',r:70,arc:1.8,dmg:9,cd:.4,nm:'Shadow Claw'},
q:{k:'mine',r:80,dmg:22,st:.5,cd:5,nm:'Shadow Pit'},
e:{k:'blink',dist:240,to:1,cd:5,nm:'Shadow Step'},
r:{k:'orbit',n:4,rad:70,dur:6,dmg:10,cd:14,nm:'Shadow Hounds'}}},
{n:'Mei',t:'Nail & Thread Curse',col:'#f472b6',hair:'#831843',acc:'bow',hp:90,sp:215,s:{
a:{k:'proj',spd:760,r:5,dmg:6,life:.5,cd:.3,nm:'Nail Shot'},
q:{k:'chain',n:4,rng:300,dmg:11,st:.3,cd:5,nm:'Resonance Chain'},
e:{k:'mine',r:70,dmg:20,st:.5,cd:5,nm:'Nail Trap'},
r:{k:'rain',cur:1,n:8,rad:130,r:34,dmg:12,gap:.1,cd:14,nm:'Nail Rain'}}},
{n:'Toru',t:'Restricted Brawler',col:'#16a34a',hair:'#14532d',acc:'band',hp:130,sp:275,s:{
a:{k:'cone',r:65,arc:1.8,dmg:10,cd:.3,nm:'Rapid Strikes'},
q:{k:'dash',dist:300,nova:{r:70,dmg:20,kb:60},cd:4,nm:'Burst Rush'},
e:{k:'haste',dur:4,cd:9,nm:'Overdrive'},
r:{k:'cone',r:120,arc:2.8,dmg:44,kb:140,cd:13,nm:'Fatal Combo'}}},
{n:'Aya',t:'Limitless Sorceress',col:'#818cf8',hair:'#f8fafc',acc:'blind',hp:90,sp:225,pas:{inf:78},s:{
a:{k:'proj',spd:600,r:9,dmg:9,life:.8,home:1,cd:.45,nm:'Limitless Orb'},
q:{k:'cone',r:130,arc:1.9,dmg:20,st:.3,cd:5,nm:'Cursed Technique'},
e:{k:'blink',cd:6,dist:300,to:1,nm:'Void Step'},
r:{k:'zone',cur:1,r:250,dur:7,dps:26,pull:120,sl:2,cd:17,nm:'Domain Expansion'}}},
{n:'Nao',t:'Cursed Speech',col:'#facc15',hair:'#713f12',acc:'mask',hp:85,sp:215,s:{
a:{k:'proj',n:3,spread:.4,spd:560,r:7,dmg:6,life:.5,cd:.5,nm:'Whisper Shot'},
q:{k:'nova',r:130,dmg:8,delay:.3,st:1,cd:7,nm:'Halt!'},
e:{k:'nova',r:120,dmg:14,delay:.3,kb:160,cd:6,nm:'Blast Away'},
r:{k:'nova',cur:1,r:160,dmg:30,delay:.8,st:1.4,cd:15,nm:'Crush!'}}},
{n:'Oren',t:'Caped Hero',col:'#fde047',hair:'#fef9c3',acc:'star',hp:110,sp:230,s:{
a:{k:'cone',r:60,arc:1.5,dmg:8,cd:.35,nm:'Casual Jab'},
q:{k:'cone',r:120,arc:1.3,dmg:50,kb:220,cd:9,nm:'Normal Punch'},
e:{k:'dash',dist:280,nova:{r:60,dmg:12},cd:4.5,nm:'Hero Dash'},
r:{k:'nova',r:260,dmg:75,delay:1,kb:300,cd:20,nm:'Serious Punch'}}},
{n:'Rex',t:'Demon Cyborg',col:'#f97316',hair:'#9ca3af',acc:'band',hp:110,sp:205,s:{
a:{k:'proj',spd:760,r:5,dmg:4,life:.5,cd:.18,nm:'Machine Gun'},
q:{k:'beam',len:500,w:14,dur:.6,dmg:12,cd:6,nm:'Incinerate'},
e:{k:'blink',dist:220,cd:5,nm:'Thruster Jump'},
r:{k:'rain',cur:1,n:10,rad:150,r:40,dmg:12,gap:.08,cd:14,nm:'Barrage Protocol'}}},
{n:'Sora',t:'Speed Ninja',col:'#a3e635',hair:'#1a2e05',acc:'mask',hp:80,sp:285,s:{
a:{k:'cone',r:55,arc:1.4,dmg:6,cd:.2,nm:'Flash Cut'},
q:{k:'dash',dist:320,nova:{r:50,dmg:16},cd:3.5,nm:'Afterimage Slash'},
e:{k:'blink',dist:260,to:1,cd:4,nm:'Blink Step'},
r:{k:'chain',n:6,rng:400,dmg:12,cd:14,nm:'Thousand Cuts'}}},
{n:'Arashi',t:'Psychic Esper',col:'#67e8f9',hair:'#164e63',acc:'bow',hp:90,sp:215,s:{
a:{k:'proj',spd:600,r:8,dmg:7,life:.7,cd:.4,home:1,nm:'Psy Bolt'},
q:{k:'zone',cur:1,r:110,dur:3.5,dps:8,pull:200,cd:7,nm:'Telekinetic Pull'},
e:{k:'shield',dur:2,cd:8,nm:'Psychic Barrier'},
r:{k:'proj',n:12,spread:6.3,spd:380,r:12,dmg:14,life:1.2,kb:80,cd:14,nm:'Psychic Storm'}}},
{n:'Zann',t:'MOBA Assassin',col:'#c026d3',hair:'#4a044e',acc:'mask',hp:90,sp:255,s:{
a:{k:'cone',r:60,arc:1.6,dmg:7,cd:.28,nm:'Quick Slash'},
q:{k:'dash',dist:280,nova:{r:60,dmg:16},cd:4,nm:'Phantom Cut'},
e:{k:'orbit',n:2,rad:50,dur:3,dmg:10,cd:7,nm:'Twin Blades'},
r:{k:'dash',dist:340,nova:{r:90,dmg:40,st:.5},cd:14,nm:'Death Mark Rush'}}},
{n:'Lyra',t:'MOBA Marksman',col:'#22d3ee',hair:'#164e63',acc:'bow',hp:85,sp:215,s:{
a:{k:'proj',spd:760,r:6,dmg:7,life:.7,cd:.3,nm:'Rapid Arrow'},
q:{k:'proj',n:3,spread:.3,spd:700,r:6,dmg:8,life:.7,cd:5,nm:'Triple Volley'},
e:{k:'blink',dist:220,cd:5,nm:'Evade Roll'},
r:{k:'beam',len:620,w:16,dur:.15,dmg:42,cd:15,nm:'Sniper Shot'}}},
{n:'Gorm',t:'MOBA Tank',col:'#94a3b8',hair:'#334155',acc:'horn',hp:150,sp:190,s:{
a:{k:'cone',r:70,arc:1.8,dmg:9,kb:30,cd:.5,nm:'Shield Strike'},
q:{k:'dash',dist:240,nova:{r:70,dmg:14,st:.6},cd:6,nm:'Charge Bash'},
e:{k:'shield',dur:2.5,cd:9,nm:'Iron Guard'},
r:{k:'nova',r:170,dmg:30,delay:.5,kb:-80,st:.8,cd:16,nm:'Earthshaker'}}},
{n:'Elara',t:'MOBA Mage',col:'#a78bfa',hair:'#4c1d95',acc:'crown',hp:80,sp:210,s:{
a:{k:'proj',spd:520,r:8,dmg:8,life:.8,cd:.5,nm:'Arcane Orb'},
q:{k:'proj',spd:800,r:14,dmg:20,life:.8,pierce:1,cd:5,nm:'Piercing Bolt'},
e:{k:'shield',dur:2,cd:9,nm:'Mana Shield'},
r:{k:'rain',cur:1,n:6,rad:140,r:46,dmg:18,gap:.12,cd:15,nm:'Meteor Shower'}}},
{n:'Veyra',t:'MOBA Support',col:'#fcd34d',hair:'#92400e',acc:'halo',hp:90,sp:215,s:{
a:{k:'proj',spd:540,r:7,dmg:6,life:.8,home:1,cd:.5,nm:'Light Bolt'},
q:{k:'zone',cur:1,r:90,dur:3,dps:9,sl:.8,cd:6,nm:'Holy Ground'},
e:{k:'haste',dur:3,cd:9,nm:'Swift Wind'},
r:{k:'heal',amt:50,cd:16,nm:'Mending Light'}}},
{n:'Brakk',t:'MOBA Warrior',col:'#f87171',hair:'#7f1d1d',acc:'band',hp:120,sp:225,s:{
a:{k:'cone',r:75,arc:2,dmg:9,cd:.4,nm:'Axe Swing'},
q:{k:'dash',dist:220,nova:{r:70,dmg:15},cd:5,nm:'Leap Strike'},
e:{k:'nova',r:100,dmg:16,delay:.2,cd:5,nm:'Whirlwind'},
r:{k:'cone',r:130,arc:2.6,dmg:46,kb:140,cd:14,nm:'Executioner'}}},
{n:'Ilsa',t:'MOBA Frost Mage',col:'#7dd3fc',hair:'#e0f2fe',acc:'bow',hp:80,sp:210,s:{
a:{k:'proj',spd:480,r:8,dmg:7,life:.8,sl:.5,cd:.5,nm:'Frost Shard'},
q:{k:'nova',cur:1,r:100,dmg:14,delay:.5,sl:1.5,cd:6,nm:'Ice Burst'},
e:{k:'blink',dist:220,cd:6,nm:'Frost Step'},
r:{k:'beam',len:500,w:26,dur:1,dmg:7,sl:1.5,cd:14,nm:'Blizzard Ray'}}},
{n:'Kade',t:'MOBA Thief',col:'#4ade80',hair:'#14532d',acc:'mask',hp:85,sp:260,s:{
a:{k:'cone',r:55,arc:1.4,dmg:6,cd:.22,nm:'Dagger Flurry'},
q:{k:'blink',dist:260,to:1,cd:4,nm:'Shadow Hop'},
e:{k:'mine',r:70,dmg:20,st:.4,cd:5,nm:'Smoke Bomb'},
r:{k:'chain',n:5,rng:380,dmg:11,cd:13,nm:'Blade Storm'}}},
{n:'Rovan',t:'Wandering Swordsman',col:'#60a5fa',hair:'#1e3a8a',acc:'band',hp:115,sp:235,pas:{x3:1.8,n:8,heal:.1},s:{
a:{k:'cone',r:72,arc:1.7,dmg:9,cd:.33,nm:'Roaring Edge'},
q:{k:'dash',dist:230,nova:{r:78,dmg:20,st:.7},cd:6,nm:'Skyward Slash'},
e:{k:'dash',dist:250,path:{w:46,dmg:15,sl:1.2},hst:1.6,fa:3,chg:2,cd:5.5,nm:'Moon Step'},
r:{k:'strike',cur:1,rng:420,r:105,dmg:58,delay:1.1,st:.5,hl:.14,cd:16,nm:'Final Verdict'}}},
// ---- raid bosses (not selectable)
{boss:1,n:'Gluttony Maw',t:'Cursed Spirit',col:'#8b5cf6',hair:'#2a0a4a',acc:'horn',hp:520,sp:150,s:{
a:{k:'proj',n:3,spread:.5,spd:380,r:10,dmg:7,life:1.4,home:1,cd:1.1,nm:'Curse Bolts'},
q:{k:'rain',cur:1,n:5,rad:140,r:50,dmg:14,gap:.15,cd:6,nm:'Cursed Rain'},
e:{k:'dash',dist:260,nova:{r:80,dmg:16,kb:90},cd:7,nm:'Maw Lunge'},
r:{k:'zone',cur:1,r:150,dur:5,dps:12,sl:1,cd:12,nm:'Domain Field'}}},
{boss:1,n:'Iron Brute',t:'Golem',col:'#94a3b8',hair:'#334155',acc:'band',hp:680,sp:130,s:{
a:{k:'cone',r:90,arc:2,dmg:14,kb:40,cd:1.2,nm:'Slam'},
q:{k:'nova',r:130,dmg:20,delay:.7,kb:100,cd:6,nm:'Quake'},
e:{k:'proj',spd:300,r:30,dmg:22,life:1.6,cd:7,nm:'Boulder'},
r:{k:'beam',len:520,w:28,dur:1,dmg:10,cd:11,nm:'Eye Laser'}}},
{boss:1,n:'Ember Tyrant',t:'Fire Dragon',col:'#f97316',hair:'#7c2d12',acc:'horn',hp:620,sp:140,s:{
a:{k:'proj',n:2,spread:.3,spd:420,r:9,dmg:6,life:.9,dot:{d:4,t:2},cd:.9,nm:'Fire Spit'},
q:{k:'cone',r:130,arc:2.4,dmg:18,cd:5,nm:'Fire Breath'},
e:{k:'blink',dist:240,to:1,cd:6,nm:'Flame Step'},
r:{k:'rain',cur:1,n:8,rad:170,r:46,dmg:14,gap:.1,cd:12,nm:'Meteor Shower'}}},
{boss:1,n:'Void Sovereign',t:'Domain Lord',col:'#a855f7',hair:'#3b0764',acc:'crown',hp:820,sp:135,s:{
a:{k:'chain',n:3,rng:300,dmg:8,cd:1.3,nm:'Void Lash'},
q:{k:'zone',cur:1,r:130,dur:4,dps:10,pull:140,cd:7,nm:'Gravity Well'},
e:{k:'blink',dist:300,to:1,cd:6,nm:'Rift Step'},
r:{k:'proj',spd:150,r:46,dmg:42,life:4,sl:2,pierce:1,cd:12,nm:'Black Sun'}}},
{boss:1,n:'Mad Giant',t:'Rampage Titan',col:'#ef4444',hair:'#450a0a',acc:'band',hp:920,sp:145,s:{
a:{k:'cone',r:100,arc:2.4,dmg:16,kb:60,cd:1,nm:'Wild Swing'},
q:{k:'orbit',n:4,rad:80,dur:4,dmg:10,cd:7,nm:'Fist Storm'},
e:{k:'dash',dist:300,nova:{r:90,dmg:22},cd:6,nm:'Charge'},
r:{k:'nova',r:220,dmg:40,delay:1.1,cd:13,nm:'Final Smash'}}});
CH.push(
{foe:1,ai:'rush',n:'Goblin',t:'Rusher',col:'#65a30d',hair:'#365314',acc:'ears',hp:38,sp:155,s:{a:{k:'cone',r:55,arc:1.8,dmg:6,cd:.9,nm:'Stab'},e:{k:'dash',dist:200,nova:{r:50,dmg:6},cd:4,nm:'Charge'}}},
{foe:1,ai:'range',n:'Imp Archer',t:'Archer',col:'#f59e0b',hair:'#78350f',acc:'horn',hp:28,sp:120,s:{a:{k:'proj',spd:380,r:6,dmg:5,life:1.2,cd:1.1,nm:'Arrow'},q:{k:'proj',n:3,spread:.5,spd:340,r:6,dmg:4,life:1.2,cd:4,nm:'Triple Shot'}}},
{foe:1,ai:'snipe',n:'Wraith',t:'Sniper',col:'#94a3b8',hair:'#1e293b',acc:'mask',hp:24,sp:105,s:{a:{k:'proj',spd:560,r:8,dmg:12,life:1.3,cd:2.6,nm:'Sniper Bolt'}}},
{foe:1,ai:'bomb',n:'Bomb Imp',t:'Bomber',col:'#ef4444',hair:'#7f1d1d',acc:'band',hp:34,sp:125,s:{a:{k:'rain',cur:1,n:1,rad:0,r:55,dmg:10,gap:0,cd:2,nm:'Bomb'},q:{k:'mine',r:60,dmg:12,st:.3,cd:6,nm:'Mine'}}},
{foe:1,ai:'range',n:'Hex Mage',t:'Mage',col:'#a78bfa',hair:'#4c1d95',acc:'star',hp:32,sp:115,s:{a:{k:'proj',spd:260,r:9,dmg:6,life:2.2,home:1,cd:1.8,nm:'Homing Orb'},q:{k:'zone',cur:1,r:80,dur:3,dps:7,sl:1,cd:7,nm:'Curse Pool'}}},
{foe:1,elite:1,ai:'rush',n:'Ogre',t:'Elite Brute',col:'#b45309',hair:'#451a03',acc:'horn',hp:150,sp:135,s:{a:{k:'cone',r:90,arc:2.2,dmg:12,kb:60,cd:1.4,nm:'Smash'},q:{k:'nova',r:110,dmg:14,delay:.8,cd:6,nm:'Stomp'},e:{k:'dash',dist:260,nova:{r:70,dmg:12,kb:80},cd:6,nm:'Bull Rush'}}},
{foe:1,ai:'rush',n:'Bat',t:'Swarmer',col:'#7c3aed',hair:'#2e1065',acc:'ears',hp:16,sp:215,s:{a:{k:'cone',r:45,arc:1.6,dmg:4,cd:.8,nm:'Bite'}}},
{foe:1,ai:'rush',n:'Slime',t:'Blob',col:'#34d399',hair:'#065f46',acc:'star',hp:55,sp:110,s:{a:{k:'cone',r:55,arc:6.3,dmg:7,sl:.8,cd:1.2,nm:'Splash'},q:{k:'zone',r:70,dur:3,dps:6,sl:1,cd:7,nm:'Goo Pool'}}},
{foe:1,ai:'range',n:'Fire Imp',t:'Pyro',col:'#fb923c',hair:'#9a3412',acc:'horn',hp:30,sp:125,s:{a:{k:'proj',spd:340,r:7,dmg:4,life:1.3,dot:{d:3,t:2},cd:1.3,nm:'Ember'},q:{k:'zone',cur:1,r:70,dur:3,dps:8,cd:7,nm:'Fire Pool'}}},
{foe:1,ai:'range',n:'Frost Shaman',t:'Cryomancer',col:'#7dd3fc',hair:'#e0f2fe',acc:'bow',hp:34,sp:110,s:{a:{k:'proj',spd:300,r:8,dmg:5,life:1.6,sl:1,cd:1.5,nm:'Frost Bolt'},q:{k:'nova',cur:1,r:85,dmg:9,delay:.9,sl:1.5,cd:6,nm:'Ice Burst'}}},
{foe:1,elite:1,ai:'rush',n:'Skeleton Knight',t:'Elite Guard',col:'#e2e8f0',hair:'#475569',acc:'crown',hp:130,sp:150,s:{a:{k:'cone',r:80,arc:1.8,dmg:11,cd:1.1,nm:'Cleave'},q:{k:'shield',dur:1.6,cd:7,nm:'Bone Guard'},e:{k:'dash',dist:240,nova:{r:60,dmg:10,st:.4},cd:5,nm:'Lunge'}}},
{foe:1,elite:1,ai:'range',n:'Necromancer',t:'Elite Caster',col:'#c084fc',hair:'#3b0764',acc:'crown',hp:110,sp:115,s:{a:{k:'proj',n:2,spread:.3,spd:300,r:8,dmg:6,life:2,home:1,cd:1.6,nm:'Soul Bolts'},q:{k:'rain',cur:1,n:4,rad:100,r:42,dmg:10,gap:.2,cd:6,nm:'Bone Rain'}}});
// ---- secret heroes: stronger than the roster on purpose. sec:'chest' = only from chests at very low odds, sec:'quest' = quest reward (QUESTS in meta.js)
CH.push(
{n:'Astra',t:'Star Valkyrie',sec:'chest',col:'#fbbf24',hair:'#fff7d6',acc:'halo',hp:125,sp:240,s:{
a:{k:'proj',spd:900,r:8,dmg:12,life:.6,pierce:1,cd:.36,ps:'lance',nm:'Star Lance'},
q:{k:'rain',cur:1,n:8,rad:130,r:40,dmg:17,gap:.08,cd:5,nm:'Starfall'},
e:{k:'blink',dist:300,to:1,cd:3.5,nm:'Comet Step'},
r:{k:'beam',len:640,w:46,dur:1.3,dmg:10,st:.2,cd:13,nm:'Heaven Piercer'}}},
{n:'Omen',t:'Void Reaper',sec:'chest',col:'#8b5cf6',hair:'#e9d5ff',acc:'none',hp:120,sp:235,s:{
a:{k:'cone',r:96,arc:2.6,dmg:14,ls:.15,cd:.42,nm:'Reap'},
q:{k:'chain',n:5,rng:320,dmg:16,st:.35,cd:4.5,nm:'Soul Harvest'},
e:{k:'blink',dist:300,to:1,cd:3.5,nm:'Grave Step'},
r:{k:'zone',cur:1,r:190,dur:5,dps:22,pull:190,sl:1.5,cd:14,nm:'Abyssal Maw'}}},
{n:'Kaiser',t:'Arena Champion',sec:'quest',col:'#f59e0b',hair:'#7c2d12',acc:'crown',hp:165,sp:225,s:{
a:{k:'cone',r:84,arc:2.1,dmg:14,kb:30,cd:.4,nm:'Champion Cleave'},
q:{k:'dash',dist:270,nova:{r:85,dmg:26,st:.7},cd:4.5,nm:'Lion Charge'},
e:{k:'haste',dur:3,sh:2,cd:8,nm:'Unbreakable'},
r:{k:'nova',r:210,dmg:66,delay:.6,kb:200,st:1.1,cd:14,nm:'Coliseum Quake'}}},
{n:'Drakon',t:'Dragon Sovereign',sec:'quest',col:'#ef4444',hair:'#450a0a',acc:'horn',hp:150,sp:225,s:{
a:{k:'proj',n:2,spread:.18,spd:640,r:10,dmg:8,life:.6,dot:{d:5,t:2},cd:.38,ps:'fire',nm:'Dragon Fang'},
q:{k:'cone',r:160,arc:1.5,dmg:26,dot:{d:8,t:3},cd:4.5,nm:'Inferno Breath'},
e:{k:'dash',dist:320,nova:{r:95,dmg:24,dot:{d:6,t:2},kb:80},cd:4.5,nm:'Wyvern Dive'},
r:{k:'rain',cur:1,n:10,rad:185,r:52,dmg:22,gap:.09,cd:14,nm:'Meteor Cataclysm'}}},
{n:'Eon',t:'Timeless Sage',sec:'quest',col:'#22d3ee',hair:'#f1f5f9',acc:'wizhat',hp:115,sp:225,s:{
a:{k:'proj',spd:640,r:9,dmg:11,life:.9,home:1,pierce:1,cd:.4,nm:'Chrono Bolt'},
q:{k:'zone',cur:1,r:135,dur:4,dps:15,sl:2,cd:5.5,nm:'Slow Field'},
e:{k:'blink',dist:320,cd:3,nm:'Rewind'},
r:{k:'nova',cur:1,r:210,dmg:58,delay:.9,st:1.8,cd:14,nm:'Time Stop'}}},
{n:'Nyx',t:'Night Empress',sec:'quest',col:'#ec4899',hair:'#1e1b4b',acc:'crown',hp:120,sp:245,s:{
a:{k:'proj',n:3,spread:.3,spd:700,r:7,dmg:7,life:.7,home:1,cd:.34,ps:'dark',nm:'Moon Shards'},
q:{k:'mine',r:100,dmg:34,st:.9,cd:4.5,nm:'Eclipse Seal'},
e:{k:'blink',dist:320,to:1,cd:3.5,nm:'Umbra Step'},
r:{k:'orbit',n:6,rad:82,dur:7,dmg:14,cd:13,nm:'Lunar Halo'}}});
for(const c of CH)if(c.foe)for(const k of['a','q','e','r'])if(!c.s[k])c.s[k]={k:'shield',dur:.01,cd:999,nm:'-'};
const NORM=[...CH.keys()].filter(i=>!CH[i].boss&&!CH[i].foe),BASE=NORM.filter(i=>!CH[i].sec),BOSS=[...CH.keys()].filter(i=>CH[i].boss),FOE=[...CH.keys()].filter(i=>CH[i].foe);
// run buffs: d/dv = description (en/vi); run:1 = only offered inside a run, never sold as a pre-run buff
const BUFFS=[{n:'Power Up',ic:'⚔️',d:'+18% damage',dv:'+18% sát thương',f:r=>{r.dm*=1.18}},
{n:'Rapid Fire',ic:'⏱️',d:'Skills recharge 20% faster',dv:'Hồi chiêu nhanh hơn 20%',f:r=>{r.cd*=1.2}},
{n:'Swift Boots',ic:'👟',d:'+10% move speed',dv:'+10% tốc độ chạy',f:r=>{r.sp*=1.1}},
{n:'Vitality',ic:'❤️',d:'+20% max HP and heal that much',dv:'+20% máu tối đa và hồi lượng đó',f:r=>{const a=Math.round(me.mx*.2);me.mx+=a;me.hp+=a}},
{n:'Vampirism',ic:'🩸',d:'Heal 5% of damage dealt',dv:'Hút 5% sát thương gây ra thành máu',f:r=>{r.ls+=.05}},
{n:'Critical Eye',ic:'🎯',d:'+12% crit chance (x2 damage)',dv:'+12% tỉ lệ chí mạng (x2 sát thương)',f:r=>{r.cr+=.12}},
{n:'Soul Charge',ic:'⭐',d:'Awakening fills 60% faster',dv:'Thức tỉnh nạp nhanh hơn 60%',f:r=>{r.mg*=1.6}},
{n:'Bulwark',ic:'🛡️',d:'+35% max shield',dv:'+35% khiên tối đa',f:r=>{me.sm=Math.round(me.sm*1.35);me.sd=me.sm}},
{n:'Quick Guard',ic:'🔋',d:'Shield recharges 40% sooner and faster',dv:'Khiên hồi sớm và nhanh hơn 40%',f:r=>{r.sr*=1.4}},
{n:'Gold Rush',ic:'🪙',d:'+50% gold from this run',dv:'+50% vàng trong lượt này',f:r=>{r.gm*=1.5}},
{n:'Field Medic',ic:'🧪',run:1,d:'Restore 40% HP right now',dv:'Hồi ngay 40% máu',f:r=>{me.hp=Math.min(me.mx,me.hp+me.mx*.4)}}];

// ---- accessories. 3 slots (head/charm/aura), bought with gold in the Gear screen.
// b = PvE-only stat bonuses as fractions (cd < 1 means skills recharge faster), p = gold price, art = draw key in js/art.js
const GEAR=[
 {id:'hb_bnd',sl:'head',rar:0,n:'Red Ribbon',v:'Lụa Đỏ',p:300,art:'gband',b:{dm:.03}},
 {id:'hb_vis',sl:'head',rar:1,n:'Battle Visor',v:'Kính Chiến',p:650,art:'gvisor',b:{sp:.05}},
 {id:'hb_hod',sl:'head',rar:1,n:'Shadow Hood',v:'Mũ Trùm',p:650,art:'ghood',b:{sh:.06}},
 {id:'hb_hrn',sl:'head',rar:2,n:'Ram Horns',v:'Sừng Cuồng',p:1400,art:'ghorn',b:{dm:.07}},
 {id:'hb_ant',sl:'head',rar:2,n:'Signal Antennae',v:'Ăng-ten',p:1400,art:'gant',b:{cd:.94}},
 {id:'hb_gog',sl:'head',rar:2,n:'Scout Goggles',v:'Kính Quan Sát',p:1400,art:'ggoggles',b:{cd:.95,sp:.03}},
 {id:'hb_crn',sl:'head',rar:3,n:'Gilded Crown',v:'Vương Miện',p:2600,art:'gcrown',b:{hp:.09}},
 {id:'hb_hlm',sl:'head',rar:3,n:'Steel Helm',v:'Mũ Giáp',p:2600,art:'ghelm',b:{sh:.10}},
 {id:'hb_hal',sl:'head',rar:3,n:'Sun Halo',v:'Hào Quang',p:2600,art:'ghalo',b:{sp:.08}},
 {id:'hb_msk',sl:'head',rar:3,n:'Oni Mask',v:'Mặt Nạ Oni',p:2600,art:'gmask',b:{hp:.07,sh:.06}},
 {id:'hb_ast',sl:'head',rar:4,n:'Astral Diadem',v:'Vương Miện Sư Phạm',p:5200,art:'gastral',b:{hp:.07,dm:.07,sp:.07,cd:.92}},
 {id:'ch_orb',sl:'charm',rar:0,n:'Star Bead',v:'Hạt Tinh',p:300,art:'gorb',b:{dm:.03}},
 {id:'ch_fir',sl:'charm',rar:1,n:'Ember Seed',v:'Hạt Lửa',p:650,art:'gfire',b:{dm:.06}},
 {id:'ch_frz',sl:'charm',rar:1,n:'Frost Crystal',v:'Tinh Băng',p:650,art:'gice',b:{sh:.06}},
 {id:'ch_shu',sl:'charm',rar:2,n:'Shuriken Charm',v:'Phi Nhẫn',p:1400,art:'gshur',b:{cd:.93}},
 {id:'ch_bel',sl:'charm',rar:2,n:'Silver Bell',v:'Chuông Bạc',p:1400,art:'gbell',b:{ls:.03}},
 {id:'ch_run',sl:'charm',rar:3,n:'Rune Tablet',v:'Bảng Rune',p:2600,art:'grune',b:{hp:.08}},
 {id:'ch_bld',sl:'charm',rar:3,n:'Blood Drop',v:'Giọt Máu',p:2600,art:'gblood',b:{ls:.05}},
 {id:'ch_prs',sl:'charm',rar:3,n:'Prism Lens',v:'Lăng Kính',p:2600,art:'gprism',b:{sp:.07}},
 {id:'ch_vod',sl:'charm',rar:4,n:'Void Seed',v:'Hạt Hư Không',p:5200,art:'gvoid',b:{dm:.11}},
 {id:'ch_rel',sl:'charm',rar:4,n:'Sacred Relic',v:'Thánh Vật',p:5200,art:'grelic',b:{hp:.05,sh:.05,dm:.05,sp:.05}},
 {id:'au_ear',sl:'aura',rar:0,n:'Stone Circle',v:'Vòng Đất',p:300,art:'gaur',b:{hp:.04}},
 {id:'au_emb',sl:'aura',rar:1,n:'Ember Aura',v:'Hơi Than',p:650,art:'gaurf',b:{dm:.06}},
 {id:'au_frz',sl:'aura',rar:1,n:'Frost Aura',v:'Hơi Băng',p:650,art:'gaura',b:{sp:.06}},
 {id:'au_thu',sl:'aura',rar:2,n:'Storm Aura',v:'Hơi Lôi',p:1400,art:'gaurt',b:{cd:.94}},
 {id:'au_nat',sl:'aura',rar:2,n:'Forest Aura',v:'Hơi Rừng',p:1400,art:'gaurn',b:{ls:.03}},
 {id:'au_gld',sl:'aura',rar:3,n:'Golden Aura',v:'Hào Quang Vàng',p:2600,art:'gaurg',b:{hp:.10}},
 {id:'au_drk',sl:'aura',rar:3,n:'Shadow Aura',v:'Hào Quang Tối',p:2600,art:'gaurd',b:{dm:.08}},
 {id:'au_holy',sl:'aura',rar:3,n:'Halo Aura',v:'Hào Quang Thánh',p:2600,art:'gaurh',b:{sh:.09}},
 {id:'au_vod',sl:'aura',rar:4,n:'Void Aura',v:'Hào Quang Hư Vô',p:5200,art:'gaurv',b:{hp:.05,sh:.05,dm:.05,sp:.05}},
 {id:'au_drg',sl:'aura',rar:4,n:'Dragon Aura',v:'Hơi Rồng',p:5200,art:'gaurdr',b:{dm:.12}}];
const GBY=Object.fromEntries(GEAR.map(g=>[g.id,g])),GSLOTS=['head','charm','aura'];
const IC={proj:'➶',cone:'⚔',beam:'═',orbit:'◎',rain:'☔',mine:'●',chain:'⚡',zone:'◉',nova:'✸',dash:'⇢',blink:'✧',shield:'◍',heal:'✚',haste:'≫'};
CH.forEach(c=>{const m=MOD[c.n];if(m)for(const k in m)Object.assign(c.s[k],m[k])});
// ---- balance pass (tuned with 1v1 duel simulations): kit fixes, then per-character [health x, damage x]
const KIT={Sakura:{a:{home:0,cd:.55}},Arashi:{a:{home:0,cd:.45}}};
for(const n in KIT){const c=CH.find(x=>x.n==n);for(const k in KIT[n])Object.assign(c.s[k],KIT[n][k])}
const BAL={"Rovan":[1.02,1.03],"Zann":[1.19,1.4],"Lyra":[1.11,1.22],"Gorm":[0.92,0.85],"Elara":[1.04,1.08],"Veyra":[0.9,0.8],"Brakk":[0.97,0.94],"Ilsa":[1.09,1.18],"Kade":[1.28,1.62],"Ren":[1.18,1.37],"Monko":[0.96,0.93],"Kuro":[0.94,0.88],"Nara":[1.02,1.03],"Kaen":[0.96,0.92],"Yuki":[1.03,1.06],"Raiden":[0.95,0.91],"Sakura":[0.98,0.96],"Shion":[1.22,1.47],"Aoi":[0.99,0.98],"Gaia":[0.94,0.89],"Hikari":[0.92,0.84],"Noir":[0.94,0.89],"Neko":[0.8,0.65],"Bram":[0.96,0.92],"Dex":[1.12,1.24],"Vesper":[1.21,1.44],"Tusk":[0.87,0.75],"Pip":[0.9,0.81],"Vex":[1.02,1.04],"Rook":[0.99,0.97],"Zig":[1.12,1.25],"Pyra":[0.95,0.9],"Riku":[0.81,0.65],"Kaito":[1.17,1.34],"Mei":[1.04,1.08],"Toru":[0.9,0.8],"Aya":[0.89,0.79],"Nao":[0.97,0.94],"Oren":[0.94,0.88],"Rex":[0.97,0.94],"Sora":[1.34,1.76],"Arashi":[0.89,0.78]};
function balScale(c,hf,df){c.hp=Math.round(c.hp*hf);for(const k of['a','q','e','r']){const s=c.s[k];for(const f of['dmg','dps']){if(s[f]!=null)s[f]=+(s[f]*df).toFixed(3)}if(s.nova&&s.nova.dmg!=null)s.nova.dmg=+(s.nova.dmg*df).toFixed(3);if(s.path)s.path.dmg=+(s.path.dmg*df).toFixed(3);if(s.dot)s.dot.d=+(s.dot.d*df).toFixed(3)}}
// Auto-balance layer, applied on top of the hand-tuned BAL above. Generated by
// tools/measure-balance.js from a 30s-duel model over the whole roster, so every tier is a
// deliberate step apart: common 44, rare 47, epic 50, legendary 53, secret 58 (power units).
// Each hero stays within +-20% of its own tier so character identity survives the pass.
const BAL2={"Ren":[0.577,0.677],"Monko":[1.026,1.204],"Kuro":[1.023,1.202],"Nara":[1.041,1.222],"Kaen":[0.832,0.976],"Yuki":[0.809,0.95],"Raiden":[1.05,1.233],"Sakura":[0.928,1.089],"Shion":[0.906,1.063],"Aoi":[1.025,1.203],"Gaia":[1.23,1.029],"Hikari":[1.02,1.197],"Zephyr":[1.044,1.226],"Noir":[1.037,1.218],"Neko":[1.083,1.271],"Ryuu":[1.031,1.209],"Aldric":[1.309,1.095],"Bramar":[1.307,1.093],"Hakon":[1.31,1.095],"Faron":[1.307,1.093],"Orrin":[1.308,1.094],"Ursa":[1.309,1.094],"Sivan":[1.305,1.091],"Brant":[1.304,1.09],"Hollis":[1.301,1.088],"Lorn":[1.307,1.093],"Gale":[1.028,1.208],"Yara":[1.03,1.209],"Osric":[1.017,1.194],"Jarl":[1.018,1.195],"Nima":[1.024,1.203],"Koda":[1.023,1.201],"Rhea":[1.024,1.202],"Quen":[1.025,1.203],"Dahlia":[1.023,1.202],"Maro":[1.208,1.011],"Ulric":[1.021,1.199],"Draven":[1.023,1.2],"Cyra":[1.024,1.202],"Wrenly":[1.028,1.206],"Torvald":[1.305,1.091],"Xerath":[1.023,1.201],"Brix":[1.023,1.201],"Dorn":[1.024,1.203],"Kestrel":[1.029,1.209],"Fenn":[1.028,1.207],"Ashen":[1.011,1.187],"Cinder":[1.012,1.189],"Ulla":[1.013,1.19],"Rhun":[0.995,1.168],"Zolt":[1.207,1.009],"Merek":[1.207,1.009],"Joryn":[1.015,1.191],"Falk":[1.007,1.182],"Tamsin":[1.029,1.209],"Halden":[1.374,1.15],"Vesna":[1.033,1.214],"Pia":[1.032,1.211],"Eira":[1.037,1.218],"Isolde":[1.039,1.219],"Nyxen":[1.019,1.196],"Vale":[1.025,1.203],"Grim":[1.016,1.192],"Yorick":[1.013,1.19],"Juno":[0.883,1.037],"Kess":[0.914,1.073],"Sable":[1,1.174],"Lune":[0.994,1.166],"Voss":[0.995,1.168],"Ashra":[1,1.174],"Iva":[0.882,1.035],"Mirelle":[0.89,1.045],"Xenia":[0.843,0.99],"Liora":[0.845,0.992],"Odal":[1.026,1.205],"Quill":[1.023,1.201],"Ilyra":[1.332,1.114],"Ysolde":[1.329,1.111],"Perrin":[1.317,1.102],"Elowen":[1.331,1.113],"Zaina":[1.116,1.311],"Wynne":[1.256,1.474],"Aurora":[1.264,1.484],"Gilda":[1.024,1.202],"Emberlyn":[0.9,1.058],"Sabin":[1.308,1.094],"Rhoswen":[1.035,1.215],"Nyla":[1.032,1.211],"Auri":[1.039,1.22],"Brannon":[1.31,1.096],"Dexter":[1.022,1.199],"Torrin":[1.008,1.183],"Fen":[0.877,1.03],"Grove":[1.049,1.232],"Thorn":[1.013,1.19],"Moss":[1.312,1.098],"Wren":[1.029,1.209],"Calla":[1.018,1.195],"Tor":[1.02,1.196],"Robin":[1.017,1.195],"Sabryl":[1.029,1.209],"Wind":[1.029,1.208],"Zephiro":[1.024,1.203],"Kite":[1.029,1.208],"Falcon":[1.028,1.207],"Raven":[0.992,1.163],"Pixie":[1.027,1.206],"Sprig":[1.027,1.206],"Jinx":[1.026,1.205],"Puck":[1.026,1.205],"Mirage":[1.025,1.203],"Echo":[0.995,1.168],"Rift":[1.026,1.204],"Nova":[1.023,1.2],"Zenith":[1.017,1.194],"Aurum":[1.017,1.194],"Vaen":[0.645,0.756],"Bram":[1.012,1.188],"Dex":[1.02,1.198],"Vesper":[1.019,1.196],"Tusk":[1.212,1.013],"Pip":[1.361,1.597],"Vex":[1.023,1.2],"Rook":[1.016,1.192],"Zig":[1.016,1.192],"Pyra":[0.81,0.951],"Riku":[1.114,1.308],"Kaito":[0.907,1.065],"Mei":[1.136,1.333],"Toru":[1.351,1.13],"Aya":[1.185,1.391],"Nao":[1.143,1.342],"Oren":[1.128,1.324],"Rex":[1.097,1.288],"Sora":[0.928,1.089],"Arashi":[1.317,1.546],"Zann":[0.932,1.095],"Lyra":[1.009,1.184],"Gorm":[1.218,1.018],"Elara":[1.172,1.376],"Veyra":[1.369,1.607],"Brakk":[1.016,1.192],"Ilsa":[1.031,1.21],"Kade":[0.923,1.083],"Rovan":[1.019,1.196],"Astra":[0.737,0.865],"Omen":[0.727,0.854],"Kaiser":[0.88,0.736],"Drakon":[0.895,0.749],"Eon":[0.81,0.951],"Nyx":[0.595,0.698]};
for(const c of CH){const b=BAL[c.n];if(b&&!c.boss&&!c.foe)balScale(c,b[0],b[1])}
for(const c of CH){const b=BAL2[c.n];if(b&&!c.boss&&!c.foe)balScale(c,b[0],b[1])}
// ---- unlock tiers: 0 starter, 1 rare, 2 epic, 3 legendary (unlock order only, kits stay PvP-balanced)
const START=['Ren','Kaen','Yuki','Sakura'],RARE=[...RARE_R,'Monko','Kuro','Nara','Raiden','Shion','Aoi','Gaia','Hikari','Zephyr','Noir','Neko','Ryuu'],LEGEND=[...LEGEND_R,'Riku','Kaito','Mei','Toru','Aya','Nao','Oren','Rex','Sora','Arashi'];
for(const i of NORM){const c=CH[i];c.rar=c.sec?4:START.includes(c.n)?0:RARE.includes(c.n)?1:LEGEND.includes(c.n)?3:2}
// ---- campaign: 5 chapters x 10 stages, a boss closes every chapter
const CHAP=[{n:'Tide Coast',v:'Bờ Biển Sóng',maps:[1,0,8],foes:['Goblin','Imp Archer','Bat'],boss:'Gluttony Maw',col:'#38bdf8'},
{n:'Jungle Ruins',v:'Phế Tích Rừng',maps:[7,2,3],foes:['Goblin','Imp Archer','Bomb Imp','Slime','Bat','Ogre'],boss:'Iron Brute',col:'#4ade80'},
{n:'Ember Pit',v:'Hố Dung Nham',maps:[5,8,4],foes:['Fire Imp','Bomb Imp','Goblin','Hex Mage','Slime','Ogre'],boss:'Ember Tyrant',col:'#fb923c'},
{n:'Frozen Lake',v:'Hồ Băng',maps:[6,9,2],foes:['Frost Shaman','Wraith','Hex Mage','Bat','Skeleton Knight','Ogre'],boss:'Void Sovereign',col:'#7dd3fc'},
{n:'Chaos Citadel',v:'Thành Hỗn Mang',maps:[9,4,3,5],foes:['Wraith','Fire Imp','Frost Shaman','Hex Mage','Bomb Imp','Goblin','Skeleton Knight','Necromancer','Ogre'],boss:'Mad Giant',col:'#c084fc'}];
const NSTAGE=CHAP.length*10,chi=n=>CH.findIndex(c=>c.n==n),ELITE=FOE.filter(i=>CH[i].elite);
function stagePlan(s){const c=(s-1)/10|0,i=(s-1)%10+1,cp=CHAP[c],pool=cp.foes.map(chi),nr=i<4?2:i<8?3:4,rooms=[];
 for(let k=0;k<nr;k++){const last=k==nr-1,map=cp.maps[(i+k)%cp.maps.length];
  if(last&&i==10)rooms.push({type:'boss',map,boss:chi(cp.boss),adds:2+c,pool});
  else rooms.push({type:'fight',map,n:Math.min(14,4+c+Math.ceil(i/2)+k),elite:last?(i==5?2:i>6?1:0):0,pool})}
 return{s,c,i,rooms,hs:.9*(1+.07*(s-1)),ds:.9*(1+.04*(s-1))}}
// ---- looks, read by js/art.js: [weapon, gear, hair, extras]. Extras: acc headgear, off off-hand, pair dual-wield, sk skin, sc scale,
// cc cape / wc wing / fc fist colour, face, sh = custom body painter, h = height for the name bar, ps = portrait scale
const LOOK={
Ren:['sword','light+cape','spiky',{pair:1,acc:'scarf',cc:'#2f6a3a'}],Monko:['fist','vest','short',{}],Kuro:['katana','gi','short',{pair:1,bc:'#1e40af'}],Nara:['staff','dress','long',{}],
Kaen:['sword','armor','spiky',{fl:1}],Yuki:['staff','robe','long',{}],Raiden:['kunai','ninja','spiky',{acc:'scarf',bc:'#facc15'}],Sakura:['bow','dress','pony',{}],
Shion:['dagger','ninja+hood','short',{}],Aoi:['orb','robe','long',{}],Gaia:['fist','vest','spiky',{fc:'#a8a29e',fr:8.2}],Hikari:['lance','armor+cape','long',{off:'shield',cc:'#f8fafc'}],
Zephyr:['dagger','light+cape','pony',{cc:'#3f9a6a'}],Noir:['tome','robe+hood','long',{face:'glow'}],Neko:['claws','light+tail','short',{tc:'#e8964a'}],Ryuu:['fist','gi','pony',{fc:'#ff9a2b',bc:'#8a1a1a'}],
Bram:['shotgun','coat','short',{bc:'#7c2d12'}],Dex:['bomb','coat','short',{acc:'goggles'}],Vesper:['rifle','light+cape+hood','pony',{acc:'none'}],Tusk:['hammer','armor','mohawk',{}],
Pip:['wand','dress','twin',{}],Vex:['dagger','ninja+hood','short',{}],Rook:['gun','tech','short',{acc:'goggles'}],Zig:['staff','robe','spiky',{}],
Pyra:['flamer','tech','twin',{}],Riku:['orb','coat','spiky',{}],Kaito:['claws','coat','spiky',{acc:'none'}],Mei:['hammer','dress','bob',{}],
Toru:['spear','gi','pony',{bc:'#14532d'}],Aya:['orb','coat','spiky',{acc:'blind'}],Nao:['mega','coat','short',{}],Oren:['fist','light+cape','bald',{acc:'none',cc:'#ffffff'}],
Rex:['cannon','tech','spiky',{acc:'none'}],Sora:['katana','ninja','pony',{acc:'scarf',bc:'#a3e635'}],Arashi:['orb','dress','bob',{acc:'none'}],
Zann:['sword','ninja+hood','short',{pair:1}],Lyra:['bow','light+cape','long',{acc:'star',cc:'#0e7490'}],Gorm:['hammer','armor','bald',{off:'shield',acc:'helm'}],
Elara:['staff','robe','long',{acc:'wizhat'}],Veyra:['wand','robe','bob',{}],Brakk:['axe','armor','mohawk',{bc:'#7f1d1d'}],Ilsa:['staff','robe+cape','long',{cc:'#e0f2fe'}],
Kade:['dagger','light+hood','short',{}],Rovan:['katana','coat+cape','pony',{acc:'scarf',bc:'#e2e8f0',cc:'#1e3a8a'}],
Astra:['lance','armor+wings','long',{wc:'#ffffff'}],Omen:['scythe','robe+hood+cape','long',{face:'glow',cc:'#2e1065'}],Kaiser:['gsword','armor+cape','short',{off:'shield',cc:'#b91c1c'}],
Drakon:['spear','armor+wings+tail','spiky',{wc:'#7f1d1d',tc:'#ef4444'}],Eon:['staff','robe+cape','long',{cc:'#0e7490'}],Nyx:['orb','dress+cape','long',{cc:'#1e1b4b'}],
Goblin:['club','rag','bald',{sk:'#86c24f',acc:'gob',sc:.92}],'Imp Archer':['bow','rag+wings+tail','bald',{sk:'#f0a040',acc:'horn',sc:.9,wc:'#b45309'}],Wraith:[0,0,0,{sh:'ghost',h:54}],
'Bomb Imp':['bomb','rag+tail','bald',{sk:'#ef6a5a',acc:'horn',sc:.9}],'Hex Mage':['staff','robe+hood','bald',{face:'glow'}],Ogre:['club','rag','bald',{sk:'#c08a4a',acc:'tusk',sc:1.4,face:'rage'}],
Bat:[0,0,0,{sh:'bat',h:40}],Slime:[0,0,0,{sh:'slime',h:30}],'Fire Imp':['orb','rag+tail','flame',{sk:'#ff9a4c',acc:'horn',sc:.9}],'Frost Shaman':['staff','robe','bald',{sk:'#bfe9ff',acc:'tmask'}],
'Skeleton Knight':['sword','armor','bald',{sk:'#eef0e6',face:'skull',off:'shield',acc:'none',sc:1.22}],Necromancer:['bstaff','robe+hood','bald',{sk:'#e8e2d0',face:'skull',sc:1.2}],
'Gluttony Maw':[0,0,0,{sh:'maw',h:56,ps:.8}],'Iron Brute':[0,0,0,{sh:'golem',h:50,ps:.85}],'Ember Tyrant':[0,0,0,{sh:'dragon',h:62,ps:.76}],'Void Sovereign':[0,0,0,{sh:'lord',h:72,ps:.74}],
'Mad Giant':['fist','bare','wild',{sk:'#e8a07a',face:'rage',sc:1.85,fc:'#e8a07a',fr:7.5,acc:'none'}]};
LOOK.Vaen=['katana','coat+cape','short',{acc:'mask',cc:'#334155',pair:1}];
Object.assign(LOOK,LOOK_R);
for(const c of CH){const l=LOOK[c.n];c.lk=l?Object.assign({wp:l[0]||'none',gr:l[1]||'light',hs:l[2]||'bald'},l[3]):{wp:'sword',gr:'light',hs:'spiky'}}
// what a shot looks like (ps) and how a rained strike arrives (fs), guessed from the weapon and the skill's name unless the skill says otherwise
{const elem=s=>/shadow|void|black|curse|soul|dark|hex/i.test(s.nm)?'dark':/ice|frost|snow/i.test(s.nm)?'ice':/fire|flame|ember|dragon|inferno|roar/i.test(s.nm)||s.dot?'fire':'orb';
 for(const c of CH){const w=c.lk.wp;for(const k in c.s){const s=c.s[k];
  if(s.k=='proj'&&!s.ps)s.ps=/boulder|rock/i.test(s.nm)?'rock':/needle|nail/i.test(s.nm)?'needle':/note/i.test(s.nm)?'note':/blade|slash|wave|cut/i.test(s.nm)?'wave':w=='fist'&&elem(s)!='fire'?'fist':elem(s)=='fire'?'fire':s.r>30?'vortex':w=='bow'?'arrow':/gun|rifle|cannon/.test(w)?'bullet':w=='kunai'?'star':w=='dagger'?'kunai':/sword|katana|axe|scythe|claws/.test(w)?'wave':w=='lance'||w=='spear'?'lance':w=='flamer'?'fire':elem(s);
  if(s.k=='rain'&&!s.fs)s.fs=w=='bomb'||/bomb|barrage/i.test(s.nm)?'bomb':/thunder|storm|lightning/i.test(s.nm)?'bolt':'orb';
  if(w=='fist')s.fc=c.lk.fc}}}
// ---- signature accessories: every playable hero gets ONE exclusive trinket, built from its own
// look and stats rather than hand-listed. art follows the weapon, the bonus follows the build,
// and ex pins the piece to that single hero (see fixGear / ACT.gearDo in js/meta.js).
const WART={fist:'gblood',claws:'gshur',dagger:'gshur',katana:'gshur',sword:'gshur',kunai:'gshur',scythe:'gvoid',
 flamer:'gfire',bomb:'gfire',bow:'gprism',spear:'grelic',lance:'grelic',axe:'gbell',hammer:'gbell',gsword:'gbell',
 club:'gbell',cannon:'gbell',gun:'grune',rifle:'grune',shotgun:'grune',staff:'grune',bstaff:'grune',wand:'grune',orb:'grune',tome:'grune',mega:'grune'};
GEAR.push(...NORM.map(i=>{const c=CH[i],b=c.hp>=130?{hp:.08}:c.sp>=248?{sp:.07}:{dm:.08};
 if(c.pas&&c.pas.inf)b.sh=.05;if(c.pas&&c.pas.ba)b.ls=.03;
 return{id:'sg_'+c.n,sl:'charm',rar:3,n:c.n+"'s Sigil",v:'Dấu ấn '+c.n,p:0,art:WART[c.lk.wp]||'gorb',ex:c.n,b}}));
Object.assign(GBY,Object.fromEntries(GEAR.map(g=>[g.id,g])));
// ground / obstacle / weather set per map, in MAPS order (TH in js/art.js)
['sand','sand','stone','stone','stone','lava','ice','grass','sand','night','sand','stone','stone'].forEach((t,i)=>{MAPS[i].th=t});
