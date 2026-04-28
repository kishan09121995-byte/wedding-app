@echo off
setlocal enabledelayedexpansion

cd C:\Users\Kishan\wedding-app

echo.
echo ======================================================
echo 🎊 WEDDING APP - FRESH DEPLOYMENT
echo ======================================================
echo.

REM Clear git credentials
echo Clearing git credentials...
git credential reject
echo host=github.com | git credential reject

REM Remove old remote completely
echo Removing old remote...
git remote remove origin >nul 2>&1

REM Configure git fresh
echo Configuring git...
git config user.email "batavia.kishan9@gmail.com"
git config user.name "Kishan Batavia"

REM Add files
echo Adding files...
git add .

REM Commit
echo Committing...
git commit -m "Wedding app deployment" >nul 2>&1

REM Ensure main branch
git branch -M main

REM Add remote with token
set TOKEN=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
set REPO=https://%TOKEN%@github.com/kishan09121995-byte/wedding-app.git

git remote add origin %REPO%

REM Push
echo.
echo Pushing to GitHub...
git push -u origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Push failed
    pause
    exit /b 1
)

echo.
echo ✅ Code on GitHub!
echo ⏳ Waiting for sync...
timeout /t 5 /nobreak

echo.
echo 🚀 Creating Render service...
echo.

REM Create Render service
curl -X POST https://api.render.com/v1/services ^
  -H "Authorization: Bearer rnd_tFnHheGEpaJDyeAkBZLKoXkObFFb" ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"wedding-app\",\"type\":\"static_site\",\"ownerId\":\"tea-d7o9vjcvikkc73borneg\",\"repo\":\"https://github.com/kishan09121995-byte/wedding-app\",\"branch\":\"main\",\"buildCommand\":\"npm install --legacy-peer-deps && npm run build\",\"publishPath\":\"dist\",\"envVars\":[{\"key\":\"VITE_SUPABASE_URL\",\"value\":\"https://mexeegqwlewmrsejdvlw.supabase.co\"},{\"key\":\"VITE_SUPABASE_ANON_KEY\",\"value\":\"sb_publishable_DSfOh1b64Rv6fX_J703Xzw_INxl1eMx\"}]}"

echo.
echo ======================================================
echo ✨ DEPLOYMENT STARTED!
echo ======================================================
echo.
echo 🔗 View deployment: https://dashboard.render.com
echo.
echo ⏱️  Takes 2-5 minutes to build and go live
echo.
echo 💡 When live, share RSVP links with guests!
echo.
pause
