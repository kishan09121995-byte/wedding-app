# 🚀 Quick Start — Wedding App (Auto-Setup)

Your Supabase is ready! Here's how to get everything running in 5 minutes.

## Step 1: Create Database Schema (2 min)

**Go to Supabase Dashboard:**
1. https://app.supabase.com → Select your project
2. Click **SQL Editor** (left sidebar)
3. Click **New Query** (top right)
4. Open file: `wedding-app/supabase/migrations/001_init.sql`
5. Copy **ALL** the SQL code
6. Paste into Supabase query editor
7. Click **Run** (blue play button)

You'll see: `Success. No rows returned` ✅

**This creates all tables** (guests, hotels, functions, catering, etc.)

---

## Step 2: Create `.env.local` File (1 min)

In the `wedding-app` folder, create a file named `.env.local`:

```env
VITE_SUPABASE_URL=https://mexeegqwlewmrsejdvlw.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_DSfOh1b64Rv6fX_J703Xzw_INxl1eMx
```

**Save the file.** (Don't commit — it's in .gitignore)

---

## Step 3: Populate 294 Guests (2 min)

Open terminal in `wedding-app` folder:

```bash
npm install
npm run setup
```

You'll see:
```
🎉 Wedding App Database Setup
================================

📋 Checking database tables...
✅ Database tables exist

📊 Generating 294 sample guests...
✅ Generated: 161 Groom + 133 Bride

💾 Inserting guests into database...
   294/294 guests (100%)

✅ Successfully inserted all 294 guests!

📈 Database Summary:
   Total Guests: 294
   Groom Side: 161
   Bride Side: 133
   Total Pax: ~700

🚀 Ready to run the app!
```

---

## Step 4: Start the App (1 min)

```bash
npm run dev
```

Open **http://localhost:3000** in your browser ✅

---

## Step 5: Login & See 294 Guests (30 sec)

1. Click **"Don't have an account? Sign Up"**
2. Enter:
   - Email: `kishan@example.com`
   - Password: `password123`
3. Click **Sign Up**
4. **Sign In** with same credentials
5. You're now logged in! 🎉

---

## Step 6: View the Master RSVP Table

1. Click **Master RSVP** in left sidebar
2. See all **294 guests** in a table
3. Edit inline: RSVP status, Jain pax, function attendance, rooms, hotels

---

## That's It! ✅

You now have:
- ✅ Full React app running locally
- ✅ Supabase database with 294 guests
- ✅ Master RSVP table with inline editing
- ✅ Dashboard with live stats
- ✅ Full filters and search

---

## Test It Out

### Change RSVP Status
1. Click any yellow/green dropdown in RSVP column
2. Change to "Declined"
3. Go to **Dashboard** → See "Confirmed Pax" decrease! 📉

### Add a New Guest
1. Click **"+ Add Guest"** button
2. Fill in details
3. Save
4. Guest appears in table

### Filter Guests
1. Search by name
2. Filter by Side (Groom/Bride)
3. Filter by RSVP Status
4. Filter by Hotel

### Edit a Guest
1. Click Edit icon (pencil) on any row
2. Update details
3. Save

---

## What's Next?

Now that the app is running with 294 guests:

### Phase 3: Dashboard Enhancements
- Charts using Recharts
- Plate count breakdown
- RSVP pie chart
- Hotel occupancy
- Payment timeline

### Phase 4: Plate Count Calculations
- Auto-sum plates per meal
- Jain/Regular split
- Minimum Guarantee (MG) billing

### Phase 5: Hotel & Room Booking
- Room assignments
- Individual check-in/out dates
- Breakfast auto-detection

And more...

---

## Troubleshooting

| Problem | Solution |
|---|---|
| "Tables don't exist" | Run the SQL migration in Supabase (Step 1) |
| "npm not found" | Install Node.js from nodejs.org |
| "Port 3000 in use" | `npm run dev -- --port 3001` |
| "Login fails" | Check Supabase → Authentication → Users |
| "No guests showing" | Run `npm run setup` again |
| "Changes not saving" | Check `.env.local` has correct credentials |

---

## API Credentials (Already Configured)

Your credentials are already set up in `.env.local`:
- **Supabase URL:** https://mexeegqwlewmrsejdvlw.supabase.co
- **API Key:** sb_publishable_DSfOh1b64Rv6fX_J703Xzw_INxl1eMx

⚠️ **Don't share these publicly** (they're in `.env.local` which is in .gitignore)

---

## Summary

| Step | Time | Command |
|---|---|---|
| 1. Create Schema | 2 min | Paste SQL in Supabase |
| 2. Create .env.local | 1 min | Add 2 lines |
| 3. Install & Setup | 2 min | `npm install && npm run setup` |
| 4. Start App | 1 min | `npm run dev` |
| 5. Login | 30 sec | Sign up with test email |
| **Total** | **~7 min** | **5 commands** |

---

You're all set! 🎉

Run `npm run dev` and start managing your wedding! ✨

---

**Questions?** Check the console (F12) for error messages, or ask Claude for help.
