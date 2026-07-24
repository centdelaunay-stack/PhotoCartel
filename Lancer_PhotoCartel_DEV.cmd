@echo off
setlocal EnableExtensions
chcp 65001 >nul

REM ===========================================
REM PhotoCartel - Lanceur de l'environnement DEV
REM v44.6
REM ===========================================

set "EXPECTED_SERVER_VERSION=v44.4"
set "SERVER_URL=http://127.0.0.1:3001/api/health"
set "VITE_URL=http://127.0.0.1:5173"

cls
title PhotoCartel - Redemarrage DEV v44.6

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
echo Verification du serveur et de sa version...

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
"$deadline=(Get-Date).AddSeconds(60); do { try { $r=Invoke-RestMethod -Uri '%SERVER_URL%' -TimeoutSec 2; if($r.version -eq '%EXPECTED_SERVER_VERSION%'){ exit 0 }; if($r.version){ Write-Host ('ERREUR : le serveur annonce ' + $r.version + ' au lieu de %EXPECTED_SERVER_VERSION%'); exit 2 } } catch {}; Start-Sleep -Milliseconds 500 } while((Get-Date) -lt $deadline); exit 1"

if errorlevel 2 goto ERREUR_VERSION
if errorlevel 1 goto ERREUR_SERVEUR

echo Serveur pret. Version validee : %EXPECTED_SERVER_VERSION%

echo.
echo [5/6] Demarrage de Vite...
start "PhotoCartel Vite" cmd /k "cd /d ""%~dp0"" && npm run dev -- --host 0.0.0.0"

echo.
echo Attente du demarrage de Vite...

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
"$deadline=(Get-Date).AddSeconds(60); do { try { $r=Invoke-WebRequest -UseBasicParsing -Uri '%VITE_URL%' -TimeoutSec 2; if($r.StatusCode -ge 200 -and $r.StatusCode -lt 500){ exit 0 } } catch {}; Start-Sleep -Milliseconds 500 } while((Get-Date) -lt $deadline); exit 1"

if errorlevel 1 goto ERREUR_VITE

echo Vite est pret.

echo.
echo [6/6] Ouverture de PhotoCartel dans Google Chrome...

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

if not defined CHROME_PATH (
    echo.
    echo ==========================================
    echo   ECHEC : GOOGLE CHROME EST INTROUVABLE
    echo   PhotoCartel ne sera pas ouvert dans Firefox.
    echo ==========================================
    echo.
    pause
    exit /b 1
)

start "" "%CHROME_PATH%" "%VITE_URL%"

echo.
echo ==========================================
echo   PhotoCartel DEV est pret.
echo   Serveur : %EXPECTED_SERVER_VERSION%
echo   Adresse : %VITE_URL%
echo   Navigateur : Google Chrome
echo ==========================================
echo.

timeout /t 3 /nobreak >nul
exit /b 0

:ERREUR_VERSION
echo.
echo ==========================================
echo   ECHEC : VERSION SERVEUR INCORRECTE
echo   Version attendue : %EXPECTED_SERVER_VERSION%
echo   Le navigateur ne sera pas ouvert.
echo ==========================================
echo.
pause
exit /b 1

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
