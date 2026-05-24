@echo off
title SATPAM INDONESIA JAYA
echo.
echo ========================================
echo    SATPAM INDONESIA JAYA
echo    Platform Digital Satpam Nasional
echo ========================================
echo.
echo [1/2] Install dependencies...
cd /d "%~dp0frontend"
call npm install --silent
echo.
echo [2/2] Starting development server...
echo.
echo   Local:    http://localhost:3000
echo   Network:  http://192.168.1.%RANDOM:~-1%%RANDOM:~-1%%RANDOM:~-1%:3000
echo.
echo ========================================
echo.
npx next dev
pause
