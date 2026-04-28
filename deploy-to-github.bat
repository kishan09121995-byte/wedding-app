@echo off
cd C:\Users\Kishan\wedding-app

echo Setting git config...
git config user.email "batavia.kishan9@gmail.com"
git config user.name "Kishan Batavia"

echo Adding all files...
git add .

echo Committing...
git commit -m "Initial wedding app with all features"

echo Renaming branch to main...
git branch -M main

echo Adding remote origin...
git remote add origin https://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@github.com/kishan09121995-byte/wedding-app.git

echo Pushing to GitHub...
git push -u origin main

echo.
echo ✅ Code pushed to GitHub!
echo.
pause
