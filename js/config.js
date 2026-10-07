// public client settings. adminHash locks the admin login when the game runs without the account server
// (it is a PBKDF2 hash, never the password itself). Change it with: node tools/set-admin-password.js
const CFG={adminUser:'admin',adminHash:'56cd8239ac3af79c89ca67f5f0a86f22a26dba31f6e959f87ccaec0c091f6167'};
