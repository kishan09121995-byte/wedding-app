@echo off
cd C:\Users\Kishan\wedding-app

echo.
echo ======================================================
echo 🎊 BUILDING WEDDING APP
echo ======================================================
echo.

echo Installing dependencies...
call npm install --legacy-peer-deps

echo.
echo Building app...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Build failed
    pause
    exit /b 1
)

echo.
echo ✅ Build successful!
echo.
echo 🚀 App is ready to deploy
echo.
echo Files are in: dist/
echo.
echo Next: Go to https://app.netlify.com and drag-drop the dist/ folder
echo.
pause
