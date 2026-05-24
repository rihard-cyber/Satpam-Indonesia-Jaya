@echo off
title SATPAM INDONESIA JAYA - Production
echo.
echo ========================================
echo    SATPAM INDONESIA JAYA
echo    Production Mode
echo ========================================
echo.
echo [1/3] Installing dependencies...
cd /d "%~dp0frontend"
call npm install --silent
echo.
echo [2/3] Building...
call npx next build
echo.
echo [3/3] Starting production server...
echo.
echo   Local:    http://localhost:3000
echo.
echo ========================================
echo.
npx next start
pause
