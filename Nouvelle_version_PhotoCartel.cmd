@echo off
chcp 65001 > nul
cd /d "%~dp0"
node "%~dp0nouvelle_version_photocartel.mjs"
echo.
pause
