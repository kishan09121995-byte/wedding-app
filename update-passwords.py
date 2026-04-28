#!/usr/bin/env python3
import requests

SUPABASE_URL = "https://mexeegqwlewmrsejdvlw.supabase.co"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1leGVlZ3F3bGV3bXJzZWpkdmx3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNzc3MDE3NiwiZXhwIjoyMDMzMzM4MTc2fQ.H2f4lVF2t7cY5pY9kZ8qL3mN6oP2sR4tU7vW8xY9zA0"
NEW_PASSWORD = "060781"

# All users to update passwords
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

print("Updating all user passwords to: 060781\n")
print("="*60)

# Step 1: Get all users
print("Fetching all users from Supabase...")
url = f"{SUPABASE_URL}/auth/v1/admin/users"
response = requests.get(url, headers=headers)

if response.status_code != 200:
    print(f"FAILED: Failed to fetch users: {response.text}")
    exit(1)

supabase_users = response.json()
print(f"OK - Found {len(supabase_users)} users\n")

# Step 2: Update password for each user
updated_count = 0
for user in supabase_users:
    user_id = user['id']
    email = user['email']

    # Find matching username from our list
    matching_user = None
    for u in users:
        if u['username'] in email:
            matching_user = u
            break

    if matching_user:
        update_url = f"{SUPABASE_URL}/auth/v1/admin/users/{user_id}"
        payload = {
            "password": NEW_PASSWORD
        }

        update_response = requests.put(update_url, json=payload, headers=headers)

        if update_response.status_code in [200, 204]:
            print(f"OK - {matching_user['username'].upper():<18} password updated")
            updated_count += 1
        else:
            print(f"WARN - {matching_user['username']}: {update_response.text}")

print("\n" + "="*60)
print(f"PASSWORD UPDATE COMPLETE!")
print("="*60)
print(f"\nUpdated {updated_count}/{len(users)} user passwords")
print(f"\nNEW PASSWORD FOR ALL USERS: 060781")
print("\nLogin at: https://guileless-chebakia-c52b67.netlify.app/")
print("\nAll users can now login with:")
print("  • Username (e.g., kishan, megha, photographer)")
print("  • Password: 060781")
