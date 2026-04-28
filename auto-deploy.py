#!/usr/bin/env python3
import subprocess
import json
import time
import sys

# Configuration
GITHUB_TOKEN = "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"
RENDER_API_KEY = "rnd_tFnHheGEpaJDyeAkBZLKoXkObFFb"
RENDER_OWNER_ID = "tea-d7o9vjcvikkc73borneg"
REPO_URL = "https://github.com/kishan09121995-byte/wedding-app"
PROJECT_DIR = "C:\\Users\\Kishan\\wedding-app"

def run_command(cmd, cwd=None):
    """Run shell command and return output"""
    try:
        result = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"❌ Command failed: {cmd}")
            print(f"Error: {result.stderr}")
            return False
        print(f"✅ {result.stdout.strip()}")
        return True
    except Exception as e:
        print(f"❌ Error running command: {e}")
        return False

def push_to_github():
    """Push code to GitHub"""
    print("\n🚀 Pushing code to GitHub...\n")

    # Configure git
    run_command('git config user.email "batavia.kishan9@gmail.com"', PROJECT_DIR)
    run_command('git config user.name "Kishan Batavia"', PROJECT_DIR)

    # Add and commit
    run_command('git add .', PROJECT_DIR)
    run_command('git commit -m "Wedding app deployment"', PROJECT_DIR)

    # Ensure main branch
    run_command('git branch -M main', PROJECT_DIR)

    # Remove existing remote if any
    run_command('git remote remove origin', PROJECT_DIR)

    # Add remote with token
    remote_url = f"https://{GITHUB_TOKEN}@github.com/kishan09121995-byte/wedding-app.git"
    run_command(f'git remote add origin "{remote_url}"', PROJECT_DIR)

    # Push
    if run_command('git push -u origin main', PROJECT_DIR):
        print("\n✅ Code pushed to GitHub successfully!")
        return True
    else:
        print("\n❌ Failed to push to GitHub")
        return False

def create_render_service():
    """Create service on Render"""
    print("\n🎊 Creating Render service...\n")

    import urllib.request
    import urllib.error

    api_url = "https://api.render.com/v1/services"
    headers = {
        "Authorization": f"Bearer {RENDER_API_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "name": "wedding-app",
        "type": "static_site",
        "ownerId": RENDER_OWNER_ID,
        "repo": REPO_URL,
        "branch": "main",
        "buildCommand": "npm install --legacy-peer-deps && npm run build",
        "publishPath": "dist",
        "envVars": [
            {
                "key": "VITE_SUPABASE_URL",
                "value": "https://mexeegqwlewmrsejdvlw.supabase.co"
            },
            {
                "key": "VITE_SUPABASE_ANON_KEY",
                "value": "sb_publishable_DSfOh1b64Rv6fX_J703Xzw_INxl1eMx"
            }
        ]
    }

    try:
        req = urllib.request.Request(
            api_url,
            data=json.dumps(data).encode('utf-8'),
            headers=headers,
            method='POST'
        )

        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            service_id = result.get('id')
            print(f"✅ Service created! ID: {service_id}")
            print(f"✅ Render is building and deploying your app...")
            print(f"\n🔗 Check deployment status at:")
            print(f"   https://dashboard.render.com")
            return True

    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        print(f"❌ API Error: {error_body}")
        return False
    except Exception as e:
        print(f"❌ Error creating service: {e}")
        return False

def main():
    print("="*60)
    print("🎊 WEDDING APP - AUTOMATED DEPLOYMENT")
    print("="*60)

    # Step 1: Push to GitHub
    if not push_to_github():
        print("\n⚠️  Failed to push to GitHub. Exiting.")
        sys.exit(1)

    # Step 2: Wait for GitHub to sync
    print("\n⏳ Waiting for GitHub to sync...")
    time.sleep(3)

    # Step 3: Create Render service
    if not create_render_service():
        print("\n⚠️  Failed to create Render service.")
        sys.exit(1)

    print("\n" + "="*60)
    print("✨ DEPLOYMENT STARTED!")
    print("="*60)
    print("\n📋 Next steps:")
    print("   1. Go to https://dashboard.render.com")
    print("   2. Click on 'wedding-app' service")
    print("   3. Wait for 'Build & Deploys' to finish")
    print("   4. Your live URL will appear when done!")
    print("\n⏱️  Build typically takes 2-5 minutes...")
    print("\n💡 Share RSVP links with guests once live!")
    print("="*60 + "\n")

if __name__ == "__main__":
    main()
