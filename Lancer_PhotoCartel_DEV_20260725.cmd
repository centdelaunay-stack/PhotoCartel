@echo off
setlocal EnableExtensions
chcp 65001 >nul

REM ===========================================
REM PhotoCartel - Lanceur universel DEV
REM Aucun numero de version n'est code en dur.
REM ===========================================

set "SERVER_URL=http://127.0.0.1:3002/api/health"
set "VITE_URL=http://127.0.0.1:5173"

cls
title PhotoCartel - Redemarrage DEV

echo.
echo ==========================================
echo   Redemarrage fiable de PhotoCartel DEV
echo ==========================================
echo.

echo [1/6] Arret des anciens processus Node...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM cmd.exe /FI "WINDOWTITLE eq PhotoCartel Server*" >nul 2>&1
taskkill /F /IM cmd.exe /FI "WINDOWTITLE eq PhotoCartel Vite*" >nul 2>&1

echo [2/6] Attente de la liberation des processus...
timeout /t 2 /nobreak >nul

echo [3/6] Nettoyage du cache Vite...
if exist "%~dp0.vite" rd /s /q "%~dp0.vite"
if exist "%~dp0node_modules\.vite" rd /s /q "%~dp0node_modules\.vite"

echo [4/6] Demarrage du serveur PhotoCartel...
start "PhotoCartel Server" cmd /k "cd /d ""%~dp0"" && node server.js"

echo.
echo Attente du serveur PhotoCartel...

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
"$deadline=(Get-Date).AddSeconds(60); while((Get-Date) -lt $deadline){ try { $r=Invoke-RestMethod -Uri '%SERVER_URL%' -TimeoutSec 2; if($null -ne $r){ exit 0 } } catch {}; Start-Sleep -Milliseconds 500 }; exit 1"

if errorlevel 1 goto ERREUR_SERVEUR

set "SERVER_VERSION=Version non renseignee"
for /f "usebackq delims=" %%V in (`powershell -NoProfile -ExecutionPolicy Bypass -Command "$r=Invoke-RestMethod -Uri '%SERVER_URL%' -TimeoutSec 5; if($r.version){$r.version}else{'Version non renseignee'}"`) do set "SERVER_VERSION=%%V"

echo Serveur pret.
echo Version detectee : %SERVER_VERSION%

echo.
echo [5/6] Demarrage de Vite...
start "PhotoCartel Vite" cmd /k "cd /d ""%~dp0"" && npm run dev -- --host 0.0.0.0"

echo.
echo Attente du demarrage de Vite...

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
"$deadline=(Get-Date).AddSeconds(60); while((Get-Date) -lt $deadline){ try { $r=Invoke-WebRequest -UseBasicParsing -Uri '%VITE_URL%' -TimeoutSec 2; if($r.StatusCode -ge 200 -and $r.StatusCode -lt 500){ exit 0 } } catch {}; Start-Sleep -Milliseconds 500 }; exit 1"

if errorlevel 1 goto ERREUR_VITE

echo Vite est pret.

echo.
echo [6/6] Recherche de Google Chrome...

set "CHROME_PATH="

if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    set "CHROME_PATH=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
)

if not defined CHROME_PATH if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
    set "CHROME_PATH=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
)

if not defined CHROME_PATH if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" (
    set "CHROME_PATH=%LocalAppData%\Google\Chrome\Application\chrome.exe"
)

if not defined CHROME_PATH goto ERREUR_CHROME

echo Ouverture de PhotoCartel dans Google Chrome...
start "" "%CHROME_PATH%" --new-window "%VITE_URL%"

echo.
echo ==========================================
echo   PhotoCartel DEV est pret.
echo   Version detectee : %SERVER_VERSION%
echo   Adresse : %VITE_URL%
echo   Navigateur : Google Chrome
echo ==========================================
echo.

timeout /t 3 /nobreak >nul
exit /b 0

:ERREUR_SERVEUR
echo.
echo ==========================================
echo   ECHEC : LE SERVEUR NE REPOND PAS
echo   Adresse testee : %SERVER_URL%
echo   Le navigateur ne sera pas ouvert.
echo ==========================================
echo.
pause
exit /b 1

:ERREUR_VITE
echo.
echo ==========================================
echo   ECHEC : VITE NE REPOND PAS
echo   Adresse testee : %VITE_URL%
echo   Le navigateur ne sera pas ouvert.
echo ==========================================
echo.
pause
exit /b 1

:ERREUR_CHROME
echo.
echo ==========================================
echo   ECHEC : GOOGLE CHROME EST INTROUVABLE
echo   PhotoCartel ne sera pas ouvert.
echo ==========================================
echo.
pause
exit /b 1
