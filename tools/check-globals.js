// Every script in index.html shares one global scope, so a top-level name declared twice is a
// SyntaxError that kills the whole game, not just the feature. It has broken boot twice already:
// CMAX (game.js collided with meta.js's hero-level cap) and cast (art.js collided with game.js's
// cast()). Both shipped, both were only caught by opening the page. This catches them in a second.
//
// Reads the real script list from index.html so it cannot drift from what the browser loads.
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');

const files=[...html.matchAll(/<script[^>]+src=["'](js\/[^"']+)["']/g)].map(m=>m[1].split('?')[0]);
if(!files.length){console.error('no <script src="js/..."> tags found in index.html');process.exit(1)}

// Top-level declarations only: a match at column 0, or `const X=` anywhere is still risky because
// the minified sources put whole functions on one line but declarations still start the line.
const DECL=[
  [/^(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/gm, 'const/let'],
  [/^function\s+([A-Za-z_$][\w$]*)\s*\(/gm, 'function'],
  [/^class\s+([A-Za-z_$][\w$]*)/gm, 'class'],
];

const seen=new Map(),err=[];
for(const f of files){
  const full=path.join(root,f);
  if(!fs.existsSync(full)){err.push('listed in index.html but missing: '+f);continue}
  const src=fs.readFileSync(full,'utf8');
  // strip strings and comments so a name mentioned inside them is not counted
  const clean=src.replace(/\/\*[\s\S]*?\*\//g,' ').replace(/^\s*\/\/.*$/gm,' ')
                 .replace(/'(?:[^'\\]|\\.)*'/g,"''").replace(/"(?:[^"\\]|\\.)*"/g,'""');
  for(const [re,kind] of DECL){
    let m;
    while((m=re.exec(clean))){
      const name=m[1];
      if(seen.has(name)){
        err.push('duplicate top-level "'+name+'" ('+kind+'): '+seen.get(name).f+' and '+f);
      } else seen.set(name,{f,kind});
    }
  }
}

if(err.length){
  console.error('GLOBAL NAME COLLISIONS ('+err.length+'):\n  '+err.join('\n  '));
  console.error('\nThese are SyntaxErrors at load time and take the whole game down. Rename one side.');
  process.exit(1);
}
console.log('globals ok: '+seen.size+' top-level names across '+files.length+' scripts, no duplicates');