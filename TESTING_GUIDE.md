# Wedding App - Feature Testing Guide

## Quick Test Checklist (5-10 minutes)

Test these in order on your Render deployment:

### ✅ 1. Dashboard (Already Working)
- [x] See sidebar with all menu items
- [x] See stat cards: 294 guests, 703 total pax
- [x] See RSVP Status chart (Confirmed, Not Decided, Declined)
- [x] See RSVP Distribution pie chart
- [x] See Bride vs Groom Split bar chart

---

### 2. Master RSVP
**Click: Master RSVP** (3rd menu item)

Expected:
- [ ] See table with all 294 guests
- [ ] See columns: Name, Side, Pax, Status, Actions
- [ ] Can search for a guest
- [ ] Can filter by side (Bride/Groom) and function

Test inline edit:
- [ ] Click on a guest's pax number, edit it, see it save

---

### 3. Menu Management
**Click: Menu Management** (5th menu item)

Expected:
- [ ] See "Add Menu Items" tab with list of menu options
- [ ] Can check/uncheck menu items (tick boxes)
- [ ] Can see count "X of Y items selected"
- [ ] Can set timing (8:00 AM - 10:00 PM dropdown)
- [ ] Can assign General Manager name
- [ ] See warning if trying to add duplicate item

Test export:
- [ ] Click "Export to Excel" button
- [ ] Download should include: Function, Item, Timing, GM, Selected status

---

### 4. Hotel Settings
**Click: Hotel Settings** (6th menu item)

Expected:
- [ ] See 4 hotel cards (LEO Resort, LEO Medium, etc.)
- [ ] See "Auto-Assign Guests" button with sparkle icon ✨
- [ ] Each hotel shows: rooms assigned vs needed

Test auto-assign:
- [ ] Click "Auto-Assign Guests"
- [ ] Guests should distribute evenly across hotels
- [ ] Room counts should update

---

### 5. Room Booking
**Click: Room Booking** (7th menu item)

Expected:
- [ ] See guest list grouped by hotel
- [ ] Columns: Name, Pax, Hotel, Category, Check-in, Check-out, Room #
- [ ] Can select check-in/check-out dates

Test PDF export:
- [ ] Click "Export PDF" button
- [ ] PDF file should download with room booking data

---

### 6. Hotel Billing (Restricted)
**Click: Hotel Billing** (8th menu item)

Expected:
- [ ] If you're NOT an admin: See "Access Denied" message
- [ ] If you ARE admin: See billing breakdown by hotel

---

### 7. Budget (Restricted)
**Click: Budget** (9th menu item)

Expected:
- [ ] If you're NOT admin/coordinator: See "Access Denied"
- [ ] If authorized: See budget summary and payment schedule

---

### 8. Plate Count
**Click: Plate Count** (4th menu item)

Expected:
- [ ] See table: Meal | Function | Regular Pax | Jain Pax | Actual | MG | Billing Pax | Cost
- [ ] Shows calculations for each meal type
- [ ] Can see "Export to Excel" button

---

### 9. Assignments (God Mode)
**Click: Task Assignments** (10th menu item, might scroll in sidebar)

Expected:
- [ ] See table with assignments
- [ ] Columns: Task | Assigned To | Status | Actions
- [ ] Can change status via dropdown
- [ ] Can add new assignment
- [ ] Can delete assignment

---

### 10. Team Chat
**Click: Team Chat** (11th menu item)

Expected:
- [ ] See message history area
- [ ] See input field at bottom
- [ ] Type message: "Hello @team" and click Send
- [ ] Message should appear with @mention highlighted

---

### 11. Arrivals & Check-in
**Click: Guest Arrivals** (12th menu item, called "Arrivals-sheet" internally)

Expected:
- [ ] See stat cards: Total Guests, Checked In, Checked Out, Not Arrived
- [ ] See guest table with search and status filter
- [ ] Columns: Name, Side, Status, Check-in Time, Actions

Test check-in:
- [ ] Click "Check In" button for a guest
- [ ] Status should change to "Checked In" (green)
- [ ] Check-in time should appear

---

### 12. Timeline
**Click: Timeline** (13th menu item)

Expected:
- [ ] See events grouped by Day 1 (21 Jun) and Day 2 (22 Jun)
- [ ] Table: Time | Event | Venue | Status
- [ ] Can change event status via dropdown
- [ ] Status changes should save

---

### 13. Décor Gallery
**Click: Décor Gallery** (14th menu item)

Expected:
- [ ] See header with "Add Decor" button
- [ ] See search and category filter
- [ ] Gallery grid showing décor items (if any)
- [ ] Can add new item with title, category, image URL, cost

Test add:
- [ ] Click "Add Decor"
- [ ] Fill form with sample data
- [ ] Click "Add"
- [ ] Item should appear in gallery

---

### 14. Photo Gallery
**Click: Photo Gallery** (15th menu item)

Expected:
- [ ] See upload area (drag & drop or click)
- [ ] See gallery grid (if photos uploaded)

Test upload:
- [ ] Click upload area
- [ ] Select a photo from your computer
- [ ] Photo should upload and appear in gallery

---

### 15. Social Hub
**Click: Social Hub** (16th menu item)

Expected:
- [ ] See "Social Handles" section with platform handles
- [ ] See "WhatsApp RSVP Generator" section
- [ ] See "QR Code" section
- [ ] Can select a guest and generate RSVP link
- [ ] Can generate QR code

---

### 16. Vendors
**Click: Vendors** (2nd menu item, at TOP after Dashboard)

Expected:
- [ ] See vendor table
- [ ] Columns: Name, Category, Contact, Budgeted, Paid, Balance
- [ ] Can add new vendor with "+ Add Vendor" button
- [ ] Can filter by category

---

### 17. QR Photo Registration
**URL: /qr-photos** (or look in sidebar if visible)

Expected:
- [ ] Tab 1: "Register Your Face" - upload selfie with name
- [ ] Tab 2: "Find My Photos" - search by name to see matched photos
- [ ] Can submit registration
- [ ] Can search and view matched photos

---

### 18. RSVP Portal (Public Link - No Login)
**URL: /rsvp/:token** 

Expected (for testing, generate a token first):
- [ ] Can access without login
- [ ] See guest name and RSVP options
- [ ] Can click Confirm/Decline/Not Sure
- [ ] Status should update without login

---

## Role-Based Access Control Test

### If you're a REGULAR USER:
- ✅ Can see: Dashboard, RSVP, Plate Count, Menu, Hotels, Rooms, Timeline, Photos, Social, Vendors, Chat, Arrivals, Décor, Assignments
- ❌ CANNOT see: Hotel Billing, Budget (should be hidden from sidebar & show access denied)

### If you're an ADMIN:
- ✅ Can see: ALL pages including Billing and Budget
- ✅ Billing & Budget pages should be accessible

---

## Testing Troubleshooting

**If a page doesn't load:**
1. Open Developer Console (F12)
2. Check Console tab for errors
3. Check Network tab - any 404s on assets?
4. Try refreshing the page (Ctrl+R)

**If data doesn't appear:**
1. Check if you're logged in correctly
2. Try navigating to another page and back
3. Check browser console for API errors
4. Verify Supabase connection

**If export doesn't work:**
1. Check if browser allows downloads
2. Check browser download folder
3. Try in a different browser

---

## Quick Feature Summary

| # | Feature | Menu | Status |
|---|---------|------|--------|
| 1 | Dashboard | Dashboard | ✅ Working |
| 2 | Master RSVP | Master RSVP | Test now |
| 3 | Menu Mgmt | Menu Management | Test now |
| 4 | Hotel Settings | Hotel Settings | Test now |
| 5 | Room Booking | Room Booking | Test now |
| 6 | Hotel Billing | Hotel Billing | Restricted |
| 7 | Budget | Budget | Restricted |
| 8 | Plate Count | Plate Count | Test now |
| 9 | Assignments | Task Assignments | Test now |
| 10 | Team Chat | Team Chat | Test now |
| 11 | Arrivals | Guest Arrivals | Test now |
| 12 | Timeline | Timeline | Test now |
| 13 | Décor | Décor Gallery | Test now |
| 14 | Photos | Photo Gallery | Test now |
| 15 | Social Hub | Social Hub | Test now |
| 16 | Vendors | Vendors | Test now |
| 17 | QR Photos | /qr-photos | Test now |
| 18 | RSVP Portal | /rsvp/:token | Test now |

---

**Testing Priority:**
1. ✅ Dashboard (already confirmed working)
2. Master RSVP (core feature)
3. Hotel Settings (new auto-assign)
4. Team Chat (new collaboration)
5. Arrivals Sheet (new check-in)
6. Menu Management (updated with timing)
7. All other pages as time permits

Let me know what you find! 🎉
