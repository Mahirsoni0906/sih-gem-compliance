@echo off
title GeM Compliance - FastAPI Backend (Port 8000)
cd /d "%~dp0backend"
echo Starting FastAPI Backend on http://0.0.0.0:8000 ...
if exist "venv\Scripts\python.exe" (
    venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
) else (
    python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
)
pause
