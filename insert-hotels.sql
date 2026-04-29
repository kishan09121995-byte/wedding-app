-- Insert 4 hotels (without date columns)
INSERT INTO public.hotels (id, name, category, rate_per_room_night, contracted_rooms)
VALUES
  (1, 'LEO Resort', 'Luxury', 8000, 50),
  (2, 'LEO Medium', 'Premium', 5000, 30),
  (3, 'XYZ Hotel', 'Standard', 3000, 40),
  (4, 'Indralok', 'Budget', 2000, 20)
ON CONFLICT (id) DO NOTHING;
