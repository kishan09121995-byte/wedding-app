-- Temporarily remove foreign key constraint
ALTER TABLE public.guests DROP CONSTRAINT IF EXISTS guests_hotel_id_fkey;

-- Make hotel_id nullable
ALTER TABLE public.guests ALTER COLUMN hotel_id DROP NOT NULL;
