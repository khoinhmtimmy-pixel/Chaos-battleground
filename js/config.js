// public client settings. adminHash locks the admin login when the game runs without the account server
// (it is a PBKDF2 hash, never the password itself). Change it with: node tools/set-admin-password.js
const CFG={adminUser:'admin',adminHash:'df38863840718a346d03f3e67c57bc03a0eeb12c5e462cd417dfd484b7e4e295'};
