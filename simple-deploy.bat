@echo off
setlocal enabledelayedexpansion

cd C:\Users\Kishan\wedding-app

echo.
echo ======================================================
echo 🎊 WEDDING APP - DEPLOYING TO GITHUB & RENDER
echo ======================================================
echo.

REM Configure git
echo Configuring git...
git config user.email "batavia.kishan9@gmail.com"
git config user.name "Kishan Batavia"

REM Add all files
echo Adding files...
git add .

REM Commit
echo Committing...
git commit -m "Wedding app deployment"

REM Ensure main branch
git branch -M main

REM Remove old remote
git remote remove origin >nul 2>&1

REM Add remote with token in environment
set GITHUB_TOKEN=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
git remote add origin https://%GITHUB_TOKEN%@github.com/kishan09121995-byte/wedding-app.git

REM Push
echo.
echo Pushing to GitHub...
git push -u origin main -f

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Failed to push to GitHub
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Code pushed to GitHub!
echo.
echo ⏳ Waiting for GitHub to sync...
timeout /t 3 /nobreak

echo.
echo 🚀 Now creating Render service...
echo.

REM Create Render service using curl
curl -X POST https://api.render.com/v1/services ^
  -H "Authorization: Bearer rnd_tFnHheGEpaJDyeAkBZLKoXkObFFb" ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"wedding-app\",\"type\":\"static_site\",\"ownerId\":\"tea-d7o9vjcvikkc73borneg\",\"repo\":\"https://github.com/kishan09121995-byte/wedding-app\",\"branch\":\"main\",\"buildCommand\":\"npm install --legacy-peer-deps && npm run build\",\"publishPath\":\"dist\",\"envVars\":[{\"key\":\"VITE_SUPABASE_URL\",\"value\":\"https://mexeegqwlewmrsejdvlw.supabase.co\"},{\"key\":\"VITE_SUPABASE_ANON_KEY\",\"value\":\"sb_publishable_DSfOh1b64Rv6fX_J703Xzw_INxl1eMx\"}]}"

echo.
echo ======================================================
echo ✨ DEPLOYMENT INITIATED!
echo ======================================================
echo.
echo 📋 Check your deployment:
echo    https://dashboard.render.com
echo.
echo ⏱️  Build takes 2-5 minutes...
echo.
echo 💡 Share RSVP links with guests once live!
echo.
pause
