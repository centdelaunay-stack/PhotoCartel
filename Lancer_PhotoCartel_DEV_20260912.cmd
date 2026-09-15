@echo off
setlocal EnableExtensions
chcp 65001 >nul
title PhotoCartel - Lancement DEV

REM ============================================================
REM  PhotoCartel - Lanceur DEV
REM  Aucun chemin en dur : le script travaille dans SON dossier.
REM  A placer a la racine du projet, a cote de package.json.
REM  Ne tue que les processus de PhotoCartel (ses deux ports).
REM  Les sondes d'attente visent 127.0.0.1 et non localhost :
REM  Vite ecoute en IPv4 (--host 0.0.0.0) alors que localhost
REM  resout d'abord ::1 sous Windows, ce qui faisait echouer l'attente.
REM ============================================================

set "APP_NAME=PhotoCartel"
set "PORT_SERVER=3002"
set "PORT_VITE=5173"
set "VITE_URL=http://localhost:5173"

set "PROJECT_DIR=%~dp0"
if "%PROJECT_DIR:~-1%"=="\" set "PROJECT_DIR=%PROJECT_DIR:~0,-1%"

cls
echo.
echo ============================================================
echo    Lancement %APP_NAME% DEV
echo ============================================================
echo    Dossier : %PROJECT_DIR%
echo    Serveur : port %PORT_SERVER%
echo    Vite    : port %PORT_VITE%
echo ============================================================
echo.

echo [1/7] Verification du contenu du dossier...
if not exist "%PROJECT_DIR%\package.json" goto ERREUR_PACKAGE
if not exist "%PROJECT_DIR%\server.js" goto ERREUR_SERVERJS
if not exist "%PROJECT_DIR%\vite.config.js" goto ERREUR_VITECONFIG
if not exist "%PROJECT_DIR%\index.html" goto ERREUR_INDEXHTML
echo       OK : package.json, server.js, vite.config.js, index.html presents.

echo [2/7] Verification de Node.js et npm...
where node >nul 2>&1
if errorlevel 1 goto ERREUR_NODE
where npm >nul 2>&1
if errorlevel 1 goto ERREUR_NPM
echo       OK.

echo [3/7] Arret des anciennes instances %APP_NAME% uniquement...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr /C:":%PORT_SERVER% " ^| findstr /C:"LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr /C:":%PORT_VITE% " ^| findstr /C:"LISTENING"') do taskkill /F /PID %%a >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq %APP_NAME% Server*" >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq %APP_NAME% Vite*" >nul 2>&1
timeout /t 2 /nobreak >nul
echo       OK : les autres applications Node ne sont pas touchees.

echo [4/7] Controle que les deux ports sont bien libres...
set "BUSY_PID="
for /f "tokens=5" %%a in ('netstat -ano ^| findstr /C:":%PORT_SERVER% " ^| findstr /C:"LISTENING"') do set "BUSY_PID=%%a"
if defined BUSY_PID goto ERREUR_PORT_SERVER
set "BUSY_PID="
for /f "tokens=5" %%a in ('netstat -ano ^| findstr /C:":%PORT_VITE% " ^| findstr /C:"LISTENING"') do set "BUSY_PID=%%a"
if defined BUSY_PID goto ERREUR_PORT_VITE
echo       OK : ports %PORT_SERVER% et %PORT_VITE% libres.

echo [5/7] Demarrage du serveur Express sur le port %PORT_SERVER%...
start "%APP_NAME% Server" /D "%PROJECT_DIR%" cmd /k node server.js
powershell -NoProfile -ExecutionPolicy Bypass -Command "$fin=(Get-Date).AddSeconds(60); while((Get-Date) -lt $fin){ try { $c=New-Object Net.Sockets.TcpClient; $c.Connect('127.0.0.1',%PORT_SERVER%); $c.Close(); exit 0 } catch { Start-Sleep -Milliseconds 500 } }; exit 1"
if errorlevel 1 goto ERREUR_SERVEUR
echo       OK : serveur pret.

echo [6/7] Demarrage de Vite sur le port %PORT_VITE% (port impose)...
start "%APP_NAME% Vite" /D "%PROJECT_DIR%" cmd /k npm run dev -- --host 0.0.0.0 --port %PORT_VITE% --strictPort
powershell -NoProfile -ExecutionPolicy Bypass -Command "$fin=(Get-Date).AddSeconds(90); while((Get-Date) -lt $fin){ try { $c=New-Object Net.Sockets.TcpClient; $c.Connect('127.0.0.1',%PORT_VITE%); $c.Close(); exit 0 } catch { Start-Sleep -Milliseconds 500 } }; exit 1"
if errorlevel 1 goto ERREUR_VITE
echo       OK : Vite pret.

echo [7/7] Ouverture de Google Chrome...
set "CHROME_PATH="
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" set "CHROME_PATH=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not defined CHROME_PATH if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" set "CHROME_PATH=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if not defined CHROME_PATH if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" set "CHROME_PATH=%LocalAppData%\Google\Chrome\Application\chrome.exe"
if not defined CHROME_PATH goto ERREUR_CHROME
start "" "%CHROME_PATH%" --new-window "%VITE_URL%"

set "SERVER_VERSION=non renseignee"
for /f "usebackq delims=" %%V in (`powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $r=Invoke-RestMethod -Uri 'http://127.0.0.1:%PORT_SERVER%/api/health' -TimeoutSec 3; if($r.version){$r.version}else{'non renseignee'} } catch { 'non renseignee' }"`) do set "SERVER_VERSION=%%V"

echo.
echo ============================================================
echo    %APP_NAME% DEV est operationnel.
echo    Adresse  : %VITE_URL%
echo    Version  : %SERVER_VERSION%
echo    Dossier  : %PROJECT_DIR%
echo ============================================================
echo.
timeout /t 4 /nobreak >nul
exit /b 0

:ERREUR_PACKAGE
echo.
echo ECHEC : package.json est introuvable dans ce dossier.
echo Ce script doit etre place a la racine du projet %APP_NAME%.
echo Dossier teste : %PROJECT_DIR%
echo.
pause
exit /b 1

:ERREUR_SERVERJS
echo.
echo ECHEC : server.js est introuvable dans ce dossier.
echo Ce script doit etre place a la racine du projet %APP_NAME%.
echo Dossier teste : %PROJECT_DIR%
echo.
pause
exit /b 1

:ERREUR_VITECONFIG
echo.
echo ECHEC : vite.config.js est introuvable dans ce dossier.
echo Ce script doit etre place a la racine du projet %APP_NAME%.
echo Dossier teste : %PROJECT_DIR%
echo.
pause
exit /b 1

:ERREUR_INDEXHTML
echo.
echo ECHEC : index.html est introuvable dans ce dossier.
echo Ce script doit etre place a la racine du projet %APP_NAME%.
echo Dossier teste : %PROJECT_DIR%
echo.
pause
exit /b 1

:ERREUR_NODE
echo.
echo ECHEC : Node.js est introuvable (commande node).
echo Rien n'a ete lance.
echo.
pause
exit /b 1

:ERREUR_NPM
echo.
echo ECHEC : npm est introuvable (commande npm).
echo Rien n'a ete lance.
echo.
pause
exit /b 1

:ERREUR_PORT_SERVER
echo.
echo ECHEC : le port %PORT_SERVER% est occupe par le processus PID %BUSY_PID%.
echo Ce port appartient a %APP_NAME%. Une autre application l'utilise.
echo Rien n'a ete lance, pour ne pas demarrer sur un mauvais port.
echo Pour identifier le coupable : tasklist /FI "PID eq %BUSY_PID%"
echo.
pause
exit /b 1

:ERREUR_PORT_VITE
echo.
echo ECHEC : le port %PORT_VITE% est occupe par le processus PID %BUSY_PID%.
echo Ce port appartient a %APP_NAME%. Une autre application l'utilise.
echo Rien n'a ete lance, pour ne pas demarrer sur un mauvais port.
echo Pour identifier le coupable : tasklist /FI "PID eq %BUSY_PID%"
echo.
pause
exit /b 1

:ERREUR_SERVEUR
echo.
echo ECHEC : le serveur Express n'a pas repondu sur le port %PORT_SERVER%.
echo Regarde la fenetre "%APP_NAME% Server" : le message d'erreur y est affiche.
echo Le navigateur n'a pas ete ouvert.
echo.
pause
exit /b 1

:ERREUR_VITE
echo.
echo ECHEC : Vite n'a pas repondu sur le port %PORT_VITE% (sonde 127.0.0.1).
echo Regarde la fenetre "%APP_NAME% Vite" : le message d'erreur y est affiche.
echo Si le message parle du port %PORT_VITE% deja utilise, c'est volontaire :
echo le port est impose pour eviter que l'application glisse sur un autre port.
echo Le navigateur n'a pas ete ouvert.
echo.
pause
exit /b 1

:ERREUR_CHROME
echo.
echo ECHEC : Google Chrome est introuvable.
echo Le serveur et Vite tournent. Ouvre manuellement : %VITE_URL%
echo.
pause
exit /b 1
