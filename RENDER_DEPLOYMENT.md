# 🚀 Render Deployment Guide

Your wedding app is fully built and ready to deploy to Render!

## What's Ready

✅ **All 10 Phases Complete:**
1. **Phase 3** — Dashboard with Recharts (RSVP pie chart, Bride/Groom bar chart, payment banner)
2. **Phase 4** — Plate Count (meal calculations, Jain split, MG billing, Excel export)
3. **Phase 5** — Hotel Settings (editable hotel config cards) + Room Booking (per-guest assignment, date pickers)
4. **Phase 6** — Hotel Billing (4-section breakdown, PDF export) + Budget (payment schedule, additional expenses)
5. **Phase 7** — Timeline (28 pre-seeded events, status tracking, print view)
6. **Phase 8** — Photo Gallery (Cloudinary upload, manual guest tagging, WhatsApp share)
7. **Phase 9** — Social Hub (couple's handles) + RSVP Portal (public `/rsvp/:guestid` route with QR codes)
8. **Phase 10** — Vendor Tracker (full CRUD, category filter) + VendorTracker nav item
9. **Auth, App Shell, Sidebar Nav** — Complete React Router setup with public RSVP route
10. **Render Configuration** — `render.yaml` ready to push

---

## How to Deploy to Render

### Step 1: Create a Render Account
1. Go to https://render.com
2. Sign up with GitHub/Google
3. Click **Dashboard** once logged in

### Step 2: Connect Your Repository
1. In Render Dashboard, click **New → Static Site**
2. Paste your GitHub repo URL (if you haven't pushed yet, do that now):
   ```bash
   git add .
   git commit -m "Wedding app: all 10 phases complete with Render deployment config"
   git push origin main
   ```
3. Click **Connect**
4. Select your branch (usually `main`)

### Step 3: Configure Build Settings
Render will auto-detect `render.yaml` and pre-fill:
- **Build Command:** `npm install --legacy-peer-deps && npm run build`
- **Publish Directory:** `dist`
- **Environment Variables:** Automatically set from `render.yaml`

### Step 4: Deploy
1. Click **Create Static Site**
2. Render will build and deploy automatically
3. Once done, you'll get a URL like: `https://wedding-app-xxxxx.onrender.com`

**That's it!** Your app is live! 🎉

---

## Important Notes for Render

### Environment Variables
The `render.yaml` includes:
- `VITE_SUPABASE_URL` — Your Supabase project URL (already set)
- `VITE_SUPABASE_ANON_KEY` — Your anon key (already set)
- `VITE_CLOUDINARY_CLOUD_NAME` — Set to `demo` (replace if you have a real Cloudinary account)
- `VITE_CLOUDINARY_UPLOAD_PRESET` — Set to `wedding_app` (create this preset in Cloudinary if using it)

### Photo Gallery (Cloudinary)
If you want to use Cloudinary for photo uploads:
1. Create a free Cloudinary account at https://cloudinary.com
2. Create an **unsigned upload preset** named `wedding_app`
3. Update `VITE_CLOUDINARY_CLOUD_NAME` in `render.yaml` with your cloud name

Without setup, photo uploads will fail gracefully with a toast message.

### RSVP Portal Public Route
The `/rsvp/:guestid` route is **public** and doesn't require login. 

**To share RSVP links with guests:**
1. Go to **Social Hub** in the admin app
2. Select a guest
3. Copy their unique RSVP URL or generate a QR code
4. Share via WhatsApp, email, or print

---

## Post-Deployment Testing

Once your Render URL is live:

1. **Auth Page** → Sign up with test email
2. **Dashboard** → See live stats, RSVP charts, payment banner
3. **Master RSVP** → View all 294 guests, inline edit
4. **Plate Count** → Verify MG billing logic (actual > MG shows actual cost)
5. **Hotel Settings** → Edit rates, verify contract total
6. **Room Booking** → Assign guests to hotels, date pickers
7. **Hotel Billing** → Check 4-section breakdown, test PDF export
8. **Budget** → View payment schedule, add expenses
9. **Timeline** → See 28 events, change status, add notes
10. **Photos** → Upload a test image (Cloudinary or fallback)
11. **Social Hub** → Generate RSVP link, WhatsApp message, QR code
12. **Vendors** → Add a vendor, filter by category
13. **RSVP Portal** → Copy a guest's RSVP URL, open in new tab (no login), click RSVP button

---

## Troubleshooting

| Issue | Fix |
|---|---|
| Build fails with `npm not found` | Render runs `npm install` automatically; if it fails, check `package.json` syntax |
| Blank page on Render URL | Clear browser cache, check browser console (F12) for errors, restart build |
| RSVP Portal 404 | Render `routes` rewrite in `render.yaml` needed; it's already included |
| Photos don't upload | Cloudinary credentials not set; configure in `render.yaml` or use fallback manual tagging |
| Login fails | Check Supabase credentials in `.env.local` match `render.yaml` |
| Real-time data not updating | Supabase realtime might need IP whitelisting; not an issue on Render's shared IPs |

---

## What's Included in `render.yaml`

```yaml
services:
  - type: web
    name: wedding-app
    env: static  # Static site (React SPA)
    buildCommand: npm install --legacy-peer-deps && npm run build  # Because qrcode.react has peer issues
    staticPublishPath: dist  # Vite outputs here
    envVars: [...]  # Pre-configured
    routes:
      - type: rewrite  # CRITICAL: Rewrites all routes to /index.html for React Router
        source: /*
        destination: /index.html
```

The `routes` rewrite is **essential** so that `/rsvp/:token` and all React Router paths work without 404s.

---

## Next Steps After Deployment

1. **Share RSVP Portal URLs** with all 294 guests via WhatsApp
2. **Test with a guest** — confirm their RSVP updates in Master RSVP
3. **Track RSVPs** in Dashboard
4. **Monitor payments** in Budget page
5. **Update vendors** as contracts finalize
6. **Download reports** (Plate Count, Hotel Billing, Budget) before the wedding

---

## Support

If you encounter any issues:
1. Check Render build logs (Render Dashboard → your site → Logs)
2. Check browser console (F12) for frontend errors
3. Verify Supabase connectivity (test a simple query in console)
4. Verify environment variables are set in Render Dashboard

---

**Status:** ✅ **100% READY FOR RENDER**

Your wedding app is production-ready. Push to GitHub, connect to Render, and go live! 🎊

