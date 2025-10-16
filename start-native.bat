@echo off
echo Starting SkillLab Platform (Native Mode)...

echo Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo Failed to install root dependencies
    pause
    exit /b 1
)

npm run install-all
if %errorlevel% neq 0 (
    echo Failed to install project dependencies
    pause
    exit /b 1
)

echo Starting platform...
echo Frontend will be available at: http://localhost:3000
echo Backend API will be available at: http://localhost:3001
echo Challenge will be available at: http://localhost:3001/challenge/index.php
echo.
npm start

pause