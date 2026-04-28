#!/usr/bin/env python3
import requests
import json

SUPABASE_URL = "https://mexeegqwlewmrsejdvlw.supabase.co"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1leGVlZ3F3bGV3bXJzZWpkdmx3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNzc3MDE3NiwiZXhwIjoyMDMzMzM4MTc2fQ.H2f4lVF2t7cY5pY9kZ8qL3mN6oP2sR4tU7vW8xY9zA0"

users = [
    {"email": "kishan@wedding.com", "password": "Kishan@123", "name": "Kishan"},
    {"email": "megha@wedding.com", "password": "Megha@123", "name": "Megha"},
    {"email": "mom@wedding.com", "password": "Mom@123", "name": "Mom"},
    {"email": "dad@wedding.com", "password": "Dad@123", "name": "Dad"},
    {"email": "sister@wedding.com", "password": "Sister@123", "name": "Sister"},
    {"email": "brother@wedding.com", "password": "Brother@123", "name": "Brother"},
    {"email": "planner1@wedding.com", "password": "Planner1@123", "name": "Planner 1"},
    {"email": "planner2@wedding.com", "password": "Planner2@123", "name": "Planner 2"},
]

headers = {
    "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
    "Content-Type": "application/json"
}

print("🎊 Creating 8 user accounts...\n")

for user in users:
    url = f"{SUPABASE_URL}/auth/v1/users"

    payload = {
        "email": user["email"],
        "password": user["password"],
        "email_confirm": True,
        "user_metadata": {
            "name": user["name"]
        }
    }

    try:
        response = requests.post(url, json=payload, headers=headers)

        if response.status_code in [200, 201]:
            print(f"✅ {user['name']:<15} ({user['email']})")
            print(f"   Password: {user['password']}\n")
        else:
            print(f"⚠️  {user['name']}: {response.text}\n")
    except Exception as e:
        print(f"❌ {user['name']}: {str(e)}\n")

print("\n" + "="*60)
print("✨ ALL ACCOUNTS CREATED!")
print("="*60)
print("\n📝 Share these logins with your team:\n")

for i, user in enumerate(users, 1):
    print(f"{i}. {user['name']:15} | {user['email']:25} | {user['password']}")

print("\n🔗 App: https://guileless-chebakia-c52b67.netlify.app/")
print("\nEveryone can now login and manage the wedding! 💍")
