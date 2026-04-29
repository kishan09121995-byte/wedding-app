-- Create guests table
CREATE TABLE IF NOT EXISTS public.guests (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT,
  side TEXT,
  pax_total INTEGER DEFAULT 1,
  jain_pax INTEGER DEFAULT 0,
  rsvp_status TEXT DEFAULT 'Not Decided',
  f1 TEXT DEFAULT 'No',
  f2 TEXT DEFAULT 'No',
  f3 TEXT DEFAULT 'No',
  f4 TEXT DEFAULT 'No',
  room_needed BOOLEAN DEFAULT FALSE,
  hotel_id INTEGER,
  room_category TEXT,
  check_in DATE,
  check_out DATE,
  notes TEXT,
  qr_token TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create hotels table
CREATE TABLE IF NOT EXISTS public.hotels (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  rate_per_room_night NUMERIC,
  contracted_rooms INTEGER,
  default_checkin DATE,
  default_checkout DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create functions table
CREATE TABLE IF NOT EXISTS public.functions (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  date DATE,
  time TIME,
  venue TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default functions if empty
INSERT INTO public.functions (id, name, date, time, venue, description)
VALUES
  (1, 'Welcome Lunch (F1)', '2026-06-21'::DATE, '12:00'::TIME, 'Leo Resorts', 'Welcome lunch for all guests'),
  (2, 'Sangeet (F2)', '2026-06-21'::DATE, '18:00'::TIME, 'Leo Resorts', 'Sangeet ceremony and dinner'),
  (3, 'Wedding (F3)', '2026-06-22'::DATE, '09:00'::TIME, 'Leo Resorts', 'Main wedding ceremony'),
  (4, 'Wedding Lunch (F4)', '2026-06-22'::DATE, '13:00'::TIME, 'Leo Resorts', 'Wedding lunch reception')
ON CONFLICT (id) DO NOTHING;

-- Create catering_items table
CREATE TABLE IF NOT EXISTS public.catering_items (
  id BIGSERIAL PRIMARY KEY,
  meal_name TEXT NOT NULL,
  function_id BIGINT REFERENCES public.functions(id),
  rate_per_plate NUMERIC,
  min_guarantee_pax INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create menus table (for menu management by function and category)
CREATE TABLE IF NOT EXISTS public.menus (
  id BIGSERIAL PRIMARY KEY,
  function_id BIGINT REFERENCES public.functions(id) NOT NULL,
  category TEXT NOT NULL,
  items JSONB DEFAULT '[]'::jsonb,
  quantity INTEGER DEFAULT 1,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create payment_schedule table
CREATE TABLE IF NOT EXISTS public.payment_schedule (
  id BIGSERIAL PRIMARY KEY,
  installment_name TEXT NOT NULL,
  due_date DATE,
  amount NUMERIC,
  status TEXT DEFAULT 'PENDING',
  paid_on DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create timeline_events table
CREATE TABLE IF NOT EXISTS public.timeline_events (
  id BIGSERIAL PRIMARY KEY,
  date DATE NOT NULL,
  time TIME NOT NULL,
  event TEXT NOT NULL,
  venue TEXT,
  coordinator TEXT,
  catering_action TEXT,
  status TEXT DEFAULT 'Planned',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create photos table
CREATE TABLE IF NOT EXISTS public.photos (
  id BIGSERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  guest_tags TEXT[],
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create vendors table
CREATE TABLE IF NOT EXISTS public.vendors (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  contact TEXT,
  budgeted NUMERIC,
  paid NUMERIC,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create social_handles table
CREATE TABLE IF NOT EXISTS public.social_handles (
  id BIGSERIAL PRIMARY KEY,
  platform TEXT,
  handle TEXT,
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create budget_additional table
CREATE TABLE IF NOT EXISTS public.budget_additional (
  id BIGSERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  amount NUMERIC,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create hotel_settings table
CREATE TABLE IF NOT EXISTS public.hotel_settings (
  id BIGSERIAL PRIMARY KEY,
  hotel_id BIGINT REFERENCES public.hotels(id),
  name TEXT,
  category TEXT,
  rate_per_room_night NUMERIC,
  contracted_rooms INTEGER,
  default_checkin DATE,
  default_checkout DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.functions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catering_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_handles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_additional ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all for now - in production, restrict this)
CREATE POLICY "Enable read access for all users" ON public.guests FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.guests FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.guests FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.guests FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.hotels FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.hotels FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.hotels FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.hotels FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.functions FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.functions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.functions FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.functions FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.catering_items FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.catering_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.catering_items FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.catering_items FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.payment_schedule FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.payment_schedule FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.payment_schedule FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.payment_schedule FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.timeline_events FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.timeline_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.timeline_events FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.timeline_events FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.photos FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.photos FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.photos FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.photos FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.vendors FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.vendors FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.vendors FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.vendors FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.social_handles FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.social_handles FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.social_handles FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.social_handles FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.budget_additional FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.budget_additional FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.budget_additional FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.budget_additional FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.hotel_settings FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.hotel_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.hotel_settings FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.hotel_settings FOR DELETE USING (true);

-- Menus table policies (functions policies already exist above)
CREATE POLICY "Enable read access for all users" ON public.menus FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.menus FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.menus FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.menus FOR DELETE USING (true);
