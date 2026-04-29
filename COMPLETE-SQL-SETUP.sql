-- ============================================
-- WEDDING APP - COMPLETE SQL SETUP
-- Run each section in order in Supabase SQL Editor
-- ============================================

-- ============================================
-- SECTION 1: REMOVE FK CONSTRAINT (to allow guest seeding)
-- ============================================
ALTER TABLE public.guests DROP CONSTRAINT IF EXISTS guests_hotel_id_fkey;
ALTER TABLE public.guests ALTER COLUMN hotel_id DROP NOT NULL;

-- ============================================
-- SECTION 2: CREATE HOTELS TABLE & INSERT DATA
-- ============================================
CREATE TABLE IF NOT EXISTS public.hotels (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  rate_per_room_night NUMERIC,
  contracted_rooms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hotel_read" ON public.hotels FOR SELECT USING (true);
CREATE POLICY "hotel_insert" ON public.hotels FOR INSERT WITH CHECK (true);
CREATE POLICY "hotel_update" ON public.hotels FOR UPDATE USING (true);
CREATE POLICY "hotel_delete" ON public.hotels FOR DELETE USING (true);

INSERT INTO public.hotels (id, name, category, rate_per_room_night, contracted_rooms)
VALUES
  (1, 'LEO Resort', 'Luxury', 8000, 50),
  (2, 'LEO Medium', 'Premium', 5000, 30),
  (3, 'XYZ Hotel', 'Standard', 3000, 40),
  (4, 'Indralok', 'Budget', 2000, 20)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- SECTION 3: CREATE ASSIGNMENTS TABLE (for responsibility tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS public.assignments (
  id BIGSERIAL PRIMARY KEY,
  guest_id BIGINT REFERENCES public.guests(id) ON DELETE CASCADE,
  responsibility TEXT NOT NULL,
  assigned_to TEXT,
  status TEXT DEFAULT 'Pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "assign_read" ON public.assignments FOR SELECT USING (true);
CREATE POLICY "assign_insert" ON public.assignments FOR INSERT WITH CHECK (true);
CREATE POLICY "assign_update" ON public.assignments FOR UPDATE USING (true);
CREATE POLICY "assign_delete" ON public.assignments FOR DELETE USING (true);

-- ============================================
-- SECTION 4: CREATE GUEST_ARRIVALS TABLE (for arrivals & transport)
-- ============================================
CREATE TABLE IF NOT EXISTS public.guest_arrivals (
  id BIGSERIAL PRIMARY KEY,
  guest_id BIGINT REFERENCES public.guests(id) ON DELETE CASCADE,
  arrival_date DATE,
  arrival_time TIME,
  transport_type TEXT,
  driver_assigned TEXT,
  vehicle_number TEXT,
  status TEXT DEFAULT 'Pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.guest_arrivals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "arrival_read" ON public.guest_arrivals FOR SELECT USING (true);
CREATE POLICY "arrival_insert" ON public.guest_arrivals FOR INSERT WITH CHECK (true);
CREATE POLICY "arrival_update" ON public.guest_arrivals FOR UPDATE USING (true);
CREATE POLICY "arrival_delete" ON public.guest_arrivals FOR DELETE USING (true);

-- ============================================
-- SECTION 5: CREATE EVENT_DETAILS TABLE (for decor & photography)
-- ============================================
CREATE TABLE IF NOT EXISTS public.event_details (
  id BIGSERIAL PRIMARY KEY,
  function_id BIGINT REFERENCES public.functions(id) ON DELETE CASCADE,
  detail_type TEXT,
  description TEXT,
  assigned_to TEXT,
  status TEXT DEFAULT 'Pending',
  photo_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.event_details ENABLE ROW LEVEL SECURITY;
CREATE POLICY "detail_read" ON public.event_details FOR SELECT USING (true);
CREATE POLICY "detail_insert" ON public.event_details FOR INSERT WITH CHECK (true);
CREATE POLICY "detail_update" ON public.event_details FOR UPDATE USING (true);
CREATE POLICY "detail_delete" ON public.event_details FOR DELETE USING (true);

-- ============================================
-- SECTION 6: CREATE VENDORS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.vendors (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  contact TEXT,
  email TEXT,
  phone TEXT,
  budgeted_amount NUMERIC DEFAULT 0,
  paid_amount NUMERIC DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vendor_read" ON public.vendors FOR SELECT USING (true);
CREATE POLICY "vendor_insert" ON public.vendors FOR INSERT WITH CHECK (true);
CREATE POLICY "vendor_update" ON public.vendors FOR UPDATE USING (true);
CREATE POLICY "vendor_delete" ON public.vendors FOR DELETE USING (true);

-- ============================================
-- SECTION 7: CREATE TIMELINE_EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.timeline_events (
  id BIGSERIAL PRIMARY KEY,
  function_id BIGINT REFERENCES public.functions(id) ON DELETE CASCADE,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  event_name TEXT NOT NULL,
  venue TEXT,
  coordinator TEXT,
  catering_action TEXT,
  status TEXT DEFAULT 'Planned',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "timeline_read" ON public.timeline_events FOR SELECT USING (true);
CREATE POLICY "timeline_insert" ON public.timeline_events FOR INSERT WITH CHECK (true);
CREATE POLICY "timeline_update" ON public.timeline_events FOR UPDATE USING (true);
CREATE POLICY "timeline_delete" ON public.timeline_events FOR DELETE USING (true);

-- Pre-populate timeline events
INSERT INTO public.timeline_events (function_id, event_date, event_time, event_name, venue, coordinator, status)
VALUES
  (1, '2026-06-21'::DATE, '10:00'::TIME, 'Guest Arrival Setup', 'Leo Resorts', 'Kishan', 'Planned'),
  (1, '2026-06-21'::DATE, '12:00'::TIME, 'Welcome Lunch (F1)', 'Leo Resorts', 'Megha', 'Planned'),
  (1, '2026-06-21'::DATE, '14:00'::TIME, 'Lunch Cleanup', 'Leo Resorts', 'Palak', 'Planned'),
  (2, '2026-06-21'::DATE, '17:00'::TIME, 'Guest Assembly', 'Leo Resorts', 'Darsh', 'Planned'),
  (2, '2026-06-21'::DATE, '18:00'::TIME, 'Sangeet (F2)', 'Leo Resorts', 'Megha', 'Planned'),
  (2, '2026-06-21'::DATE, '20:00'::TIME, 'Sangeet Dinner', 'Leo Resorts', 'Kishan', 'Planned'),
  (3, '2026-06-22'::DATE, '08:00'::TIME, 'Pre-Wedding Preparations', 'Leo Resorts', 'Palak', 'Planned'),
  (3, '2026-06-22'::DATE, '09:00'::TIME, 'Wedding Ceremony (F3)', 'Leo Resorts', 'Megha', 'Planned'),
  (3, '2026-06-22'::DATE, '11:00'::TIME, 'Post-Ceremony Photos', 'Leo Resorts', 'Photographer', 'Planned'),
  (4, '2026-06-22'::DATE, '13:00'::TIME, 'Wedding Lunch (F4)', 'Leo Resorts', 'Kishan', 'Planned'),
  (4, '2026-06-22'::DATE, '15:00'::TIME, 'Lunch Cleanup & Checkout', 'Leo Resorts', 'Darsh', 'Planned')
ON CONFLICT DO NOTHING;

-- ============================================
-- SECTION 8: CREATE PHOTOS TABLE (for gallery)
-- ============================================
CREATE TABLE IF NOT EXISTS public.photos (
  id BIGSERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  uploaded_by TEXT,
  guest_tags JSONB DEFAULT '[]'::jsonb,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "photo_read" ON public.photos FOR SELECT USING (true);
CREATE POLICY "photo_insert" ON public.photos FOR INSERT WITH CHECK (true);
CREATE POLICY "photo_delete" ON public.photos FOR DELETE USING (true);

-- ============================================
-- SECTION 9: CREATE SOCIAL_HANDLES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.social_handles (
  id BIGSERIAL PRIMARY KEY,
  platform TEXT NOT NULL,
  handle TEXT,
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.social_handles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "social_read" ON public.social_handles FOR SELECT USING (true);
CREATE POLICY "social_insert" ON public.social_handles FOR INSERT WITH CHECK (true);
CREATE POLICY "social_update" ON public.social_handles FOR UPDATE USING (true);
CREATE POLICY "social_delete" ON public.social_handles FOR DELETE USING (true);

-- ============================================
-- SECTION 10: CREATE CATERING_ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.catering_items (
  id BIGSERIAL PRIMARY KEY,
  function_id BIGINT REFERENCES public.functions(id) ON DELETE CASCADE,
  meal_name TEXT NOT NULL,
  rate_per_plate NUMERIC,
  min_guarantee_pax INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.catering_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "catering_read" ON public.catering_items FOR SELECT USING (true);
CREATE POLICY "catering_insert" ON public.catering_items FOR INSERT WITH CHECK (true);
CREATE POLICY "catering_update" ON public.catering_items FOR UPDATE USING (true);
CREATE POLICY "catering_delete" ON public.catering_items FOR DELETE USING (true);

-- Pre-populate catering items
INSERT INTO public.catering_items (function_id, meal_name, rate_per_plate, min_guarantee_pax)
VALUES
  (1, 'Welcome Lunch', 683, 150),
  (2, 'Sangeet HiTea', 368, 200),
  (2, 'Sangeet Dinner', 893, 550),
  (4, 'Wedding Lunch', 893, 500)
ON CONFLICT DO NOTHING;

-- ============================================
-- SECTION 11: CREATE BUDGET_ADDITIONAL TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.budget_additional (
  id BIGSERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  description TEXT,
  amount NUMERIC,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.budget_additional ENABLE ROW LEVEL SECURITY;
CREATE POLICY "budget_read" ON public.budget_additional FOR SELECT USING (true);
CREATE POLICY "budget_insert" ON public.budget_additional FOR INSERT WITH CHECK (true);
CREATE POLICY "budget_update" ON public.budget_additional FOR UPDATE USING (true);
CREATE POLICY "budget_delete" ON public.budget_additional FOR DELETE USING (true);

-- ============================================
-- SECTION 12: CREATE PAYMENT_SCHEDULE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.payment_schedule (
  id BIGSERIAL PRIMARY KEY,
  installment_name TEXT NOT NULL,
  due_date DATE,
  amount NUMERIC,
  status TEXT DEFAULT 'Pending',
  paid_on DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.payment_schedule ENABLE ROW LEVEL SECURITY;
CREATE POLICY "payment_read" ON public.payment_schedule FOR SELECT USING (true);
CREATE POLICY "payment_insert" ON public.payment_schedule FOR INSERT WITH CHECK (true);
CREATE POLICY "payment_update" ON public.payment_schedule FOR UPDATE USING (true);
CREATE POLICY "payment_delete" ON public.payment_schedule FOR DELETE USING (true);

-- Pre-populate payment schedule
INSERT INTO public.payment_schedule (installment_name, due_date, amount, status, paid_on)
VALUES
  ('Token', '2026-01-15'::DATE, 100000, 'Paid', '2026-01-10'::DATE),
  ('Installment 1', '2026-02-28'::DATE, 525000, 'Paid', '2026-02-25'::DATE),
  ('Installment 2', '2026-04-30'::DATE, 500000, 'Pending', NULL),
  ('Installment 3', '2026-05-31'::DATE, 500000, 'Pending', NULL)
ON CONFLICT DO NOTHING;

-- ============================================
-- SECTION 13: RE-ADD FK CONSTRAINT (after hotels are seeded)
-- ============================================
ALTER TABLE public.guests ADD CONSTRAINT guests_hotel_id_fkey
  FOREIGN KEY (hotel_id) REFERENCES public.hotels(id) ON DELETE SET NULL;

-- ============================================
-- ALL DONE! Tables created with RLS policies.
-- ============================================
