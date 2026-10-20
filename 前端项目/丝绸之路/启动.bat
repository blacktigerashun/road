@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ========================================
echo   Silk Road Project Starting...
echo ========================================
echo.
echo Home:    http://localhost:5000/
echo Login:   http://localhost:5000/login.html
echo Admin:   http://localhost:5000/admin (login required)
echo.
echo Close this window to stop the server.
echo.
start "" http://localhost:5000/
"C:\Users\周后顺\.workbuddy\binaries\python\envs\default\Scripts\python.exe" app.py
pause
