@echo off
setlocal enabledelayedexpansion

REM Netlify Configuration
set NETLIFY_TOKEN=nfp_Sj4qPmWLRgznGM11WjAtZ6hFExiQbhPWd58d
set NETLIFY_SITE_ID=04df0d44-0d88-4f7e-93f5-5c9d8b2a1e0f

color 0A

echo.
echo ===============================================
echo   WEDDING APP - AUTO DEPLOYMENT TO NETLIFY
echo ===============================================
echo.

REM Step 1: Install dependencies
echo [1/4] Installing dependencies...
call npm install --legacy-peer-deps >nul 2>&1
if errorlevel 1 (
    color 0C
    echo ERROR: npm install failed
    pause
    exit /b 1
)
echo OK - Dependencies installed

REM Step 2: Build the app
echo.
echo [2/4] Building the app...
call npm run build >nul 2>&1
if errorlevel 1 (
    color 0C
    echo ERROR: Build failed
    pause
    exit /b 1
)
echo OK - Build successful

REM Step 3: Install Netlify CLI
echo.
echo [3/4] Installing Netlify CLI...
call npm install -g netlify-cli >nul 2>&1

REM Step 4: Deploy to Netlify
echo.
echo [4/4] Deploying to Netlify...
echo.

REM Deploy using Netlify CLI with token
call netlify deploy --prod --dir=dist --auth=!NETLIFY_TOKEN! --site=!NETLIFY_SITE_ID!

if errorlevel 1 (
    color 0C
    echo.
    echo ERROR: Deployment failed
    echo.
    echo Trying alternative deployment method...
    echo.
    pause
    exit /b 1
)

color 0A
echo.
echo ===============================================
echo   SUCCESS - DEPLOYMENT COMPLETE!
echo ===============================================
echo.
echo Your app is live at:
echo https://guileless-chebakia-c52b67.netlify.app/
echo.
echo Changes deployed successfully!
echo.
timeout /t 3

endlocal
