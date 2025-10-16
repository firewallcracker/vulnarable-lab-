@echo off
echo Starting SkillLab Platform...

echo Checking Docker...
docker --version
if %errorlevel% neq 0 (
    echo Docker is not installed or not in PATH
    pause
    exit /b 1
)

echo Testing Docker connection...
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker Desktop is not running. Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo Building challenge images...
cd challenges\sql-injection
docker build -t skilllab-sqli .
if %errorlevel% neq 0 (
    echo Failed to build challenge image
    pause
    exit /b 1
)
cd ..\..

echo Starting all services...
docker-compose up --build

pause