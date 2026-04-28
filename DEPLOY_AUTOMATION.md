# 🤖 Automated Deployment to Render

Your wedding app can now be deployed to Render with **one command**, no web UI needed!

---

## 🚀 Quick Start

### Option 1: Deploy Directly (Recommended)

```bash
npm run deploy
```

This will:
1. ✅ Auto-detect your Render service
2. ✅ Trigger a deployment
3. ✅ Poll until live
4. ✅ Show you the live URL

**That's it!** No other steps needed.

---

### Option 2: Build + Deploy

```bash
npm run deploy:watch
```

This builds your app first, then deploys:
1. ✅ Build with TypeScript + Vite
2. ✅ Trigger deployment
3. ✅ Poll until live

---

## ⚙️ Setup (First Time Only)

### Step 1: Store API Key Securely

Create a `.env` file in your project root (do NOT commit this):

```env
RENDER_API_KEY=rnd_tFnHheGEpaJDyeAkBZLKoXkObFFb
RENDER_SERVICE_ID=srv_xxxxx
```

**Where to find RENDER_SERVICE_ID:**
1. Go to https://render.com/dashboard
2. Click your service (wedding-app)
3. Copy the Service ID from the URL or dashboard

---

### Step 2: Make Sure Node is Available

Since PowerShell is blocked on your machine, use **Command Prompt (cmd.exe)** instead:

```cmd
node deploy.js
```

Or:
```cmd
npm run deploy
```

---

## 🔐 Security Notes

### Protect Your API Key

**DO:**
- ✅ Store API key in `.env` file
- ✅ Add `.env` to `.gitignore` (already included)
- ✅ Never commit `.env` to GitHub
- ✅ Keep API key private

**DON'T:**
- ❌ Paste API key in code
- ❌ Commit `.env` to GitHub
- ❌ Share API key publicly
- ❌ Store in `render.yaml`

### Regenerate After Sharing

Since you shared the API key in chat:
1. Go to Render Dashboard → Settings → API Keys
2. Click trash icon to delete the old key
3. Generate a new key
4. Update your `.env` file

---

## 📋 What the Deploy Script Does

```
1. Authenticate with Render API using your API key
2. Fetch all your services
3. Auto-detect "wedding-app" service
4. Trigger a new deployment
5. Poll deployment status every 5 seconds
6. Show status updates
7. Confirm when live
8. Return live URL
```

---

## 🎯 Usage Examples

### Deploy with default API key from .env

```bash
npm run deploy
```

### Deploy with different API key (override .env)

```bash
set RENDER_API_KEY=rnd_newkeyhere && npm run deploy
```

### Build first, then deploy

```bash
npm run deploy:watch
```

### Check deployment manually on Render

Go to: https://render.com/dashboard → Your Service → Deployments

---

## ✅ What You'll See

```
🎊 Wedding App Render Deployment Automation

📋 Fetching your Render services...
✅ Found 1 service(s)

🎯 Target Service: wedding-app
   ID: srv_xxxxx
   Environment: static

🚀 Triggering deployment for service: srv_xxxxx
✅ Deployment triggered (ID: d-xxxxx)

⏳ Waiting for deployment to complete...
   Status: queued
   Status: building
   Status: building
   Status: deploying
   Status: live

✨ Deployment successful!
🔗 Your app is live!
   URL: https://wedding-app-xxxxx.onrender.com
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---|---|
| `API Error: 401` | Check API key is correct in `.env` |
| `No service found` | Set `RENDER_SERVICE_ID=srv_xxxxx` in `.env` |
| `Deployment timed out` | Check Render dashboard for errors; might need manual troubleshoot |
| `node: command not found` | Use Command Prompt (cmd.exe) not PowerShell |
| `.env` file not found | Create it at project root: `echo RENDER_API_KEY=xxx > .env` |

---

## 🔄 Deployment Workflow

### After Code Changes:

```bash
# 1. Commit your changes
git add .
git commit -m "Update feature X"
git push origin main

# 2. Trigger deployment
npm run deploy

# 3. Wait for live
# (script polls automatically)

# 4. Done! App is live
```

### Multiple Deployments:

You can deploy as many times as you want. Each command:
1. Triggers a new build on Render
2. Waits for deployment
3. Confirms when live

---

## 💡 Pro Tips

### 1. Alias for Faster Deploys

Add to your terminal profile:

```bash
alias deploy="npm run deploy"
```

Then just:
```bash
deploy
```

### 2. Monitor on Render Dashboard

While deploying, watch progress at:
https://render.com/dashboard → Your Service → Deployments

### 3. Automated CI/CD (GitHub Actions)

For even more automation, add `.github/workflows/deploy.yml`:

```yaml
name: Auto-Deploy on Push
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install --legacy-peer-deps
      - run: npm run build
      - run: npm run deploy
        env:
          RENDER_API_KEY: ${{ secrets.RENDER_API_KEY }}
```

Then set `RENDER_API_KEY` as a GitHub secret, and every push auto-deploys! 🤖

---

## ✨ Next Steps

1. **Create `.env` file:**
   ```
   RENDER_API_KEY=rnd_tFnHheGEpaJDyeAkBZLKoXkObFFb
   RENDER_SERVICE_ID=srv_xxxxx  (optional, auto-detected)
   ```

2. **Test the script:**
   ```bash
   npm run deploy
   ```

3. **Done!** Your app deploys automatically on every command.

---

**No more manual web UI clicks. Just one command to deploy!** 🚀

