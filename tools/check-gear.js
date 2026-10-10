// sanity checks for the accessory system. Run: node tools/check-gear.js
const fs=require('fs'),path=require('path'),root=path.join(__dirname,'..');
const src=fs.readFileSync(path.join(root,'js','data.js'),'utf8');
const m=src.match(/const GEAR=\[([\s\S]*?)\];\r?\nconst GBY/);
if(!m){console.error('could not find the GEAR table in js/data.js');process.exit(1)}
const GEAR=eval('['+m[1]+']');
const lib=fs.readFileSync(path.join(root,'api','_lib.js'),'utf8');
const gm=lib.match(/GEARID=\/\^\(hb\|ch\|au\)_\[a-z\]\{(\d+),(\d+)\}\$\//);
const GEARID=gm?new RegExp('^(hb|ch|au)_[a-z]{'+gm[1]+','+gm[2]+'}$'):null;

let bad=0;
const ids=new Set();
for(const g of GEAR){
  if(ids.has(g.id)){console.error('duplicate id: '+g.id);bad++}
  ids.add(g.id);
  if(!GEARID||!GEARID.test(g.id)){console.error('server regex rejects id: '+g.id);bad++}
  if(!['head','charm','aura'].includes(g.sl)){console.error('bad slot on '+g.id+': '+g.sl);bad++}
  if(!GBY_KEY(g.art)){console.error('no art key for '+g.id+' ('+g.art+')');bad++}
}
function GBY_KEY(a){return /^(gband|gvisor|ghood|ghorn|gant|ggoggles|gcrown|ghelm|ghalo|gmask|gastral|gorb|gfire|gice|gshur|gbell|grune|gblood|gprism|gvoid|grelic|gaur|gaurf|gaura|gaurt|gaurn|gaurg|gaurd|gaurh|gaurv|gaurdr)$/.test(a)}

// every art key the table uses must be handled by a draw function in js/art.js
const art=fs.readFileSync(path.join(root,'js','art.js'),'utf8');
for(const g of GEAR){
  const re=new RegExp("a=='"+g.art+"'|// "+g.art);
  if(!re.test(art)){console.error('art.js never draws '+g.art+' (used by '+g.id+')');bad++}
}

// slot/rarity sanity, plus the true best set (one piece per slot, so 3 items max)
const slots={};for(const g of GEAR)(slots[g.sl]=slots[g.sl]||[]).push(g);
for(const s in slots){
  if(slots[s].length<5){console.error('slot '+s+' only has '+slots[s].length+' pieces');bad++}
  if(!slots[s].some(g=>g.rar===4)){console.error('slot '+s+' has no legendary');bad++}
}
function setFor(only,score){const m={hp:1,sh:1,dm:1,sp:1,ls:0,cd:1};
 for(const s in slots){let best=null,bv=-1e9;
  for(const g of slots[s]){if(only&&g.rar!==only)continue;const v=score(g.b);if(v>bv){bv=v;best=g}}
  if(best)for(const k in m){if(k==='cd')m.cd*=best.b.cd||1;else if(k==='ls')m.ls+=best.b.ls||0;else m[k]*=1+(best.b[k]||0)}}
 return m}
const fmt=m=>'hp x'+m.hp.toFixed(2)+', sh x'+m.sh.toFixed(2)+', dm x'+m.dm.toFixed(2)+', sp x'+m.sp.toFixed(2)+', ls +'+Math.round(m.ls*100)+'%, cd x'+m.cd.toFixed(2);
console.log('pieces: '+GEAR.length+'  ids unique: '+(bad?'NO':'yes'));
console.log('best legendary set -> '+fmt(setFor(4,b=>Object.keys(b).reduce((a,k)=>a+b[k],0))));
// gear should stay a secondary axis: a fully-invested stat column is x1.80, so the best
// possible gear set may not beat it on the stat it favours
const worst=setFor(4,b=>b.dm||0);
if(worst.dm>1.8){console.error('gear damage scaling x'+worst.dm.toFixed(2)+' overtakes a maxed stat column (x1.80)');bad++}
process.exit(bad?1:0);