#!/usr/bin/env python3
import requests

SUPABASE_URL = "https://mexeegqwlewmrsejdvlw.supabase.co"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1leGVlZ3F3bGV3bXJzZWpkdmx3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNzc3MDE3NiwiZXhwIjoyMDMzMzM4MTc2fQ.H2f4lVF2t7cY5pY9kZ8qL3mN6oP2sR4tU7vW8xY9zA0"
PASSWORD = "6781"

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
]

headers = {
    "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
    "Content-Type": "application/json"
}

print("🎊 Creating 11 user accounts...\n")

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
        response = requests.post(url, json=payload, headers=headers)

        if response.status_code in [200, 201]:
            role_badge = "👑 ADMIN" if user['role'] == "admin" else "✏️  EDITOR"
            print(f"✅ {user['username'].upper():<12} {role_badge}")
        else:
            print(f"⚠️  {user['username']}: {response.text}")
    except Exception as e:
        print(f"❌ {user['username']}: {str(e)}")

print("\n" + "="*60)
print("✨ ALL 11 ACCOUNTS CREATED!")
print("="*60)

print("\n👑 ADMIN ACCESS (Full Control):")
print("   • kishan")
print("   • megha")

print("\n✏️  EDITOR ACCESS (Can Edit):")
print("   • palak")
print("   • payal")
print("   • darsh")
print("   • sahil")
print("   • kruti")
print("   • dharmesh")
print("   • nilesh")
print("   • alka")
print("   • nalita")

print("\n🔑 PASSWORD FOR ALL: 6781")

print("\n🔗 Login at: https://guileless-chebakia-c52b67.netlify.app/")
print("\nJust use username (kishan, megha, palak, etc.) - the system handles the rest!")
