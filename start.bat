@echo off
echo Installing dependencies...

echo Installing root dependencies...
call npm install

echo Installing backend dependencies...
cd backend
call npm install
cd ..

echo Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo Starting SkillLab Platform...
echo.
echo Frontend: http://localhost:3000
echo Backend: http://localhost:3001
echo Challenge: http://localhost:3001/challenge/index.html
echo.
echo Starting services...

start "Backend" cmd /k "cd backend && npm start"
timeout /t 3 /nobreak > nul
start "Frontend" cmd /k "cd frontend && npm start"

echo Both services are starting...
echo Frontend will open automatically in your browser
pause