@echo off
echo 🎓 Starting Student Management System...
echo.

echo 📦 Installing dependencies...
cd backend
call npm install
cd ../frontend
call npm install

echo.
echo 🚀 Starting servers...
echo Backend will start on http://localhost:3001
echo Frontend will start on http://localhost:3003
echo.

start "Backend Server" cmd /k "cd backend && npm start"
timeout /t 3 /nobreak > nul
start "Frontend Server" cmd /k "cd frontend && npm start"

echo ✅ Both servers are starting...
echo 🌐 Open http://localhost:3003 in your browser
echo.
echo Teacher Login: teacher@atfp.tn / teacher123
echo.
pause