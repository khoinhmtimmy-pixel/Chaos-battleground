// local preview: double-click start.bat, or run `node dev-server.js` and open http://localhost:3000
// Serves the game and mounts /api the way Vercel does. Accounts go to .data/db.json; ADMIN_PASS etc. are read from .env.local.
const http=require('http'),fs=require('fs'),path=require('path');
const ROOT=__dirname,PORT=+process.env.PORT||3000,URL_='http://localhost:'+PORT,OPEN=process.argv.includes('--open');
try{for(const l of fs.readFileSync(path.join(ROOT,'.env.local'),'utf8').split(/\r?\n/)){const m=l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);if(m&&!(m[1] in process.env))process.env[m[1]]=m[2]}}catch(e){}
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon'};
http.createServer((req,res)=>{const u=new URL(req.url,'http://localhost');
 if(u.pathname.startsWith('/api/')){const name=u.pathname.slice(5),f=path.join(ROOT,'api',name+'.js');if(!/^[a-z]+$/.test(name)||!fs.existsSync(f)){res.statusCode=404;return res.end('{}')}return require(f)(req,res)}
 let rel;try{rel=decodeURIComponent(u.pathname)}catch(e){rel='/'}if(rel.endsWith('/'))rel+='index.html';
 const file=path.join(ROOT,rel),ext=path.extname(file);
 // only the game's own assets; never dotfiles, the api sources or tooling
 if(!file.startsWith(ROOT+path.sep)||rel.split('/').some(s=>s.startsWith('.'))||!MIME[ext]||/^\/(api|tools)\//.test(rel)||rel=='/dev-server.js'){res.statusCode=404;return res.end('Not found')}
 fs.readFile(file,(e,d)=>{if(e){res.statusCode=404;return res.end('Not found')}res.setHeader('Content-Type',MIME[ext]);res.setHeader('Cache-Control','no-cache');res.end(d)})
}).on('error',e=>{if(e.code!='EADDRINUSE')throw e;console.log('Port '+PORT+' is already in use, the game server is probably running already: '+URL_);if(OPEN)open();process.exitCode=1
}).listen(PORT,()=>{console.log('Chaos Battleground is running: '+URL_+'\nKeep this window open while you play. Press Ctrl+C (or close it) to stop.');if(OPEN)open()});
// --open (used by start.bat): show the game in the default browser once the server is up
function open(){const c=process.platform=='win32'?'start "" "'+URL_+'"':process.platform=='darwin'?'open "'+URL_+'"':'xdg-open "'+URL_+'"';require('child_process').exec(c,()=>{})}
