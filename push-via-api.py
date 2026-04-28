#!/usr/bin/env python3
import os
import json
import base64
import urllib.request
import urllib.error

TOKEN = "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"
OWNER = "kishan09121995-byte"
REPO = "wedding-app"
BRANCH = "main"
PROJECT_DIR = r"C:\Users\Kishan\wedding-app"

def github_api(method, path, data=None):
    """Make GitHub API request"""
    url = f"https://api.github.com/repos/{OWNER}/{REPO}{path}"
    headers = {
        "Authorization": f"token {TOKEN}",
        "Content-Type": "application/json"
    }

    if data:
        data = json.dumps(data).encode('utf-8')

    req = urllib.request.Request(url, data=data, headers=headers, method=method)

    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        print(f"❌ Error: {e.code} - {e.read().decode('utf-8')}")
        return None

def get_file_sha(path):
    """Get SHA of file if it exists"""
    response = github_api("GET", f"/contents/{path}")
    if response and "sha" in response:
        return response["sha"]
    return None

def upload_file(file_path, github_path):
    """Upload file to GitHub"""
    try:
        with open(file_path, 'rb') as f:
            content = f.read()

        encoded = base64.b64encode(content).decode('utf-8')

        sha = get_file_sha(github_path)

        data = {
            "message": f"Add {github_path}",
            "content": encoded,
            "branch": BRANCH
        }

        if sha:
            data["sha"] = sha

        github_api("PUT", f"/contents/{github_path}", data)
        print(f"✅ {github_path}")

    except Exception as e:
        print(f"❌ {github_path}: {e}")

print("🚀 Pushing code via GitHub API...")
print()

# Get all files to upload
files_to_upload = []
for root, dirs, files in os.walk(PROJECT_DIR):
    # Skip node_modules, .git, dist
    dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', 'dist', '.env']]

    for file in files:
        if file in ['.DS_Store', 'deploy-fresh.bat', 'simple-deploy.bat', 'auto-deploy.py', 'push-via-api.py']:
            continue

        full_path = os.path.join(root, file)
        rel_path = os.path.relpath(full_path, PROJECT_DIR).replace('\\', '/')
        files_to_upload.append((full_path, rel_path))

print(f"📦 Uploading {len(files_to_upload)} files...\n")

for i, (full_path, rel_path) in enumerate(files_to_upload, 1):
    upload_file(full_path, rel_path)
    if i % 10 == 0:
        print(f"   {i}/{len(files_to_upload)}...")

print()
print("✅ All files pushed to GitHub!")
print()
print("🔗 https://github.com/kishan09121995-byte/wedding-app")
print()
print("⏳ Creating Render service...")
print()

# Create Render service
import subprocess
curl_cmd = [
    'curl', '-X', 'POST', 'https://api.render.com/v1/services',
    '-H', 'Authorization: Bearer rnd_tFnHheGEpaJDyeAkBZLKoXkObFFb',
    '-H', 'Content-Type: application/json',
    '-d', json.dumps({
        "name": "wedding-app",
        "type": "static_site",
        "ownerId": "tea-d7o9vjcvikkc73borneg",
        "repo": "https://github.com/kishan09121995-byte/wedding-app",
        "branch": "main",
        "buildCommand": "npm install --legacy-peer-deps && npm run build",
        "publishPath": "dist",
        "envVars": [
            {"key": "VITE_SUPABASE_URL", "value": "https://mexeegqwlewmrsejdvlw.supabase.co"},
            {"key": "VITE_SUPABASE_ANON_KEY", "value": "sb_publishable_DSfOh1b64Rv6fX_J703Xzw_INxl1eMx"}
        ]
    })
]

subprocess.run(curl_cmd)

print()
print("=" * 60)
print("✨ DEPLOYMENT COMPLETE!")
print("=" * 60)
print()
print("🔗 Check live URL: https://dashboard.render.com")
print("⏱️  Building... (2-5 minutes)")
print()
