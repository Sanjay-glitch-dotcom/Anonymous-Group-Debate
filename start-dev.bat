@echo off
echo ========================================
echo    Anonymous Group Debate Development Server
echo ========================================
echo.
echo Starting MongoDB (make sure it's running)...
echo Backend will run on: http://localhost:3001
echo Frontend will run on: http://localhost:4201
echo.
echo Press Ctrl+C to stop all servers
echo ========================================
echo.

REM Start backend in a new window
start "Anonymous Group Debate Backend" cmd /k "cd /d %~dp0 && npm run dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak > nul

REM Start frontend in a new window
start "Anonymous Group Debate Frontend" cmd /k "cd /d %~dp0app_public && npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:4201
echo.
echo Press any key to exit this window (servers will continue running)
pause > nul
