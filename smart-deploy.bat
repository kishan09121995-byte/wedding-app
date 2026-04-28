@echo off
setlocal enabledelayedexpansion

REM Netlify Personal Access Token
set NETLIFY_TOKEN=nfp_Sj4qPmWLRgznGM11WjAtZ6hFExiQbhPWd58d

color 0A

echo.
echo ===============================================
echo   WEDDING APP - SMART NETLIFY DEPLOYMENT
echo ===============================================
echo.

REM Step 1: Install dependencies
echo [1/5] Installing dependencies...
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
echo [2/5] Building the app...
call npm run build >nul 2>&1
if errorlevel 1 (
    color 0C
    echo ERROR: Build failed
    pause
    exit /b 1
)
echo OK - Build successful

REM Step 3: Get list of sites
echo.
echo [3/5] Fetching your Netlify sites...
for /f "delims=" %%A in ('curl -s -H "Authorization: Bearer !NETLIFY_TOKEN!" https://api.netlify.com/api/v1/sites ^| findstr /R "\"id\":" ^| findstr "guileless" ^| head -1') do set SITE_ID=%%A

if "!SITE_ID!"=="" (
    echo [3/5] Using site name...
    set SITE_NAME=guileless-chebakia-c52b67
) else (
    echo [3/5] Found your site
)

REM Step 4: Install Netlify CLI
echo.
echo [4/5] Setting up Netlify CLI...
call npm install -g netlify-cli >nul 2>&1

REM Step 5: Deploy
echo.
echo [5/5] Deploying to Netlify...
echo.

if defined SITE_ID (
    call netlify deploy --prod --dir=dist --auth=!NETLIFY_TOKEN! --site=!SITE_ID!
) else (
    call netlify deploy --prod --dir=dist --auth=!NETLIFY_TOKEN!
)

if errorlevel 1 (
    color 0C
    echo.
    echo ERROR: Deployment failed
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
timeout /t 3

endlocal
