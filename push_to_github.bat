@echo off
echo ========================================================
echo   GeM AI Compliance Engine - Push to GitHub
echo ========================================================
echo.
echo Please create an empty repository on GitHub:
echo https://github.com/new
echo.
set /p REPO_URL="Paste your GitHub repository URL (e.g. https://github.com/Mahirsoni09/sih-gem-compliance.git): "
if "%REPO_URL%"=="" (
    echo [ERROR] No URL provided.
    pause
    exit /b
)
git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main
echo.
echo Pushing repository to %REPO_URL%...
git push -u origin main
echo.
if %ERRORLEVEL% equ 0 (
    echo [SUCCESS] Code successfully pushed to GitHub!
    echo Next step: Open https://dashboard.render.com to deploy in 1-click.
) else (
    echo [NOTICE] Push encountered an issue. Please verify your repository URL and permissions.
)
pause
