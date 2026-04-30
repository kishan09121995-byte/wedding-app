# Wedding Management App - Deployment Guide

## Build Status
✅ **Ready for Production Deployment**

All 16 features have been successfully implemented and integrated:
1. ✅ Menu Management with tick/untick and timing assignment
2. ✅ QR Photo Registration integrated with Google Drive backend
3. ✅ Hotel Settings with auto-assign functionality
4. ✅ Room Booking with PDF export capability
5. ✅ Team Chat with @mention support
6. ✅ Arrivals & Check-in Sheet with status tracking
7. ✅ Décor Reference Gallery with categories
8. ✅ Timeline management with event status
9. ✅ Photo Gallery with Google Drive integration
10. ✅ Social Hub with RSVP portal and QR codes
11. ✅ Vendor Tracker with budget management
12. ✅ Dashboard with Recharts visualizations
13. ✅ Master RSVP with guest management
14. ✅ Plate Count calculator
15. ✅ Budget and Billing modules
16. ✅ Assignments (God Mode) with notifications

## Recent Updates (2026-04-30)

### Fixed
- **Sidebar Navigation**: Restricted items (Hotel Billing, Budget) are now hidden from non-authorized users
- **Duplicate Files**: Removed all duplicate .js files to prevent TypeScript compilation conflicts
- **Access Control**: Role-based filtering ensures only admin, bride_admin, groom_admin, vendor_admin, and coordinator can access billing pages

### Verified Configuration
- ✅ Tailwind CSS with custom colors (rose-gold: #B76E79, mauve: #8B3A62)
- ✅ React Router for RSVP portal (/rsvp/:token public route)
- ✅ Supabase environment variables configured
- ✅ Render deployment configuration in render.yaml
- ✅ All dependencies properly installed

## Environment Variables

### Required for Production
```env
VITE_SUPABASE_URL=https://mexeegqwlewmrsejdvlw.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_DSfOh1b64Rv6fX_J703Xzw_INxl1eMx
VITE_GOOGLE_DRIVE_FOLDER_ID=1VR9SeSoUy9_-1ylitBWOXZYtr3Z2DlYR
```

These are configured in `render.yaml` for automated deployment.

## Build Command
```bash
npm install --legacy-peer-deps && npm run build
```

This generates the `dist/` folder with production-ready files.

## Deployment Steps for wedding.biminfrasolutions.in

### Option 1: Via Git Push (Recommended for Render)
1. Commit all changes: `git add . && git commit -m "Complete wedding app with all 16 features"`
2. Push to remote: `git push origin main`
3. Render will automatically detect changes and deploy

### Option 2: Manual Build & Deploy
1. Run: `npm run build`
2. Upload `dist/` folder contents to wedding.biminfrasolutions.in via FTP/SFTP
3. Ensure web server is configured to serve `dist/index.html` for all non-matching routes (SPA routing)

## Key Features by Page

### Public Access (No Login Required)
- **RSVP Portal** (`/rsvp/:token`) - Guest RSVP form for email links and QR codes

### Restricted Pages (Admin/Coordinator Only)
- Hotel Billing - Hidden from sidebar for unauthorized users
- Budget - Hidden from sidebar for unauthorized users

### Team Collaboration
- **Team Chat** - Real-time messaging with @mentions
- **Assignments** - Task tracking with status updates
- **Timeline** - Event management with day-wise organization
- **Notifications** - Real-time alerts for activity

### Guest Management
- **Master RSVP** - Complete guest list with inline editing
- **Plate Count** - Catering calculations with MG logic
- **Arrivals Sheet** - Check-in/check-out tracking
- **Décor Gallery** - Reference photos with cost estimates
- **Vendor Tracker** - Vendor management with budgets

### Photo Features
- **Photo Gallery** - Upload and manage wedding photos
- **QR Photo Registration** - Face registration for automated photo matching
- **Social Hub** - WhatsApp RSVP distribution and QR code generation

### Planning & Admin
- **Hotel Settings** - Auto-assign guests to hotels
- **Room Booking** - Room assignments with check-in/check-out dates
- **Menu Management** - Select menu items with timing and GM assignment
- **Dashboard** - Overview with charts and key metrics

## Verification Checklist

After deployment, verify the following:

- [ ] Auth page loads and login works
- [ ] Dashboard displays with charts and metrics
- [ ] Master RSVP shows all 294 guests with search/filter
- [ ] Menu Management displays selected items with export
- [ ] Hotel Settings shows auto-assign feature
- [ ] Room Booking allows assignments and PDF export
- [ ] Team Chat allows messaging and @mentions
- [ ] Arrivals Sheet records check-in/check-out
- [ ] Décor Gallery displays items with filters
- [ ] Timeline shows events with status tracking
- [ ] Photo Gallery allows uploads
- [ ] Vendor Tracker lists vendors with budgets
- [ ] Restricted pages (Billing/Budget) only visible to admins
- [ ] `/rsvp/:token` route works without login
- [ ] QR Photo Registration works with backend API
- [ ] Social Hub generates QR codes and RSVP links

## Troubleshooting

### Build Errors
- Ensure Node.js version 16+ is installed
- Run `npm install --legacy-peer-deps` first
- Clear `node_modules` and reinstall if issues persist: `rm -rf node_modules && npm install --legacy-peer-deps`

### Deployment Issues
- Check environment variables are set correctly in Render dashboard
- Verify SPA routing is enabled (rewrite all routes to index.html)
- Check browser console (F12) for JavaScript errors
- Verify Supabase connection by checking Network tab

### Feature Not Working
- Check browser console for errors
- Verify Supabase tables exist and have correct schema
- For photo features, verify Google Drive folder ID is correct
- For backend API, verify wedding-gallery-backend is running

## Support Contact
For issues with specific features:
- Google Drive photo integration: Check GOOGLE_DRIVE_FOLDER_ID env var
- Supabase issues: Visit https://app.supabase.com
- Backend photo processing: Check Railway deployment at https://railway.app

---
**Last Updated**: 2026-04-30
**Status**: ✅ Ready for Production
