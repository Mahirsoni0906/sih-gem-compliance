@echo off
title Launch GeM Compliance Platform
echo ===================================================
echo   Starting GeM Compliance System
echo ===================================================

start "Backend Server (FastAPI :8000)" cmd /k "%~dp0start_backend.bat"
start "Frontend Server (Vite :5173)" cmd /k "%~dp0start_frontend.bat"

echo.
echo Both servers have been launched in separate windows!
echo - Backend API:  http://localhost:8000
echo - Frontend App: http://localhost:5173
echo.
echo Opening browser in 3 seconds...
timeout /t 3 /nobreak >nul
start http://localhost:5173
