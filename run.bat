@echo off
title SkillLab Platform Startup

echo ========================================
echo    SkillLab - Hacking Practice Platform
echo ========================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org
    pause
    exit /b 1
)

echo Node.js found! Installing dependencies...
echo.

echo [1/4] Installing root dependencies...
call npm install --silent

echo [2/4] Installing backend dependencies...
cd backend
call npm install --silent
cd ..

echo [3/4] Installing frontend dependencies...
cd frontend
call npm install --silent
cd ..

echo [4/4] Starting platform...
echo.
echo ========================================
echo   Platform URLs:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:3001
echo   Challenge: http://localhost:3001/challenge/index.html
echo ========================================
echo.
echo Starting services (this may take a moment)...

call npm start