@echo off
setlocal enabledelayedexpansion

color 0A

echo.
echo ===============================================
echo   WEDDING APP - NETLIFY AUTO DEPLOYMENT
echo ===============================================
echo.

echo [1/4] Installing dependencies...
call npm install --legacy-peer-deps
if errorlevel 1 (
    color 0C
    echo ERROR: npm install failed
    pause
    exit /b 1
)

echo.
echo [2/4] Building the app...
call npm run build
if errorlevel 1 (
    color 0C
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo [3/4] Installing Netlify CLI...
call npm install -g netlify-cli
if errorlevel 1 (
    echo Note: Netlify CLI installation may require admin privileges
    echo Continuing with deployment...
)

echo.
echo [4/4] Deploying to Netlify...
echo.
call netlify deploy --prod --dir=dist
if errorlevel 1 (
    color 0C
    echo ERROR: Deployment failed
    echo.
    echo If this is your first deployment, you may need to:
    echo 1. Authenticate: netlify login
    echo 2. Then run this script again
    pause
    exit /b 1
)

color 0A
echo.
echo ===============================================
echo   ✓ DEPLOYMENT SUCCESSFUL!
echo ===============================================
echo.
echo Your app is live at:
echo https://guileless-chebakia-c52b67.netlify.app/
echo.
timeout /t 3

endlocal
