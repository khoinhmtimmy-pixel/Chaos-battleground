@echo off
rem Chay thu Chaos Battleground tren may nay: bat server local va mo game trong trinh duyet.
rem Bam dup vao file nay. Dong cua so de tat server.
title Chaos Battleground - local server
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 goto nonode
node dev-server.js --open
echo.
echo Server da dung.
pause
exit /b
:nonode
echo Chua cai Node.js tren may nay.
echo Tai ban LTS tai https://nodejs.org , cai xong roi bam dup lai file nay.
pause
exit /b 1
