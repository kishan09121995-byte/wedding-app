# Running the Wedding App — Quick Start

## Prerequisites
- Node.js 16+ (download from nodejs.org)
- npm (comes with Node.js)
- Supabase account (free at supabase.com)

## Step 1: Supabase Setup (5 minutes)

### 1.1 Create Supabase Project
1. Go to https://supabase.com → Sign up (free)
2. Create new project:
   - **Project Name:** `wedding-app`
   - **Password:** Create strong password (save it)
   - **Region:** ap-south-1 (for India)
3. Wait for project to spin up (~2 min)

### 1.2 Get API Keys
1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** (e.g., `https://abc123.supabase.co`)
   - **anon public key** (long string starting with `eyJ...`)

### 1.3 Run Database Schema
1. In Supabase, go to **SQL Editor** → **New Query**
2. Open file: `wedding-app/supabase/migrations/001_init.sql`
3. Copy ALL the SQL code
4. Paste into Supabase query editor
5. Click **Run** (top right)
   - Should see: "Success. No rows returned"

### 1.4 Verify Tables
Go to **Table Editor** and confirm you see:
- `guests` ✅
- `hotel_settings` (4 hotels pre-loaded)
- `functions` (F1-F4 pre-loaded)
- `catering_items` (9 meals pre-loaded)
- `payment_schedule` (4 installments pre-loaded)

## Step 2: Local Setup (5 minutes)

### 2.1 Clone/Extract Wedding App
```bash
# If you don't have the folder yet
mkdir wedding-app
cd wedding-app
```

### 2.2 Create `.env.local` File
In the `wedding-app` folder, create a file called `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Replace with YOUR actual values from Step 1.2**

Example (DO NOT USE):
```env
VITE_SUPABASE_URL=https://abcdefghijk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2.3 Install Dependencies
```bash
npm install
```
Takes ~1-2 minutes. You'll see packages installing.

### 2.4 Start Development Server
```bash
npm run dev
```

You'll see:
```
VITE v4.4.0  ready in 123 ms

➜  Local:   http://localhost:3000/
```

**Open http://localhost:3000 in your browser** ✅

## Step 3: Login & Load 294 Guests (2 minutes)

### 3.1 Sign Up
1. Click **"Don't have an account? Sign Up"**
2. Enter:
   - **Email:** `kishan@example.com`
   - **Password:** `password123`
3. Click **Sign Up**

### 3.2 Sign In
1. Use same email/password
2. Click **Sign In**
3. Wait a moment... then you'll see the **Dashboard** ✅

### 3.3 Dashboard Overview
You should see:
- **Total Groups:** 294
- **Total Pax:** ~700
- **Confirmed:** Should show some numbers (randomly assigned from sample data)
- **Rooms Needed:** Count of guests needing rooms
- **4 Function Cards:** F1-F4 with plate counts and Jain split
- **Payment Alert:** ₹10,00,000 due

### 3.4 Load Sample Guests
1. Click **"Master RSVP"** in left sidebar
2. You'll see: "Loading sample data for 294 guests..."
3. **Wait ~10-15 seconds** for guests to populate
4. You'll see success message: "✅ Seeded 294 sample guests"

### 3.5 Master RSVP Table Appears
Now you can see:
- **294 rows** of guests
- **161 Groom side** + **133 Bride side**
- Each with: Name, City, Pax, RSVP Status, Jain count, Function attendance, Room assignment

## What You Can Do Now

### Edit RSVP Status
1. Click the **yellow/green/red dropdown** in RSVP column
2. Change from "Confirmed" to "Not Decided" or "Declined"
3. **Auto-updates** — Dashboard re-calculates immediately

### Adjust Jain Pax
1. Click the **number field** in Jain column
2. Enter 0-N (where N = total pax for that guest)
3. Auto-updates plate counts

### Set Function Attendance
1. Click **Yes/No/TBD** dropdowns in F1-F4 columns
2. Change attendance
3. Plate Count recalculates in real-time

### Assign Rooms
1. Click **Hotel dropdown** (only enabled if Room=Yes)
2. Select: LEO Resort, LEO Medium, XYZ Hotel, Indralok
3. Auto-updates room count and billing

### Filter Guests
1. Use filters at top:
   - **Search:** By name or city
   - **Side:** Groom or Bride
   - **RSVP Status:** Confirmed, Not Decided, Declined
   - **Hotel:** Which hotel
2. Results update instantly

### Add/Edit Individual Guest
1. Click **"+ Add Guest"** button
2. Fill form with guest details
3. Click **"Add Guest"** to save

### Delete Guest
1. Click trash icon (🗑️) on any row
2. Confirm deletion

## Dashboard Real-Time Updates

Go back to **Dashboard** (click it in sidebar) and notice:
- All stats update in real-time as you edit RSVP
- **Confirmed Pax** changes as you mark guests confirmed
- **Function cards** show updated plate counts
- **Jain count** updates as you adjust Jain pax

## What's Built (Phase 1-2)

| Feature | Status |
|---|---|
| ✅ Auth (Signup/Login) | Complete |
| ✅ Dashboard with live stats | Complete |
| ✅ Master RSVP table (294 guests) | Complete |
| ✅ Inline editing (RSVP, Jain, Functions, Rooms, Hotel) | Complete |
| ✅ Filters & Search | Complete |
| ✅ Add/Edit/Delete guests | Complete |
| ✅ Colour-coded status | Complete |
| ✅ Sample data (294 guests pre-seeded) | Complete |
| ⏳ Excel import (coming) | Queued |
| ⏳ Plate Count calculations | Queued |
| ⏳ Hotel Settings & Room Booking | Queued |
| ⏳ Hotel Billing | Queued |
| ⏳ Budget tracking | Queued |
| ⏳ Timeline | Queued |
| ⏳ Photo Gallery / Kwik Pic | Queued |
| ⏳ Social Hub | Queued |

## Troubleshooting

### "Port 3000 already in use"
```bash
npm run dev -- --port 3001
```

### "Cannot find guests" or blank table
1. Go back to Master RSVP page
2. Refresh browser (F5)
3. Click "Add Guest" or wait for auto-load

### "RSVP Status dropdown not working"
- Make sure you're editing the dropdown in the table (not the header)
- Click directly on the dropdown

### "Changes not saving"
1. Check browser console (F12 → Console)
2. Verify `.env.local` has correct Supabase URL & key
3. Restart dev server: `Ctrl+C` → `npm run dev`

### "Cannot authenticate / Login fails"
- In Supabase, check **Authentication** → **Users**
- You should see your test user listed
- If not, try signing up again with different email

## Data Structure (What You're Editing)

Each guest has:
- **Name** — Group name (e.g., "Deepak Mota")
- **City** — Where they're from
- **Pax Total** — How many people in group
- **Side** — Groom or Bride
- **RSVP Status** — Confirmed / Not Decided / Declined
- **Jain Pax** — How many are Jain
- **F1-F4** — Yes/No/TBD for each function
- **Room** — Yes/No if they need a room
- **Hotel** — Which hotel assigned
- **Check-in/out** — Dates (default 21-22 June)

## Next Steps

Once you're comfortable with Master RSVP:
1. **Try the filters** — Change RSVP status, see plate counts update
2. **Add 5 new guests** — Use "Add Guest" button
3. **Visit Dashboard** — Watch stats update
4. **Check sample data quality** — Notice realistic names, pax counts, Jain distributions

Then we'll build:
- **Phase 3:** Full Dashboard with charts
- **Phase 4:** Plate Count calculations
- **Phase 5:** Hotel & Room Booking
- **Phase 6:** Billing & Budget
- Etc.

---

**Status:** ✅ Phase 2 Complete — 294 Guests Loaded & Editable

**Need help?** Check the console (F12) for error messages, or ask Claude to troubleshoot.
