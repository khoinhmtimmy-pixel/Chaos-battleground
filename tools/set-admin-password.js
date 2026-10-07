// Sets the admin password used when the game runs WITHOUT the account server (device mode) and for `node dev-server.js`.
//   node tools/set-admin-password.js            -> generates a random password
//   node tools/set-admin-password.js "MyPass"   -> uses yours (6+ characters)
// Writes the hash into js/config.js and the password into .admin-password.txt / .env.local (both git-ignored).
// On Vercel the admin password is the ADMIN_PASS environment variable instead.
const crypto=require('crypto'),fs=require('fs'),path=require('path'),root=path.join(__dirname,'..');
const pass=process.argv[2]||crypto.randomBytes(12).toString('base64url');
if(pass.length<6||pass.length>64){console.error('Password must be 6-64 characters.');process.exit(1)}
const hash=crypto.pbkdf2Sync(pass,'chaos-bg-admin',150000,32,'sha256').toString('hex');
const cfg=path.join(root,'js','config.js'),src=fs.readFileSync(cfg,'utf8');
if(!/adminHash:'[0-9a-f]*'/.test(src)){console.error('adminHash not found in js/config.js');process.exit(1)}
fs.writeFileSync(cfg,src.replace(/adminHash:'[0-9a-f]*'/,"adminHash:'"+hash+"'"));
fs.writeFileSync(path.join(root,'.admin-password.txt'),'Chaos Battleground admin\nusername: admin\npassword: '+pass+'\n\nThis file is git-ignored. Put the same password in the ADMIN_PASS environment variable on Vercel.\n');
const envf=path.join(root,'.env.local');let env='';try{env=fs.readFileSync(envf,'utf8')}catch(e){}
env=env.split(/\r?\n/).filter(l=>l&&!l.startsWith('ADMIN_PASS=')).concat('ADMIN_PASS='+pass).join('\n')+'\n';fs.writeFileSync(envf,env);
console.log('Admin password updated: js/config.js (hash), .admin-password.txt and .env.local (password, git-ignored).');
