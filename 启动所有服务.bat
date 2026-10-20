@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
title 中式古建筑平台 - 一键启动

set "ROOT=%~dp0"
set "ROOT=%ROOT:~0,-1%"

echo ============================================
echo    中式古建筑数字化平台  一键启动
echo    根目录: %ROOT%
echo ============================================
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

REM ================= 1. 后端 Spring Boot :8087 =================
netstat -ano | findstr ":8087" | findstr "LISTENING" >nul
if %errorlevel%==0 (
  echo [跳过] 后端 8087 已在运行
) else (
  set "JAR=%ROOT%\后端项目\target\building-platform-0.0.1-SNAPSHOT.jar"
  if exist "!JAR!" (
    echo [启动] 后端 Spring Boot -^> http://localhost:8087
    start "后端-8087" cmd /c "cd /d "%ROOT%\后端项目" && java -jar "!JAR!""
  ) else (
    echo [警告] 未找到后端 jar，请先构建：
    echo         cd "%ROOT%\后端项目" ^&^& mvn clean package -DskipTests
  )
)

REM ================= 2. Flask 丝绸之路 :5000 =================
netstat -ano | findstr ":5000" | findstr "LISTENING" >nul
if %errorlevel%==0 (
  echo [跳过] Flask 5000 已在运行
) else (
  if defined PY (
    echo [启动] Flask 丝绸之路 -^> http://localhost:5000/
    start "丝绸之路-5000" cmd /c "cd /d "%ROOT%\前端项目\丝绸之路" && "%PY%" app.py"
  ) else (
    echo [警告] 未找到 python，请先安装 Python 及 Flask：pip install flask
  )
)

REM ================= 3. Node 论坛 + AI :3000 =================
netstat -ano | findstr ":3000" | findstr "LISTENING" >nul
if %errorlevel%==0 (
  echo [跳过] Node 3000 已在运行
) else (
  echo [启动] 论坛 + AI 问答 -^> http://localhost:3000/
  start "论坛AI-3000" cmd /c "cd /d "%ROOT%\前端项目\chatAI\chat-backend" && node app.js"
)

echo.
echo 启动完成，3 秒后打开首页...
echo 关闭对应的命令行窗口即可停止单个服务。
timeout /t 3 >nul
start "" "http://localhost:3000/"
endlocal
