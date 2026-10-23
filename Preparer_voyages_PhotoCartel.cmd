@echo off
chcp 65001 > nul
cd /d "%~dp0"
title PhotoCartel - preparation des voyages
echo PhotoCartel - preparation des voyages avant la copie
echo Choisis le dossier a preparer dans la fenetre qui s ouvre.
echo.
node "%~dp0server.js" --preparer
echo.
pause
