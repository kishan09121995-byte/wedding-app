#!/usr/bin/env python3
"""
Create all wedding app user accounts with password: test123@
"""
import requests
import json

SUPABASE_URL = "https://mexeegqwlewmrsejdvlw.supabase.co"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1leGVlZ3F3bGV3bXJzZWpkdmx3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNzc3MDE3NiwiZXhwIjoyMDMzMzM4MTc2fQ.H2f4lVF2t7cY5pY9kZ8qL3mN6oP2sR4tU7vW8xY9zA0"
PASSWORD = "test123@"

users = [
    {"username": "kishan", "role": "admin"},
    {"username": "megha", "role": "admin"},
    {"username": "palak", "role": "editor"},
    {"username": "payal", "role": "editor"},
    {"username": "darsh", "role": "editor"},
    {"username": "sahil", "role": "editor"},
    {"username": "kruti", "role": "editor"},
    {"username": "dharmesh", "role": "editor"},
    {"username": "nilesh", "role": "editor"},
    {"username": "alka", "role": "editor"},
    {"username": "nalita", "role": "editor"},
    {"username": "photographer", "role": "vendor"},
    {"username": "decorator", "role": "vendor"},
    {"username": "caterer", "role": "vendor"},
    {"username": "eventmanager1", "role": "event_manager"},
    {"username": "eventmanager2", "role": "event_manager"},
]

headers = {
    "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
    "apikey": SERVICE_ROLE_KEY,
    "Content-Type": "application/json"
}

print("\n" + "="*70)
print("WEDDING APP - USER ACCOUNT SETUP")
print("="*70)
print(f"\nPassword for all users: {PASSWORD}\n")

successful = 0
failed = 0

for user in users:
    email = f"{user['username']}@wedding.local"

    url = f"{SUPABASE_URL}/auth/v1/users"
    payload = {
        "email": email,
        "password": PASSWORD,
        "email_confirm": True,
        "user_metadata": {
            "username": user['username'],
            "role": user['role']
        }
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=10)

        if response.status_code in [200, 201]:
            badge = {
                "admin": "ADMIN",
                "editor": "EDITOR",
                "vendor": "VENDOR",
                "event_manager": "EVENT MGR"
            }.get(user['role'], "USER")

            print(f"  OK - {user['username'].upper():<18} ({badge})")
            successful += 1
        else:
            error = response.json() if response.text else str(response.status_code)
            if "already registered" in str(error).lower():
                print(f"  SKIP - {user['username']:<18} (already exists)")
            else:
                print(f"  FAIL - {user['username']:<18} ({error})")
                failed += 1
    except Exception as e:
        print(f"  ERROR - {user['username']:<18} ({str(e)})")
        failed += 1

print("\n" + "="*70)
print("SETUP COMPLETE")
print("="*70)
print(f"\nSuccessfully created: {successful} users")
print(f"Failed/Skipped: {failed} users")
print(f"\n{'*'*70}")
print("LOGIN CREDENTIALS FOR ALL USERS:")
print(f"{'*'*70}")
print(f"\nUsername: kishan (or any username below)")
print(f"Password: test123@")
print(f"\nAll Users:")
for i, user in enumerate(users, 1):
    role_tag = {
        "admin": "[ADMIN]",
        "editor": "[EDITOR]",
        "vendor": "[VENDOR]",
        "event_manager": "[EVENT MGR]"
    }.get(user['role'], "[USER]")
    print(f"  {i:2}. {user['username']:<18} {role_tag}")

print(f"\nApp URL: https://guileless-chebakia-c52b67.netlify.app/")
print(f"\n{'='*70}\n")
