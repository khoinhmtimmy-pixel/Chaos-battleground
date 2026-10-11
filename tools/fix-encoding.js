// Repairs UTF-8 that was double-encoded by a PowerShell round trip
// (Get-Content without -Encoding read UTF-8 as the ANSI codepage, then Set-Content -Encoding
// UTF8 wrote it back). Symptom: Vietnamese reads as "sÃ¡t thÆ°Æ¡ng" instead of "sát thương".
//   node tools/fix-encoding.js           -> dry run, changes nothing
//   node tools/fix-encoding.js --apply   -> repair in place
//
// ASCII is a fixed point of this transform, so running it across a whole file is safe.
// A BOM is stripped first, otherwise it would turn into three mojibake characters.
const fs=require('fs'),path=require('path'),root=path.join(__dirname,'..');

// Windows-1252, not ISO-8859-1: PowerShell's ANSI codepage is cp1252 and the two differ across
// 0x80-0x9F, which is exactly where the emoji live. This Node build has no ICU, so the table is
// written out by hand and must be exactly 32 entries for 0x80..0x9F - putting the word
// "undefined" in a slot instead of a placeholder shifts every index after it.
const C1252=['€',null,'‚','ƒ','„','…','†','‡','ˆ','‰','Š','‹','Œ',null,'Ž',null,null,
             '‘','’','“','”','•','–','—','˜','™','š','›','œ',null,'ž','Ÿ'];
// the table is easy to mistype and a short one silently shifts every index after the gap
if(C1252.length!==32){console.error('cp1252 table must hold exactly 32 entries, has '+C1252.length);process.exit(1)}
if(C1252[0x9A-0x80]!=='š'||C1252[0x94-0x80]!=='”'||C1252[0x85-0x80]!=='…'){
 console.error('cp1252 table is misaligned');process.exit(1)}
function toCp1252(s){
 const b=Buffer.alloc(s.length);
 for(let i=0;i<s.length;i++){
  const c=s.charCodeAt(i);
  if(c<0x80||(c>=0xA0&&c<=0xFF)||(c>=0x80&&c<=0x9F)){b[i]=c;continue}
  const j=C1252.indexOf(s[i]);
  b[i]=j<0?0x3F:0x80+j;                      // 0x3F = '?' if truly unmappable
 }
 return b}
const fromCp1252=b=>{let s='';for(const v of b)s+=String.fromCharCode(v);return s};
const utf8=b=>b.toString('utf8');

// Signature of UTF-8-read-as-Latin-1: a lead byte C2/C3/E2 followed by a Latin-1 continuation
// character, or a decoder replacement character.
const MOJI=/[\u00C2\u00C3\u00E2][\u0080-\u00BF]|\uFFFD/g;
const count=s=>(s.match(MOJI)||[]).length;

const TARGETS=['js/data.js','js/meta.js','js/art.js','js/game.js','js/net.js','js/roster.js',
 'js/config.js','index.html','style.css','README.md','api/_lib.js','api/auth.js','api/admin.js','api/save.js'];

const apply=process.argv.includes('--apply');
let before=0,after=0,changed=0;

for(const rel of TARGETS){
  const p=path.join(root,rel);
  if(!fs.existsSync(p))continue;
  const raw=fs.readFileSync(p);
  const hadBom=raw.length>=3&&raw[0]===0xEF&&raw[1]===0xBB&&raw[2]===0xBF;
  const body=hadBom?raw.subarray(3):raw;
  const once=utf8(body);
  // undo the double encode: take the mojibake TEXT, push it back through cp1252 to recover the
  // original UTF-8 bytes, then decode those
  const twice=utf8(toCp1252(once));
  const b=count(once),a=count(twice);
  if(b===0&&!hadBom)continue;
  before+=b; after+=a;
  if(a<b){
    console.log('  repair  '+rel+'   '+b+' -> '+a+'   bom:'+(hadBom?'stripped':'none'));
    if(apply){fs.writeFileSync(p,Buffer.from(twice,'utf8'));changed++}
  }else if(hadBom){
    console.log('  bom     '+rel+'   text already clean, stripping BOM');
    if(apply){fs.writeFileSync(p,body);changed++}
  }else{
    console.log('  leave   '+rel+'   '+b+' -> '+a+'   (round trip would not help)');
  }
}
console.log(apply
  ?'\nrepaired '+changed+' file(s); mojibake markers '+before+' -> '+after
  :'\ndry run: '+before+' markers would drop to '+after+' - run with --apply to write');