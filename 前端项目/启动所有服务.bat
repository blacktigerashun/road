@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
title 前端服务 - 丝绸之路 + 论坛AI

set "ROOT=%~dp0"
set "ROOT=%ROOT:~0,-1%"

echo ========================================
echo   丝绸之路(Flask:5000) + 论坛/AI(Node:3000)
echo ========================================
echo.

REM ---------- 选择可用的 Python（需已安装 Flask） ----------
set "PY="
if exist "C:\Users\%USERNAME%\.workbuddy\binaries\python\envs\default\Scripts\python.exe" (
  set "PY=C:\Users\%USERNAME%\.workbuddy\binaries\python\envs\default\Scripts\python.exe"
) else (
  for /f "delims=" %%i in ('where python 2^>nul') do (
    if not defined PY set "PY=%%i"
  )
)

netstat -ano | findstr ":5000" | findstr "LISTENING" >nul
if %errorlevel%==0 (
  echo [跳过] 端口 5000 已被占用
) else (
  if defined PY (
    echo [启动] 丝绸之路 Flask 端口5000
    start "丝绸之路-Flask-5000" cmd /c "cd /d "%ROOT%\丝绸之路" && "%PY%" app.py"
  ) else (
    echo [警告] 未找到 python，请先安装：pip install flask
  )
)

netstat -ano | findstr ":3000" | findstr "LISTENING" >nul
if %errorlevel%==0 (
  echo [跳过] 端口 3000 已被占用
) else (
  echo [启动] 论坛 + AI 聊天 Node 端口3000
  start "论坛AI-Node-3000" cmd /c "cd /d "%ROOT%\chatAI\chat-backend" && node app.js"
)

echo.
echo 启动完成
echo 关闭对应黑窗口即可停止单个服务
timeout /t 3 >nul
start "" "http://localhost:5000/"
endlocal
