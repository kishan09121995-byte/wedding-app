# Wedding App — Setup Guide

## Step 1: Supabase Project Setup (5 minutes)

### 1.1 Create Supabase Account
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with email or GitHub
4. Create a new organization (if prompted)

### 1.2 Create a New Project
1. Click "New Project"
2. **Project Name:** `wedding-app-kishan-megha` (or your choice)
3. **Database Password:** Create a strong password (save it)
4. **Region:** Choose closest to you (e.g., `ap-south-1` for India)
5. Click "Create new project" — this takes ~2 minutes

### 1.3 Get API Keys
Once project is created:
1. Go to **Settings** (left sidebar, bottom)
2. Click **API**
3. Copy:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public key** (looks like `eyJxxxxx...`)
4. Keep these safe — you'll need them in Step 3

## Step 2: Database Schema Setup (2 minutes)

### 2.1 Run SQL Migration
1. In your Supabase project, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Open `supabase/migrations/001_init.sql` from the wedding-app folder
4. Copy all the SQL and paste into the Supabase query editor
5. Click **Run** (blue play button, top right)
   - You'll see: "Success. No rows returned" — this is good!
   - This creates all tables, hotels, functions, payments, and default data

### 2.2 Verify Tables Created
1. Go to **Table Editor** (left sidebar)
2. You should see:
   - `guests` (empty for now)
   - `hotel_settings` (4 hotels pre-loaded)
   - `functions` (F1-F4 pre-loaded)
   - `catering_items` (9 meals pre-loaded)
   - `payment_schedule` (4 installments pre-loaded)
   - `photos`, `vendors`, `social_handles`, `timeline_events`, etc.

## Step 3: Local Project Setup (5 minutes)

### 3.1 Create `.env.local` File
In the `wedding-app` folder, create a new file called `.env.local`:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace:
- `your-project-id` with your actual project ID (from the URL)
- `your-anon-key-here` with the anon key you copied in Step 1.3

**Example:**
```
VITE_SUPABASE_URL=https://abcdefghijk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3.2 Install Dependencies
```bash
cd wedding-app
npm install
```
This takes ~1-2 minutes. You'll see packages being installed.

### 3.3 Start Dev Server
```bash
npm run dev
```

You'll see:
```
VITE v4.4.0  ready in 123 ms

➜  Local:   http://localhost:3000/
```

Open **http://localhost:3000** in your browser.

## Step 4: First Login (1 minute)

### 4.1 Sign Up
1. Click **"Don't have an account? Sign Up"**
2. Enter:
   - **Email:** `kishan@example.com` (or your email)
   - **Password:** `password123` (or any password)
3. Click **Sign Up**

### 4.2 Sign In
1. Enter the same email and password
2. Click **Sign In**
3. You'll be redirected to the **Dashboard**

🎉 **Success!** You're now logged in.

## Step 5: Verify Everything Works

### 5.1 Dashboard
You should see:
- Summary cards: Total Groups, Total Pax, Confirmed Pax, Rooms Needed
- All showing `0` (because we haven't imported guests yet)
- RSVP Status: Confirmed=0, Not Decided=0, Declined=0
- Function cards (F1-F4) all showing 0 plates
- Payment alert: ₹10,00,000 due

### 5.2 Sidebar Navigation
You should see all modules:
- Master RSVP
- Plate Count
- Hotel Settings
- Room Booking
- Hotel Billing
- Budget
- Timeline
- Photos
- Social Hub

### 5.3 Top Navigation
- Shows current page name
- Shows current date
- Mobile-friendly hamburger menu

## Step 6: Populate Guest Data (Optional for now)

### 6.1 Add Sample Guest
1. Go to **Master RSVP** (left sidebar)
2. Once built (Phase 2), you'll be able to:
   - Add guests manually
   - Import from Excel (Book2.xlsx + gusets.xlsx)
   - Edit RSVP status, function attendance, hotel, etc.

### 6.2 Import Excel Files
When Phase 2 is complete, you'll be able to:
1. Upload `Book2.xlsx` (161 Groom side guests)
2. Upload `gusets.xlsx` (133 Bride side guests)
3. Auto-populate all 294 guests with their names, cities, pax counts

**For now:** Leave empty, or add 5-10 sample guests manually to test.

## Step 7: Next Steps

The app is now set up! Here's what's built (Phase 1):
- ✅ Auth system (login/signup)
- ✅ Database schema
- ✅ Dashboard with live stats
- ✅ App shell with navigation

**Next phases (coming soon):**
- Phase 2: Master RSVP table with full editing
- Phase 3: Dashboard enhancements
- Phase 4: Plate Count calculations
- Phase 5-10: Hotel, budget, photos, social features

## Troubleshooting

### "Cannot find environment variables"
- Make sure `.env.local` is in the `wedding-app` folder (not in `src/`)
- Restart the dev server: `Ctrl+C` then `npm run dev`

### "Failed to fetch guests"
- Check Supabase URL and key in `.env.local`
- Go to Supabase → Settings → API to verify keys
- Check browser console for error messages

### "Database not created"
- Go to Supabase SQL Editor
- Paste `supabase/migrations/001_init.sql`
- Click **Run**
- Refresh and check Table Editor

### Port 3000 Already In Use
```bash
npm run dev -- --port 3001
```

## Security Notes
- Never commit `.env.local` to git (it's in `.gitignore`)
- Keep Supabase keys private — they control database access
- Use row-level security (RLS) policies in production (ask Claude for help)

## Questions?
Reach out to Kishan or Megha for questions about the wedding data or features.

---

**Status:** Phase 1 ✅ — Foundation ready | Phase 2 (Master RSVP) coming next
