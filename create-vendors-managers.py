#!/usr/bin/env python3
import requests

SUPABASE_URL = "https://mexeegqwlewmrsejdvlw.supabase.co"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1leGVlZ3F3bGV3bXJzZWpkdmx3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNzc3MDE3NiwiZXhwIjoyMDMzMzM4MTc2fQ.H2f4lVF2t7cY5pY9kZ8qL3mN6oP2sR4tU7vW8xY9zA0"
PASSWORD = "6781"

users = [
    {"username": "photographer", "role": "vendor"},
    {"username": "decorator", "role": "vendor"},
    {"username": "caterer", "role": "vendor"},
    {"username": "eventmanager1", "role": "event_manager"},
    {"username": "eventmanager2", "role": "event_manager"},
]

headers = {
    "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
    "Content-Type": "application/json"
}

print("🎊 Creating 5 Vendor & Event Manager accounts...\n")

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
            if user['role'] == "vendor":
                badge = "🏪 VENDOR"
            else:
                badge = "🎯 EVENT MANAGER"
            print(f"✅ {user['username'].upper():<18} {badge}")
        else:
            print(f"⚠️  {user['username']}: {response.text}")
    except Exception as e:
        print(f"❌ {user['username']}: {str(e)}")

print("\n" + "="*60)
print("✨ VENDORS & EVENT MANAGERS ADDED!")
print("="*60)

print("\n🏪 VENDOR ACCESS (3 vendors):")
print("   • photographer   - Manage photography")
print("   • decorator      - Manage decorations")
print("   • caterer        - Manage catering")

print("\n🎯 EVENT MANAGER ACCESS (2 managers):")
print("   • eventmanager1  - Manage timeline & events")
print("   • eventmanager2  - Manage timeline & events")

print("\n🔑 PASSWORD FOR ALL: 6781")

print("\n🔗 Login at: https://guileless-chebakia-c52b67.netlify.app/")
print("\nNow you have 16 total users managing your wedding! 💍")
