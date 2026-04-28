#!/usr/bin/env python3
import requests

SUPABASE_URL = "https://mexeegqwlewmrsejdvlw.supabase.co"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1leGVlZ3F3bGV3bXJzZWpkdmx3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNzc3MDE3NiwiZXhwIjoyMDMzMzM4MTc2fQ.H2f4lVF2t7cY5pY9kZ8qL3mN6oP2sR4tU7vW8xY9zA0"
PASSWORD = "kishan@123"

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

print("Creating user accounts with password: kishan@123\n")

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
            if user['role'] == "admin":
                badge = "ADMIN"
            elif user['role'] == "vendor":
                badge = "VENDOR"
            elif user['role'] == "event_manager":
                badge = "EVENT MANAGER"
            else:
                badge = "EDITOR"
            print(f"OK - {user['username'].upper():<18} {badge}")
        else:
            error_msg = response.json() if response.text else response.status_code
            print(f"WARN - {user['username']}: {error_msg}")
    except Exception as e:
        print(f"ERROR - {user['username']}: {str(e)}")

print("\n" + "="*60)
print("USER ACCOUNT CREATION COMPLETE")
print("="*60)

print("\nADMIN USERS (Full Access):")
print("  • kishan")
print("  • megha")

print("\nEDITOR USERS (Can Edit):")
print("  • palak, payal, darsh, sahil, kruti, dharmesh, nilesh, alka, nalita")

print("\nVENDOR USERS:")
print("  • photographer, decorator, caterer")

print("\nEVENT MANAGER USERS:")
print("  • eventmanager1, eventmanager2")

print("\n" + "="*60)
print("LOGIN CREDENTIALS")
print("="*60)
print("\nUsername: kishan (or any username from above)")
print("Password: kishan@123")
print("\nApp URL: https://guileless-chebakia-c52b67.netlify.app/")
