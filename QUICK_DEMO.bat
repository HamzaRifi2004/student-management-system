@echo off
title Student Management System - Quick Demo
color 0A

echo.
echo  ╔══════════════════════════════════════════════════════════════╗
echo  ║                 🎓 STUDENT MANAGEMENT SYSTEM                 ║
echo  ║                        Quick Demo                            ║
echo  ╚══════════════════════════════════════════════════════════════╝
echo.

echo 📋 Demo Information:
echo ├─ Frontend: http://localhost:3003
echo ├─ Backend:  http://localhost:3001
echo ├─ Teacher:  teacher@atfp.tn / teacher123
echo └─ Student:  Register new account or use existing data
echo.

echo 🚀 Starting servers...
echo.

REM Start backend
echo ⚡ Starting backend server...
start "Backend - Student Management API" cmd /k "cd /d %~dp0backend && npm start"

REM Wait a moment
timeout /t 3 /nobreak > nul

REM Start frontend
echo ⚡ Starting frontend server...
start "Frontend - Student Management UI" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo ✅ Both servers are starting up...
echo 🌐 Your browser should open automatically
echo 📱 If not, go to: http://localhost:3003
echo.
echo 🎯 Demo Accounts:
echo    Teacher: teacher@atfp.tn (password: teacher123)
echo    Student: Create new account or use sample data
echo.
echo ⏹️  To stop: Close both terminal windows
echo.
pause