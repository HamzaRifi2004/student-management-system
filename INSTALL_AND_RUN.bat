@echo off
title Student Management System - Installer
color 0B

echo.
echo  ╔══════════════════════════════════════════════════════════════╗
echo  ║                 🎓 STUDENT MANAGEMENT SYSTEM                 ║
echo  ║                    USB Portable Version                      ║
echo  ╚══════════════════════════════════════════════════════════════╝
echo.

echo 📋 System Requirements Check:
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo.
    echo 📥 Please install Node.js first:
    echo    1. Go to: https://nodejs.org
    echo    2. Download LTS version
    echo    3. Install with default settings
    echo    4. Restart this script
    echo.
    pause
    exit /b 1
) else (
    echo ✅ Node.js is installed
)

REM Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not available!
    pause
    exit /b 1
) else (
    echo ✅ npm is available
)

echo.
echo 🚀 Starting installation and setup...
echo.

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install --silent
if %errorlevel% neq 0 (
    echo ❌ Backend installation failed!
    pause
    exit /b 1
)
echo ✅ Backend ready

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd ../frontend
call npm install --silent
if %errorlevel% neq 0 (
    echo ❌ Frontend installation failed!
    pause
    exit /b 1
)
echo ✅ Frontend ready

cd ..

echo.
echo ✅ Installation completed successfully!
echo.
echo 🚀 Starting the system...
echo.

REM Create test student account
echo 📝 Setting up demo data...
cd backend
node create-test-student.js >nul 2>&1
cd ..

echo 🌐 Starting servers...
echo.
echo 📊 Backend will start on: http://localhost:3001
echo 🖥️  Frontend will start on: http://localhost:3003
echo.

REM Start backend
start "Backend - Student Management API" cmd /k "cd /d %~dp0backend && npm start"

REM Wait for backend to start
timeout /t 5 /nobreak > nul

REM Start frontend
start "Frontend - Student Management UI" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo ✅ System is starting up...
echo.
echo 🎯 Demo Accounts:
echo    👨‍🏫 Teacher: teacher@atfp.tn (password: teacher123)
echo    🎓 Student: test@student.com (password: test123)
echo.
echo 🌐 Open your browser and go to: http://localhost:3003
echo.
echo ⏹️  To stop: Close both terminal windows
echo.
echo 📖 For more help, read: USB_SETUP_GUIDE.md
echo.
pause