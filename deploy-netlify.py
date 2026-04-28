#!/usr/bin/env python3
import os
import json
import subprocess
import requests
import zipfile
import shutil
from pathlib import Path

NETLIFY_TOKEN = "nfp_Sj4qPmWLRgznGM11WjAtZ6hFExiQbhPWd58d"
SITE_NAME = "guileless-chebakia-c52b67"
DIST_DIR = "dist"

def run_command(cmd):
    """Run a shell command and return success status"""
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return result.returncode == 0, result.stdout, result.stderr

def build_app():
    """Build the app"""
    print("[1/4] Installing dependencies...")
    success, _, _ = run_command("npm install --legacy-peer-deps")
    if not success:
        print("ERROR: npm install failed")
        return False

    print("[2/4] Building the app...")
    success, _, _ = run_command("npm run build")
    if not success:
        print("ERROR: Build failed")
        return False

    print("OK - Build successful")
    return True

def get_site_id():
    """Get Netlify site ID from API"""
    print("[3/4] Fetching Netlify site ID...")
    headers = {
        "Authorization": f"Bearer {NETLIFY_TOKEN}",
        "Content-Type": "application/json"
    }

    try:
        response = requests.get("https://api.netlify.com/api/v1/sites", headers=headers)
        if response.status_code == 200:
            sites = response.json()
            for site in sites:
                if site.get("name") == SITE_NAME:
                    print(f"OK - Found site: {SITE_NAME}")
                    return site.get("id")
    except Exception as e:
        print(f"Note: Could not fetch site ID ({e})")

    return None

def zip_dist():
    """Create a zip file of the dist directory"""
    print("[4/4] Preparing files for deployment...")
    zip_path = "dist.zip"

    if os.path.exists(zip_path):
        os.remove(zip_path)

    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(DIST_DIR):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, DIST_DIR)
                zipf.write(file_path, arcname)

    return zip_path

def deploy(zip_path, site_id):
    """Deploy to Netlify"""
    print("\nDeploying to Netlify...")

    headers = {
        "Authorization": f"Bearer {NETLIFY_TOKEN}",
    }

    try:
        with open(zip_path, 'rb') as f:
            files = {'file': f}
            if site_id:
                url = f"https://api.netlify.com/api/v1/sites/{site_id}/deploys"
            else:
                url = f"https://api.netlify.com/api/v1/sites/{SITE_NAME}/deploys"

            response = requests.post(url, headers=headers, files=files)

        if response.status_code in [200, 201]:
            print("\nSUCCESS - Deployment Complete!")
            print("\nYour app is live at:")
            print("https://guileless-chebakia-c52b67.netlify.app/")
            return True
        else:
            print(f"ERROR: Deployment failed ({response.status_code})")
            print(response.text)
            return False
    except Exception as e:
        print(f"ERROR: {e}")
        return False
    finally:
        if os.path.exists(zip_path):
            os.remove(zip_path)

def main():
    print("\n" + "="*50)
    print("  WEDDING APP - NETLIFY AUTO DEPLOYMENT")
    print("="*50 + "\n")

    # Build
    if not build_app():
        return False

    # Get site ID
    site_id = get_site_id()

    # Create zip
    zip_path = zip_dist()

    # Deploy
    if deploy(zip_path, site_id):
        print("\n" + "="*50)
        print("  DEPLOYMENT SUCCESSFUL!")
        print("="*50)
        return True
    else:
        print("\nDeployment failed. Please try again.")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
