// Generates js/roster.js: the 100-character expansion of the roster.
//   node tools/gen-roster.js          -> writes js/roster.js
//   node tools/gen-roster.js --check  -> validates only, prints nothing written
//
// js/roster.js is plain data: ROSTER holds character definitions, LOOK_R their looks.
// data.js pulls both in (CH.push(...ROSTER) and Object.assign(LOOK,LOOK_R)) before its
// post-processing, so new characters get rarity, look binding and shot/rain art exactly
// like the hand-written ones.
const fs=require('fs'),path=require('path'),root=path.join(__dirname,'..');

// ---------------------------------------------------------------- kit archetypes
// cd bands mirror the hand-written roster: a .24-.6, q 3.5-6, e 3.5-10, r 13-16
const K={
 blade:(o={})=>{const s=o.spd||520;
  return{a:{k:'proj',cd:.32,spd:s,r:8,dmg:o.ad||8,life:.4,nm:'Slash'},
   q:{k:'proj',cd:4,n:3,spread:.5,spd:s*.9,r:11,dmg:o.qd||14,life:.5,nm:'Triple Cut'},
   e:{k:'dash',cd:5,dist:o.ed||250,nova:{r:62,dmg:o.edmg||15},nm:'Lunge'},
   r:{k:'nova',cd:14,r:o.rad||150,dmg:o.rd||44,delay:.5,sl:.5,nm:'Whirlwind'}}},
 duelist:(o={})=>{const s=o.spd||620;
  return{a:{k:'proj',cd:.3,spd:s,r:7,dmg:o.ad||7,life:.35,nm:'Quick Slash'},
   q:{k:'nova',cd:5,r:105,dmg:o.qd||22,delay:.2,nm:'Crescent'},
   e:{k:'dash',cd:4.5,dist:280,nova:{r:55,dmg:12},nm:'Step Slash'},
   r:{k:'proj',cd:13,n:3,spread:.3,spd:s*1.15,r:14,dmg:o.rd||24,life:.6,nm:'Triple Fang'}}},
 mage:(o={})=>{const s=o.spd||440;
  return{a:{k:'proj',cd:.48,spd:s,r:11,dmg:o.ad||10,life:1,nm:'Arcane Bolt'},
   q:{k:'zone',cd:5.5,r:130,dur:4,dps:o.qd||15,sl:2,nm:'Gravity Well'},
   e:{k:'blink',cd:6,dist:o.ed||260,nm:'Arcane Step'},
   r:{k:'beam',cd:14,len:620,w:44,dur:1.2,dmg:o.rd||11,st:.3,nm:'Arcane Lance'}}},
 storm:(o={})=>{const s=o.spd||580;
  return{a:{k:'proj',cd:.34,spd:s,r:7,dmg:o.ad||7,life:.6,nm:'Spark'},
   q:{k:'chain',cd:4.5,n:o.n||5,rng:300,dmg:o.qd||15,st:.25,nm:'Chain Bolt'},
   e:{k:'blink',cd:5,dist:280,to:1,nm:'Leap'},
   r:{k:'nova',cd:14,cur:1,r:100,dmg:o.rd||46,delay:.8,nm:'Thunder Call'}}},
 pyro:(o={})=>{const s=o.spd||480;
  return{a:{k:'proj',cd:.45,spd:s,r:10,dmg:o.ad||8,life:.5,dot:{d:4,t:2},ps:'fire',nm:'Ember'},
   q:{k:'cone',cd:5,r:150,arc:1.5,dmg:o.qd||24,dot:{d:7,t:3},nm:'Flame Breath'},
   e:{k:'dash',cd:5,dist:230,nova:{r:66,dmg:15,dot:{d:5,t:2}},nm:'Fire Dash'},
   r:{k:'rain',cd:14,n:10,rad:175,r:48,dmg:o.rd||21,gap:.09,nm:'Meteor Rain'}}},
 cryo:(o={})=>{const s=o.spd||470;
  return{a:{k:'proj',cd:.46,spd:s,r:9,dmg:o.ad||7,life:.9,sl:.6,nm:'Frost Bolt'},
   q:{k:'nova',cd:5.5,r:120,dmg:11,delay:.15,sl:2,nm:'Frost Nova'},
   e:{k:'blink',cd:5.5,dist:240,nm:'Glide'},
   r:{k:'proj',cd:14,spd:190,r:38,dmg:o.rd||46,life:3,sl:2,nm:'Absolute Zero'}}},
 shade:(o={})=>{const s=o.spd||400;
  return{a:{k:'proj',cd:.46,spd:s,r:12,dmg:o.ad||10,life:1.1,ps:'dark',nm:'Umbra'},
   q:{k:'nova',cd:5,cur:1,r:100,dmg:o.qd||25,delay:.7,nm:'Void Pit'},
   e:{k:'blink',cd:6,dist:220,nm:'Shade Step'},
   r:{k:'proj',cd:15,spd:160,r:36,dmg:o.rd||50,life:3.5,sl:2,nm:'Black Hole'}}},
 sniper:(o={})=>{const s=o.spd||780;
  return{a:{k:'proj',cd:.26,spd:s,r:5,dmg:o.ad||5,life:.4,pierce:1,nm:'Snap Shot'},
   q:{k:'proj',cd:4,n:5,spread:.8,spd:s*.9,r:6,dmg:o.qd||8,life:.5,nm:'Burst'},
   e:{k:'blink',cd:4,dist:300,to:1,nm:'Slide'},
   r:{k:'proj',cd:13,spd:s*1.1,r:26,dmg:o.rd||38,life:1,pierce:1,nm:'Piercing Shot'}}},
 brawler:(o={})=>{const s=o.spd||440;
  return{a:{k:'proj',cd:.5,spd:s,r:12,dmg:o.ad||10,life:.3,nm:'Punch'},
   q:{k:'nova',cd:5,r:110,dmg:o.qd||23,delay:.3,kb:40,nm:'Slam'},
   e:{k:'dash',cd:5,dist:200,nova:{r:80,dmg:17},nm:'Charge'},
   r:{k:'nova',cd:15,cur:1,r:130,dmg:o.rd||43,delay:1,kb:90,nm:'Ground Pound'}}},
 tank:(o={})=>{const s=o.spd||400;
  return{a:{k:'proj',cd:.55,spd:s,r:13,dmg:o.ad||10,life:.3,nm:'Bash'},
   q:{k:'nova',cd:5,r:120,dmg:o.qd||22,delay:.35,nm:'Quake'},
   e:{k:'shield',cd:9,dur:o.sh||3,nm:'Bulwark'},
   r:{k:'nova',cd:15,r:o.rad||165,dmg:o.rd||48,delay:.6,kb:110,nm:'Cataclysm'}}},
 guardian:(o={})=>{const s=o.spd||500;
  return{a:{k:'proj',cd:.45,spd:s,r:9,dmg:o.ad||7,life:.7,nm:'Ward Bolt'},
   q:{k:'shield',cd:8,dur:o.sh||3.5,nm:'Sanctuary'},
   e:{k:'haste',cd:10,dur:4,sh:1.5,nm:'Empower'},
   r:{k:'heal',cd:16,amt:o.heal||50,nm:'Dawnlight'}}},
 assassin:(o={})=>{const s=o.spd||660;
  return{a:{k:'cone',cd:.3,r:92,arc:2.4,dmg:o.ad||12,ls:.15,nm:'Reap'},
   q:{k:'proj',cd:4,n:3,spread:.4,spd:s,r:9,dmg:o.qd||13,life:.4,nm:'Fan of Blades'},
   e:{k:'blink',cd:3.5,dist:300,to:1,nm:'Vanish'},
   r:{k:'nova',cd:14,r:90,dmg:o.rd||50,delay:.45,sl:.5,nm:'Execute'}}},
 archer:(o={})=>{const s=o.spd||700;
  return{a:{k:'proj',cd:.5,spd:s,r:6,dmg:o.ad||9,life:.8,ps:'arrow',nm:'Arrow'},
   q:{k:'proj',cd:4.5,n:4,spread:.9,spd:s*.85,r:9,dmg:o.qd||11,life:.6,nm:'Volley'},
   e:{k:'dash',cd:4.5,dist:290,nova:{r:50,dmg:10},nm:'Roll'},
   r:{k:'rain',cd:14,n:12,rad:170,r:34,dmg:o.rd||18,gap:.06,fs:'bolt',nm:'Arrow Storm'}}},
 artillery:(o={})=>{
  return{a:{k:'proj',cd:.6,spd:o.spd||340,r:16,dmg:o.ad||12,life:.8,ps:'rock',nm:'Shell'},
   q:{k:'nova',cd:6,r:150,dmg:o.qd||30,delay:.6,kb:70,nm:'Barrage'},
   e:{k:'dash',cd:5.5,dist:230,nova:{r:70,dmg:16},nm:'Reposition'},
   r:{k:'zone',cd:15,cur:1,r:190,dur:5,dps:o.rd||20,pull:80,nm:'Siege Zone'}}},
 toxic:(o={})=>{const s=o.spd||520;
  return{a:{k:'proj',cd:.42,spd:s,r:8,dmg:o.ad||7,life:.6,dot:{d:5,t:3},nm:'Toxin'},
   q:{k:'zone',cd:5.5,r:125,dur:5,dps:o.qd||14,sl:1.2,nm:'Gas Cloud'},
   e:{k:'blink',cd:5,dist:260,nm:'Slip'},
   r:{k:'mine',cd:13,r:105,dmg:o.rd||40,st:1,nm:'Blast Flask'}}},
 nature:(o={})=>{const s=o.spd||520;
  return{a:{k:'proj',cd:.46,spd:s,r:9,dmg:o.ad||8,life:.7,ps:'leaf',nm:'Thorn'},
   q:{k:'zone',cd:5.5,r:140,dur:5,dps:o.qd||14,heal:.06,nm:'Bloom Field'},
   e:{k:'haste',cd:9,dur:4,sh:1.2,nm:'Wild Surge'},
   r:{k:'heal',cd:15,amt:o.heal||45,nm:'Verdant Grace'}}},
 knight:(o={})=>{const s=o.spd||680;
  return{a:{k:'proj',cd:.42,spd:s,r:8,dmg:o.ad||8,life:.6,nm:'Light Lance'},
   q:{k:'proj',cd:4.5,n:4,spread:6.2832,spd:s*.75,r:10,dmg:o.qd||12,life:.6,nm:'Holy Ring'},
   e:{k:'shield',cd:9,dur:2.5,nm:'Aegis'},
   r:{k:'beam',cd:14,len:660,w:40,dur:1.1,dmg:o.rd||10,st:.4,nm:'Judgement'}}},
 gunner:(o={})=>{const s=o.spd||820;
  return{a:{k:'proj',cd:.24,spd:s,r:5,dmg:o.ad||5,life:.3,ps:'bullet',nm:'Pistol'},
   q:{k:'proj',cd:3.5,n:6,spread:.7,spd:s*.9,r:6,dmg:o.qd||7,life:.35,nm:'Spray'},
   e:{k:'dash',cd:4,dist:300,nova:{r:45,dmg:8},nm:'Roll'},
   r:{k:'cone',cd:13,r:200,arc:.8,dmg:o.rd||30,nm:'Suppressor Fire'}}},
 beast:(o={})=>{const s=o.spd||540;
  return{a:{k:'proj',cd:.26,spd:s,r:7,dmg:o.ad||6,life:.25,nm:'Claw'},
   q:{k:'proj',cd:4,n:6,spread:1,spd:s*.9,r:6,dmg:o.qd||6,life:.3,nm:'Claw Storm'},
   e:{k:'dash',cd:4.5,dist:260,nova:{r:55,dmg:12},nm:'Pounce'},
   r:{k:'nova',cd:14,r:125,dmg:o.rd||36,delay:.4,ls:.2,nm:'Frenzy'}}},
 mystic:(o={})=>{const s=o.spd||460;
  return{a:{k:'proj',cd:.45,spd:s,r:9,dmg:o.ad||7,life:.8,home:1,nm:'Spirit'},
   q:{k:'mine',cd:5,r:105,dmg:o.qd||30,st:.8,nm:'Seal'},
   e:{k:'blink',cd:5,dist:290,to:1,nm:'Fade'},
   r:{k:'orbit',cd:13,n:5,rad:85,dur:7,dmg:o.rd||14,nm:'Spirit Ring'}}},
 trickster:(o={})=>{const s=o.spd||600;
  return{a:{k:'proj',cd:.3,spd:s,r:6,dmg:o.ad||6,life:.4,pierce:1,nm:'Illusion Dart'},
   q:{k:'proj',cd:4,n:3,spread:0,spd:s*1.3,r:9,dmg:o.qd||13,life:.5,nm:'Mirror Volley'},
   e:{k:'blink',cd:3.5,dist:320,to:1,nm:'Blink'},
   r:{k:'nova',cd:13,cur:1,r:150,dmg:o.rd||40,delay:.3,nm:'Prank'}}},
};

// ---------------------------------------------------------------- the 100
// [name, title, kit, weapon, gear, hair, acc, hp, sp, extras]
const COLS=['#f87171','#fb923c','#facc15','#4ade80','#22d3ee','#60a5fa','#a78bfa','#f472b6'];
const ROSTER=[
 // 1-10 iron wall
 ['Aldric','Iron Vanguard','tank','hammer','armor','short','helm',148,185,{cc:'#475569'}],
 ['Bramar','Shieldwall','tank','axe','armor','mohawk','helm',155,180,{bc:'#1e3a8a'}],
 ['Hakon','Runeguard','tank','gsword','armor','short','halo',145,185,{cc:'#334155'}],
 ['Faron','Frostclad','tank','hammer','armor','short','helm',152,180,{bc:'#0ea5e9'}],
 ['Orrin','Stonebreaker','tank','hammer','armor','bald','helm',150,182,{bc:'#78350f'}],
 ['Ursa','Iron Maiden','tank','gsword','armor','long','crown',146,183,{cc:'#450a0a'}],
 ['Sivan','Frostguard','guardian','lance','armor+cape','long','halo',138,192,{bc:'#0369a1'}],
 ['Brant','Shieldbearer','guardian','lance','armor+cape','short','helm',136,190,{bc:'#1d4ed8'}],
 ['Hollis','Pillar Knight','guardian','hammer','armor','short','helm',140,185,{bc:'#64748b'}],
 ['Lorn','Boulder Breaker','artillery','hammer','armor','mohawk','helm',150,180,{fc:'#a8a29e'}],
 // 11-20 blade dance
 ['Gale','Zephyr Cut','blade','katana','light+cape','pony','band',92,250,{cc:'#86efac'}],
 ['Yara','Blade Dancer','blade','sword','light+cape','twin','star',90,255,{cc:'#f472b6'}],
 ['Osric','Rune Blade','blade','sword','armor','short','halo',115,205,{cc:'#38bdf8'}],
 ['Jarl','Stormcleaver','blade','axe','gi','mohawk','band',120,210,{fc:'#38bdf8',bc:'#1e3a8a'}],
 ['Nima','Sand Duelist','duelist','katana','coat','pony','scarf',90,250,{cc:'#d97706'}],
 ['Koda','Tide Warden','duelist','sword','coat','spiky','band',95,245,{bc:'#0ea5e9'}],
 ['Rhea','Stormsinger','duelist','katana','light+cape','long','mask',93,248,{cc:'#c084fc'}],
 ['Quen','Quill Duelist','duelist','dagger','coat','bob','band',88,252,{cc:'#a3e635'}],
 ['Dahlia','Petal Duelist','duelist','dagger','dress','long',null,90,246,{cc:'#f472b6'}],
 ['Maro','Magma Fist','brawler','fist','gi','spiky','band',135,190,{fc:'#f97316',bc:'#b91c1c'}],
 // 21-30 storm and sky
 ['Ulric','Storm Herald','storm','staff','robe+cape','long','crown',95,220,{cc:'#eab308'}],
 ['Draven','Storm Lancer','storm','lance','tech','short','goggles',110,230,{cc:'#38bdf8'}],
 ['Cyra','Stormsinger','storm','wand','robe','long','star',90,225,{cc:'#c084fc'}],
 ['Wrenly','Stormrider','storm','kunai','ninja','spiky','band',92,242,{bc:'#facc15'}],
 ['Torvald','Siege Breaker','artillery','cannon','tech','bald','goggles',160,175,{bc:'#a16207'}],
 ['Xerath','Gunmage','gunner','mega','tech','bald','goggles',108,235,{bc:'#f43f5e'}],
 ['Brix','Wall Gunner','gunner','gun','tech','short','goggles',105,235,{bc:'#0ea5e9'}],
 ['Dorn','Embershot','gunner','gun','coat','short','goggles',100,240,{bc:'#f97316'}],
 ['Kestrel','Windshot','sniper','rifle','light+cape','short','goggles',84,258,{bc:'#4ade80'}],
 ['Fenn','Fen Scout','sniper','rifle','coat','short','goggles',85,250,{bc:'#22c55e'}],
 // 31-40 flame and ash
 ['Ashen','Ash Walker','pyro','flamer','coat','wild','goggles',105,215,{bc:'#f97316'}],
 ['Cinder','Coal Stalker','pyro','sword','vest','wild','mask',100,225,{fc:'#fb923c'}],
 ['Ulla','Ember Mystic','pyro','orb','robe','long','wizhat',90,215,{cc:'#fb923c'}],
 ['Rhun','Emberclad','pyro','sword','coat','spiky','band',102,228,{bc:'#dc2626'}],
 ['Zolt','Magma Breaker','brawler','hammer','armor','mohawk','horn',140,185,{fc:'#ea580c'}],
 ['Merek','Stonefist','brawler','fist','armor','bald','helm',142,184,{fc:'#a8a29e'}],
 ['Joryn','Frostjaw','beast','claws','light+tail','wild','horn',100,240,{tc:'#7dd3fc',fc:'#7dd3fc'}],
 ['Falk','Ironhowl','beast','axe','vest','wild','horn',120,205,{fc:'#a16207'}],
 ['Tamsin','Ranger','sniper','rifle','coat','short','goggles',85,255,{bc:'#4ade80'}],
 ['Halden','Hearthguard','guardian','hammer','coat','short','band',115,195,{bc:'#ea580c'}],
 // 41-50 frost and void
 ['Vesna','Frostbind','cryo','wand','robe','long',null,88,215,{cc:'#0ea5e9'}],
 ['Pia','Frostweaver','cryo','staff','robe+cape','long','wizhat',90,210,{cc:'#7dd3fc'}],
 ['Eira','Frost Archer','cryo','bow','coat','long',null,92,230,{cc:'#bae6fd'}],
 ['Isolde','Frostarrow','cryo','bow','coat','pony',null,90,235,{cc:'#e0f2fe'}],
 ['Nyxen','Void Walker','shade','dagger','ninja+hood','short','mask',90,225,{face:'glow',cc:'#6d28d9'}],
 ['Vale','Shadowstep','shade','dagger','ninja+hood','short','blind',88,248,{cc:'#1e1b4b'}],
 ['Grim','Gravedigger','shade','scythe','robe+hood','long','horn',95,215,{face:'skull',cc:'#334155'}],
 ['Yorick','Graveguard','shade','scythe','robe+hood','long','horn',105,205,{face:'skull',cc:'#1c1917'}],
 ['Juno','Staroracle','mystic','orb','robe+cape','long','crown',90,215,{cc:'#a5b4fc'}],
 ['Kess','Rune Scribe','mystic','bstaff','robe+hood','long','wizhat',88,200,{face:'glow',cc:'#818cf8'}],
 // 51-60 shadow and poison
 ['Sable','Quiet Knife','assassin','dagger','ninja','short','mask',85,255,{cc:'#1e293b'}],
 ['Lune','Moonshadow','assassin','dagger','ninja+hood','long','mask',88,250,{cc:'#4c1d95'}],
 ['Voss','Blackblade','assassin','katana','ninja','short','mask',86,255,{cc:'#0f172a'}],
 ['Ashra','Nightblade','assassin','dagger','ninja+hood','pony','mask',85,255,{cc:'#312e81'}],
 ['Iva','Toxin Weaver','toxic','wand','coat+hood','bob','goggles',92,220,{cc:'#84cc16'}],
 ['Mirelle','Mire Keeper','toxic','staff','robe','long',null,95,210,{cc:'#65a30d'}],
 ['Xenia','Venomblade','toxic','katana','ninja','pony','mask',90,246,{cc:'#4d7c0f'}],
 ['Liora','Venom Dancer','toxic','dagger','light+tail','pony','ears',90,245,{tc:'#a3e635'}],
 ['Odal','Salt Merchant','trickster','dagger','coat','pony','band',88,245,{cc:'#0891b2'}],
 ['Quill','Ink Scribe','trickster','tome','coat+hood','bob',null,90,230,{face:'glow',cc:'#4c1d95'}],
 // 61-70 court and shrine
 ['Ilyra','Dawn Warden','knight','lance','armor+cape','long','halo',110,210,{cc:'#fde68a'}],
 ['Ysolde','Gilded Blade','knight','gsword','armor+cape','long','crown',115,205,{cc:'#ca8a04'}],
 ['Perrin','Wall Spear','knight','spear','armor','short','helm',135,185,{bc:'#334155'}],
 ['Elowen','Dawnblade','knight','gsword','armor+cape','long','halo',112,208,{cc:'#fef08a'}],
 ['Zaina','Dawncaller','knight','lance','robe+cape','long','halo',108,212,{cc:'#fde68a'}],
 ['Wynne','Hearthguard','guardian','staff','robe+cape','long','halo',100,205,{cc:'#fbbf24'}],
 ['Aurora','Light Weaver','guardian','orb','robe+cape','long','halo',95,215,{cc:'#f0abfc'}],
 ['Gilda','Goldweaver','trickster','wand','dress+cape','bob','crown',92,235,{cc:'#facc15'}],
 ['Emberlyn','Ashen Sage','mystic','staff','robe','long','wizhat',90,205,{cc:'#f59e0b'}],
 ['Sabin','Bone Warden','tank','axe','armor','mohawk','horn',148,181,{face:'rage',fc:'#e7e5e4'}],
 // 71-80 wild and green
 ['Rhoswen','Thorn Matron','nature','staff','robe+cape','long','halo',100,205,{cc:'#15803d'}],
 ['Nyla','Nightbloom','nature','staff','robe','long','halo',98,208,{cc:'#7c3aed'}],
 ['Auri','Thorncaller','nature','staff','coat','pony','ears',95,212,{cc:'#4d7c0f'}],
 ['Brannon','Hollow Knight','tank','gsword','armor+cape','short','helm',140,186,{cc:'#1c1917'}],
 ['Dexter','Rune Duelist','duelist','katana','tech','spiky','goggles',95,242,{bc:'#22d3ee'}],
 ['Torrin','Greenclad','nature','spear','gi','pony','band',112,205,{bc:'#14532d'}],
 ['Fen','Bogwarden','toxic','staff','robe+hood','long','horn',105,200,{cc:'#365314'}],
 ['Grove','Treespeaker','nature','staff','robe','long','halo',92,215,{cc:'#15803d'}],
 ['Thorn','Brambleblade','beast','claws','light+tail','wild','horn',105,235,{tc:'#4ade80'}],
 ['Moss','Stonewarden','tank','hammer','armor','bald','helm',135,190,{fc:'#4ade80'}],
 // 81-90 bows and wind
 ['Wren','Quickdraw','sniper','bow','light+cape','pony','band',85,260,{bc:'#84cc16'}],
 ['Calla','Moon Huntress','archer','bow','ninja','pony','mask',92,240,{cc:'#c4b5fd'}],
 ['Tor','Sky Archer','archer','bow','light+cape','pony','star',90,245,{cc:'#7dd3fc'}],
 ['Robin','Redtail','archer','bow','coat','short','band',93,238,{cc:'#f87171'}],
 ['Sabryl','Longshot','sniper','bow','coat','long','mask',84,256,{cc:'#a3e635'}],
 ['Wind','Gale Walker','blade','katana','light+cape','pony','band',91,252,{cc:'#a7f3d0'}],
 ['Zephiro','Draft Cut','duelist','dagger','light+cape','pony','star',89,250,{cc:'#6ee7b7'}],
 ['Kite','Skyline','sniper','rifle','light+cape','short','goggles',85,252,{bc:'#7dd3fc'}],
 ['Falcon','Talonshot','sniper','rifle','coat','short','band',86,250,{bc:'#a16207'}],
 ['Raven','Nightfeather','assassin','dagger','ninja+hood','long','mask',87,253,{cc:'#312e81'}],
 // 91-100 tricksters and wildcards
 ['Pixie','Glitter Thief','trickster','wand','dress','twin','ears',88,248,{cc:'#f9a8d4'}],
 ['Sprig','Mischief Sprout','trickster','dagger','light+cape','short','ears',87,247,{cc:'#86efac'}],
 ['Jinx','Hex Weaver','trickster','orb','coat+hood','spiky','mask',90,243,{face:'glow',cc:'#f43f5e'}],
 ['Puck','Gnome Trick','trickster','tome','coat','short','hat',89,245,{cc:'#a3e635'}],
 ['Mirage','Glass Weaver','trickster','wand','robe','long','halo',92,240,{cc:'#67e8f9'}],
 ['Echo','Twinblade','assassin','dagger','ninja','bob','blind',86,254,{cc:'#6b7280'}],
 ['Rift','Crackling','storm','kunai','tech','spiky','goggles',94,238,{bc:'#22d3ee'}],
 ['Nova','Starfall','mage','staff','robe+cape','long','crown',92,212,{cc:'#fde047'}],
 ['Zenith','Peak Blade','blade','gsword','armor+cape','short','halo',118,204,{cc:'#fef9c3'}],
 ['Aurum','Gilded Shadow','shade','scythe','ninja+hood','long','crown',100,218,{cc:'#a16207'}],
];

// ---------------------------------------------------------------- rarity tiers
// Without this every generated character lands in "epic", because data.js only knows the
// hand-written START/RARE/LEGEND lists. Tier follows the kit: bulky or cast-heavy kits are
// legendary, twitchy ones rare, the rest epic.
const LEGEND_KIT=new Set(['tank','knight','artillery','guardian']),
      RARE_KIT=new Set(['blade','duelist','assassin','sniper','trickster','gunner']);

// ---------------------------------------------------------------- build + validate
const KNOWN_WPN=new Set('sword gsword katana dagger spear lance axe hammer scythe club staff bstaff wand orb tome bow gun rifle shotgun cannon flamer bomb kunai fist claws mega'.split(' '));
const KNOWN_ACC=new Set('scarf tmask tusk hat band horn bow mask halo crown ears star goggles wizhat helm blind gob none'.split(' '));
const KNOWN_HS=new Set('long pony twin bob wild spiky mohawk flame short bald'.split(' '));
const KNOWN_GR=new Set('robe hood wings tail cape rag bare armor coat dress tech ninja gi vest light'.split(' '));
const KNOWN_KIND=new Set(['proj','cone','beam','orbit','rain','mine','chain','zone','nova','dash','blink','shield','heal','haste']);

const names=new Set(),err=[];
for(const r of ROSTER){
  const[n,t,k,w,gr,hs,acc,hp,sp]=r;
  if(names.has(n))err.push('duplicate name: '+n); names.add(n);
  if(!/^[A-Za-z]{2,12}$/.test(n))err.push('name must be 2-12 letters (api/_lib.js HERO regex): '+n);
  if(t.length>26)err.push('title longer than 26 chars: '+t);
  if(!K[k])err.push('unknown kit: '+k);
  if(!KNOWN_WPN.has(w))err.push(n+': unknown weapon "'+w+'"');
  if(!KNOWN_HS.has(hs))err.push(n+': unknown hair "'+hs+'"');
  if(acc&&!KNOWN_ACC.has(acc))err.push(n+': unknown acc "'+acc+'"');
  for(const part of gr.split('+'))if(!KNOWN_GR.has(part))err.push(n+': unknown gear token "'+part+'"');
  if(hp<80||hp>170)err.push(n+': hp '+hp+' outside 80-170');
  if(sp<170||sp>260)err.push(n+': sp '+sp+' outside 170-260');
  const kit=K[k]();
  for(const s of['a','q','e','r']){
   const sk=kit[s];
   if(!KNOWN_KIND.has(sk.k))err.push(n+'.'+s+': unknown skill kind '+sk.k);
   if(!(sk.cd>0))err.push(n+'.'+s+': missing cd');
   if(!sk.nm)err.push(n+'.'+s+': missing nm');
   if(sk.k=='dash'&&(!sk.nova||!sk.nova.dmg))err.push(n+'.'+s+': dash needs nova.dmg');
   if(sk.k=='zone'&&!(sk.dps||sk.heal))err.push(n+'.'+s+': zone needs dps or heal');
   if(sk.k=='shield'&&!sk.dur)err.push(n+'.'+s+': shield needs dur');
   if(sk.k=='heal'&&!sk.amt)err.push(n+'.'+s+': heal needs amt');
  }
}
if(ROSTER.length!==100)err.push('roster must hold exactly 100 characters, has '+ROSTER.length);

// a name collision is silent and nasty: chi() returns the first match, so the later
// character becomes unreachable and both share one LOOK entry. Catch it against the
// hand-written roster that data.js defines before CH.push(...ROSTER).
const dataSrc=fs.readFileSync(path.join(root,'js','data.js'),'utf8');
const head=dataSrc.slice(0,dataSrc.indexOf('CH.push(...ROSTER)'));
const existing=new Set();
for(const m of head.matchAll(/\{n:'([^']+)'/g))existing.add(m[1]);
for(const m of head.matchAll(/^\s*'?([A-Za-z][A-Za-z ]*)'?:\s*\[/gm))existing.add(m[1]);
for(const r of ROSTER)if(existing.has(r[0]))err.push('name collides with an existing character: '+r[0]+' (chi() would return the wrong index)');

if(err.length){console.error('ROSTER PROBLEMS ('+err.length+'):\n  '+err.join('\n  '));process.exit(1)}
console.log('roster ok: '+ROSTER.length+' characters, names valid, kits valid, looks within the art vocabulary');

if(process.argv.includes('--check'))process.exit(0);

// ---------------------------------------------------------------- emit
const lit=o=>JSON.stringify(o).replace(/"/g,"'");
const chars=ROSTER.map(([n,t,k,w,gr,hs,acc,hp,sp,ex])=>{
  const kit=K[k]();
  return`{n:'${n}',t:'${t}',col:'${COLS[n.length%8]}',hair:'${COLS[(n.length*3+2)%8]}'`+
   (acc?`,acc:'${acc}'`:'')+`,hp:${hp},sp:${sp},s:{`+
   ['a','q','e','r'].map(q=>q+':'+lit(kit[q])).join(',')+'}}';
});
const looks=ROSTER.map(([n,t,k,w,gr,hs,acc,hp,sp,ex])=>
 `${n}:['${w}','${gr}','${hs}',{${Object.entries(ex).map(([a,b])=>a+':'+(typeof b=='string'?lit(b):b)).join(',')}}]`);
const rareR=ROSTER.filter(r=>RARE_KIT.has(r[2])).map(r=>"'"+r[0]+"'");
const legR=ROSTER.filter(r=>LEGEND_KIT.has(r[2])).map(r=>"'"+r[0]+"'");

const out=`// GENERATED by tools/gen-roster.js - do not edit by hand.
// 100 extra playable characters. data.js merges these into CH and LOOK before its
// post-processing passes, so they get rarity tiers and shot art like the original roster.
const ROSTER=[
${chars.join(',\n')}];
const LOOK_R={
${looks.join(',\n')}};
// merged into the rarity tiers by data.js: rare = ${rareR.length}, legendary = ${legR.length}
const RARE_R=[${rareR.join(',')}];
const LEGEND_R=[${legR.join(',')}];
`;
fs.writeFileSync(path.join(root,'js','roster.js'),out);
console.log('wrote js/roster.js ('+(out.length/1024).toFixed(1)+' KB) · tiers: '+rareR.length+' rare, '+legR.length+' legendary, '+(ROSTER.length-rareR.length-legR.length)+' epic');