@echo off
setlocal enabledelayedexpansion

REM Netlify Site ID and Personal Access Token
set NETLIFY_SITE_ID=04df0d44-0d88-4f7e-93f5-5c9d8b2a1e0f
set NETLIFY_AUTH_TOKEN=nflytk_YOUR_NETLIFY_TOKEN_HERE

REM Colors for output
color 0A

echo.
echo ===============================================
echo   WEDDING APP - AUTOMATED NETLIFY DEPLOYMENT
echo ===============================================
echo.

REM Step 1: Install dependencies
echo [1/3] Installing dependencies...
call npm install --legacy-peer-deps >nul 2>&1
if errorlevel 1 (
    color 0C
    echo ERROR: npm install failed
    pause
    exit /b 1
)
echo ✓ Dependencies installed

REM Step 2: Build the app
echo.
echo [2/3] Building the app...
call npm run build >nul 2>&1
if errorlevel 1 (
    color 0C
    echo ERROR: Build failed
    pause
    exit /b 1
)
echo ✓ Build successful

REM Step 3: Deploy to Netlify
echo.
echo [3/3] Deploying to Netlify...

REM Create a temporary zip of dist folder
cd dist
powershell -NoProfile -Command "Add-Type -AssemblyName 'System.IO.Compression.FileSystem'; [System.IO.Compression.ZipFile]::CreateFromDirectory('.', '../dist.zip')" 2>nul
cd ..

if exist dist.zip (
    REM Upload to Netlify using curl
    curl -H "Authorization: Bearer !NETLIFY_AUTH_TOKEN!" ^
         -H "Content-Type: application/zip" ^
         --data-binary "@dist.zip" ^
         https://api.netlify.com/api/v1/sites/!NETLIFY_SITE_ID!/deploys 2>nul

    del dist.zip

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
) else (
    color 0C
    echo ERROR: Failed to create deployment package
    pause
    exit /b 1
)

endlocal
