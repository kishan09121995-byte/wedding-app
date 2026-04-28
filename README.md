# Wedding Management System
**Kishan Batavia & Megha Vithlani | June 21–22, 2026**

A comprehensive full-stack web application for managing a 294-guest, 4-function wedding across 4 hotels with real-time RSVP tracking, dynamic plate counts, hotel billing with MG logic, budget tracking, and photo/social media integration.

## Features

### Core Modules (Phase 1-7)
- **Dashboard** — Live stats, function plates, RSVP summary
- **Master RSVP** — 294 guests, inline editing, colour-coded status
- **Plate Count** — Auto-calculated catering per meal with Jain split
- **Hotel Settings** — Configuration for 4 hotels
- **Room Booking** — Guest-by-guest room assignments and billing
- **Hotel Billing** — Per-hotel cost breakdown and PDF export
- **Budget** — Full wedding budget tracking, payment schedule
- **Timeline** — 2-day event schedule with real-time status

### Advanced Features (Phase 8-10)
- **Photo Gallery / Kwik Pic** — AI face detection tags guests in photos
- **Social Hub** — Manage Instagram/WhatsApp handles, branded photo frames
- **Guest RSVP Portal** — Self-confirmation via shareable link
- **QR Code Check-in** — Real-time guest attendance at each function
- **Vendor Tracker** — Photography, decoration, DJ, etc.
- **Excel/PDF Export** — Full spreadsheet and billing PDF download

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Tailwind CSS + Vite |
| State | Zustand |
| Backend/DB | Supabase (PostgreSQL + Realtime) |
| Auth | Supabase Auth |
| Charts | Recharts |
| Export | SheetJS (xlsx), jsPDF |
| Photo AI | Cloudinary / AWS Rekognition |
| QR Codes | qrcode.react |
| Hosting | Vercel + Supabase |

## Quick Start

### 1. Clone & Install
```bash
cd wedding-app
npm install
```

### 2. Supabase Setup
1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Copy `Project URL` and `Anon Key` from Settings → API
4. Create `.env.local`:
```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```
5. Go to SQL Editor → New Query → Paste contents of `supabase/migrations/001_init.sql` → Run

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### 4. First Login
- Click "Sign Up"
- Enter any email (e.g., kishan@example.com)
- Enter any password
- Sign in with those credentials

## Project Structure

```
wedding-app/
├── src/
│   ├── lib/              # Supabase client
│   ├── store/            # Zustand stores
│   ├── pages/            # Page components (Dashboard, RSVP, etc.)
│   ├── layouts/          # Main layout with sidebar navigation
│   ├── components/       # Reusable components (Table, Modal, etc.)
│   ├── App.tsx           # Root component with auth logic
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── supabase/
│   └── migrations/       # Database schema
├── index.html            # Vite entry HTML
├── vite.config.ts        # Vite config
├── tailwind.config.ts    # Tailwind config
├── tsconfig.json         # TypeScript config
└── package.json          # Dependencies
```

## Phase Breakdown

### Phase 1: Project Setup ✅
- Vite + React + TypeScript + Tailwind
- Supabase schema + auth
- App shell with sidebar navigation

### Phase 2: Master RSVP (Next)
- Table with 294 guests
- Inline editing
- Colour-coded RSVP/function status
- Filters & search
- Excel import

### Phase 3: Dashboard
- Live function cards
- RSVP summary
- Hotel occupancy
- Payment alert

### Phase 4: Plate Count
- Auto-calculated per meal
- Jain/Regular split
- Bride/Groom breakdown
- MG logic

### Phase 5: Hotel Settings + Room Booking
- Hotel config cards
- Per-guest room assignments
- Breakfast auto-detection
- Individual check-in/out dates

### Phase 6: Hotel Billing + Budget
- Per-hotel cost breakdown
- Budget tracking
- Payment schedule
- PDF export

### Phase 7: Timeline
- 2-day event schedule
- Status tracking
- Catering actions

### Phase 8: Photo Gallery / Kwik Pic
- Photo upload (drag-drop)
- AI face detection
- Guest tagging
- Social share

### Phase 9: Social Hub + Guest Portal
- RSVP portal link
- QR check-in
- WhatsApp integration
- Social media handles

### Phase 10: Vendor Tracker + Export
- Vendor list
- Excel export
- PDF export

## Key Business Logic

### Plate Count Formula
```
Confirmed plates = SUM(pax_total WHERE rsvp='Confirmed' AND function='Yes')
Jain plates = SUM(jain_pax WHERE rsvp='Confirmed' AND function='Yes')
Regular plates = Confirmed - Jain
Buffer = CEILING(Total × 1.1)
```

### Hotel Billing
```
Rooms needed = CEILING(pax_total / capacity) per guest WHERE room='Yes'
Billing rooms = MAX(contracted_rooms, actual_rooms)
Room cost = billing_rooms × rate × nights
```

### Meal Billing (MG = Minimum Guarantee)
```
Billing pax = MAX(mg_pax, actual_confirmed_pax)
Cost = billing_pax × rate_per_plate
```

## Pre-loaded Data
- **Hotels:** LEO Resort, LEO Medium, XYZ Hotel, Indralok
- **Functions:** F1 Mandap, F2 Haldi, F3 Sangeet, F4 Wedding Day
- **Catering Rates:** Lunch ₹683 (MG150), HiTea ₹368 (MG200), Dinner ₹893 (MG550), Wedding Lunch ₹893 (MG500)
- **Hotel Contract:** ₹16,25,000 total
- **Payments:** Token ₹1L PAID, Inst1 ₹5.25L PAID, Inst2 ₹5L PENDING, Inst3 ₹5L PENDING

## Guest Data
- 161 Groom side guests (~365 pax)
- 133 Bride side guests (~337 pax)
- Total: 294 groups (~702 pax)
- All vegetarian; Jain split is the only dietary classification

## Notes
- Individual room dates — Each guest can have different check-in/out from hotel defaults
- Capacity per room — Selectable 2 or 3
- Not Decided ≠ Declined — Both excluded from plate counts
- Free breakfast — LEO Resort + LEO Medium in-house guests only (F4)
- Jain pax is numeric — Enter actual count, not binary toggle

## Build & Deploy

```bash
npm run build    # Build for production
npm run preview  # Preview build locally
```

Deploy to Vercel:
```bash
npm install -g vercel
vercel           # Follow prompts
```

## Support & Feedback
For issues or suggestions, contact kishan or megha via WhatsApp/Telegram.

---

Generated with Anthropic Claude | Vite 4 | Supabase | React 18
"# wedding-app-1" 
