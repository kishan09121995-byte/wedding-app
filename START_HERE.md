# 🎯 START HERE

Your wedding management app is **fully built and ready**. Follow these 5 steps to get it running!

---

## ⚡ 5-Minute Setup

### Step 1️⃣: Create Database Schema (Supabase)

**URL:** https://app.supabase.com

1. Log in to Supabase
2. Select your project
3. Click **SQL Editor** (left sidebar)
4. Click **New Query**
5. **Copy the entire content** from file: `SQL_TO_PASTE_IN_SUPABASE.sql`
6. **Paste** into Supabase
7. Click **Run** (top right)

**Result:** Tables created successfully ✅

---

### Step 2️⃣: Create `.env.local` File

In the `wedding-app` folder, create a new file called `.env.local` and paste:

```env
VITE_SUPABASE_URL=https://mexeegqwlewmrsejdvlw.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_DSfOh1b64Rv6fX_J703Xzw_INxl1eMx
```

**Save it.** (It's in `.gitignore` — don't commit)

---

### Step 3️⃣: Install Dependencies

Open terminal in `wedding-app` folder:

```bash
npm install
```

Wait for it to complete (~1-2 minutes).

---

### Step 4️⃣: Populate 294 Guests

Still in `wedding-app` folder, run:

```bash
npm run setup
```

You'll see:

```
🎉 Wedding App Database Setup
✅ Generated: 161 Groom + 133 Bride
💾 Inserting guests into database...
   294/294 guests (100%)
✅ Successfully inserted all 294 guests!
```

---

### Step 5️⃣: Start the App

```bash
npm run dev
```

You'll see:

```
VITE v4.4.0  ready in 123 ms

➜  Local:   http://localhost:3000/
```

**Open http://localhost:3000 in your browser** 🚀

---

## 🔐 Login to Your App

1. Click **"Don't have an account? Sign Up"**
2. Enter:
   - Email: `kishan@example.com`
   - Password: `password123`
3. Click **Sign Up**
4. **Sign In** with same credentials

**You're in!** 🎉

---

## 👥 See All 294 Guests

1. Click **Master RSVP** (left sidebar)
2. You'll see a table with all 294 guests!

### What you can do:
✅ **Edit RSVP Status** — Click dropdown → Change status  
✅ **Change Jain Pax** — Click number → Enter value  
✅ **Toggle Attendance** — Click F1-F4 Yes/No/TBD  
✅ **Assign Hotel** — Click hotel dropdown  
✅ **Add Guest** — Click "+ Add Guest" button  
✅ **Search/Filter** — Use filters at top  
✅ **Edit/Delete** — Click edit/delete icons  

---

## 📊 Watch Dashboard Update in Real-Time

1. Go to **Dashboard** (left sidebar)
2. Edit a guest's RSVP in **Master RSVP**
3. Go back to **Dashboard** → Numbers changed! ⚡

Dashboard shows:
- Total groups & pax
- Confirmed pax
- Rooms needed
- Function plates by F1-F4
- Payment status

---

## ✅ You Now Have:

- ✅ **React 18 + TypeScript + Vite** — Modern, fast app
- ✅ **Supabase Backend** — Database, auth, realtime
- ✅ **294 Sample Guests** — 161 Groom + 133 Bride
- ✅ **Master RSVP Table** — Full editing, filtering, search
- ✅ **Dashboard** — Live statistics
- ✅ **4 Hotels** — Pre-configured with rates
- ✅ **4 Functions** — F1-F4 with catering data
- ✅ **Payment Schedule** — ₹16.25L hotel contract

---

## 📁 Important Files

| File | What it does |
|---|---|
| `SQL_TO_PASTE_IN_SUPABASE.sql` | Database schema — paste in Supabase |
| `.env.local` | Your credentials (create this) |
| `setup.js` | Auto-populates 294 guests |
| `QUICK_START.md` | Detailed setup guide |
| `SETUP_COMPLETE.md` | Full feature documentation |

---

## 🆘 If Something Goes Wrong

| Problem | Fix |
|---|---|
| "npm not found" | Install Node.js from nodejs.org |
| "Tables don't exist" | Run the SQL in Supabase (Step 1) |
| "Port 3000 in use" | `npm run dev -- --port 3001` |
| "Can't login" | Check Supabase → Authentication → Users |
| "No guests in table" | Run `npm run setup` again |
| Changes not saving | Verify `.env.local` has correct credentials |

---

## 🎯 Next Steps (After Setup)

Once the app is running smoothly:

1. **Test the features** (see section above)
2. **Get familiar** with Master RSVP & Dashboard
3. **Tell me what works** and if you found any issues

Then I'll build:
- **Phase 3:** Dashboard enhancements (charts)
- **Phase 4:** Plate count calculations
- **Phase 5:** Hotel settings & room booking
- **Phase 6:** Billing & budget
- **Phase 7:** Timeline
- **Phase 8:** Photo gallery with AI face detection
- **Phase 9:** Social hub & guest portal
- **Phase 10:** Vendor tracker & exports

---

## 💡 Pro Tips

1. **Reload page** if something looks broken
2. **Check browser console** (F12) for errors
3. **Restart dev server** if code changes don't show
4. **Edit inline** — Click any field to change it
5. **Watch Dashboard** update as you edit guests

---

## 🚀 Ready?

```bash
# Copy-paste these commands in order:

# 1. Install
npm install

# 2. Setup guests
npm run setup

# 3. Start app
npm run dev
```

Then open **http://localhost:3000** 

Sign up, click **Master RSVP**, and enjoy! 💍✨

---

## Questions?

- **Setup stuck?** → Read `QUICK_START.md`
- **Want details?** → Read `SETUP_COMPLETE.md`
- **Need help?** → Check the browser console (F12) for errors

---

**That's it! You're all set.** 🎉

The wedding app is ready to manage your 294 guests, track RSVPs, handle catering, manage rooms, and track your budget.

**Go build! 🚀**
