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

-- Enable RLS
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hotel_read" ON public.hotels FOR SELECT USING (true);
CREATE POLICY "hotel_insert" ON public.hotels FOR INSERT WITH CHECK (true);
CREATE POLICY "hotel_update" ON public.hotels FOR UPDATE USING (true);
CREATE POLICY "hotel_delete" ON public.hotels FOR DELETE USING (true);

-- Insert 4 hotels
INSERT INTO public.hotels (id, name, category, rate_per_room_night, contracted_rooms, default_checkin, default_checkout)
VALUES
  (1, 'LEO Resort', 'Luxury', 8000, 50, '2026-06-21'::DATE, '2026-06-22'::DATE),
  (2, 'LEO Medium', 'Premium', 5000, 30, '2026-06-21'::DATE, '2026-06-22'::DATE),
  (3, 'XYZ Hotel', 'Standard', 3000, 40, '2026-06-21'::DATE, '2026-06-22'::DATE),
  (4, 'Indralok', 'Budget', 2000, 20, '2026-06-21'::DATE, '2026-06-22'::DATE)
ON CONFLICT (id) DO NOTHING;
