@echo off
REM ===========================================
REM PhotoCartel - Lanceur de l'environnement DEV
REM Ferme les anciens processus puis relance :
REM - le serveur Node
REM - Vite
REM - le navigateur
REM ===========================================
cls
title PhotoCartel - Redemarrage DEV

echo.
echo ==========================================
echo   Redemarrage propre de PhotoCartel DEV
echo ==========================================
echo.

echo [1/4] Arret des anciens processus Node...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM cmd.exe /FI "WINDOWTITLE eq PhotoCartel Server*" >nul 2>&1
taskkill /F /IM cmd.exe /FI "WINDOWTITLE eq PhotoCartel Vite*" >nul 2>&1

timeout /t 1 /nobreak >nul

echo [2/4] Demarrage du serveur PhotoCartel...
start "PhotoCartel Server" cmd /k "cd /d %~dp0 && node server.js"

timeout /t 2 /nobreak >nul

echo [3/4] Demarrage de Vite...
start "PhotoCartel Vite" cmd /k "cd /d %~dp0 && npm run dev -- --host 0.0.0.0"

timeout /t 2 /nobreak >nul

echo [4/4] Ouverture de PhotoCartel...
timeout /t 3 /nobreak >nul
start "" "chrome.exe" "http://localhost:5173"

echo.
echo PhotoCartel DEV est relance.
echo Cette fenetre va se fermer.
timeout /t 2 /nobreak >nul
exit