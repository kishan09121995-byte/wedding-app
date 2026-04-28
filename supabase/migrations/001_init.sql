-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Guests / RSVP table (Master table - 294 rows)
create table guests (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  city text,
  pax_total integer not null,
  side text not null check (side in ('Bride', 'Groom')),
  rsvp_status text not null default 'Not Decided' check (rsvp_status in ('Confirmed', 'Not Decided', 'Declined')),
  jain_pax integer not null default 0 check (jain_pax >= 0),
  f1 text default 'Yes' check (f1 in ('Yes', 'No', 'TBD')),
  f2 text default 'Yes' check (f2 in ('Yes', 'No', 'TBD')),
  f3 text default 'Yes' check (f3 in ('Yes', 'No', 'TBD')),
  f4 text default 'Yes' check (f4 in ('Yes', 'No', 'TBD')),
  room_needed text default 'No' check (room_needed in ('Yes', 'No')),
  hotel_id uuid,
  room_category text check (room_category in ('Standard', 'Deluxe', 'Superior', 'Suite', 'Presidential')),
  check_in date,
  check_out date,
  room_number text,
  notes text,
  qr_token text unique,
  source text check (source in ('bride', 'groom')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Hotel settings
create table hotel_settings (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  category text,
  breakfast_type text check (breakfast_type in ('Yes-FREE', 'No', 'Charged Extra')),
  default_checkin date not null,
  default_checkout date not null,
  rate_per_room_night numeric not null,
  contracted_rooms integer not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Functions (F1, F2, F3, F4)
create table functions (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  event_date date not null,
  description text,
  created_at timestamp with time zone default now()
);

-- Catering items per function
create table catering_items (
  id uuid primary key default uuid_generate_v4(),
  function_id uuid not null references functions(id) on delete cascade,
  meal_name text not null,
  rate_per_plate numeric not null,
  min_guarantee_pax integer not null,
  is_manual boolean default false,
  manual_pax integer default 0,
  venue text,
  created_at timestamp with time zone default now()
);

-- Budget - Additional expenses
create table budget_additional (
  id uuid primary key default uuid_generate_v4(),
  expense_name text not null,
  vendor text,
  description text,
  budgeted_amount numeric not null,
  actual_paid numeric,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Payment schedule
create table payment_schedule (
  id uuid primary key default uuid_generate_v4(),
  installment_name text not null,
  due_date date not null,
  amount numeric not null,
  status text not null default 'Pending' check (status in ('Paid', 'Pending', 'TBD')),
  paid_on date,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Timeline events
create table timeline_events (
  id uuid primary key default uuid_generate_v4(),
  function_id uuid references functions(id) on delete cascade,
  event_time time not null,
  event_name text not null,
  venue text,
  coordinator text,
  catering_action text,
  status text not null default 'Planned' check (status in ('Done', 'In Progress', 'Planned', 'Cancelled')),
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Photos
create table photos (
  id uuid primary key default uuid_generate_v4(),
  url text not null,
  cloudinary_public_id text,
  uploaded_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- Photo guest tags
create table photo_guest_tags (
  id uuid primary key default uuid_generate_v4(),
  photo_id uuid not null references photos(id) on delete cascade,
  guest_id uuid not null references guests(id) on delete cascade,
  confidence numeric,
  created_at timestamp with time zone default now()
);

-- Vendors
create table vendors (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null check (category in ('Photographer', 'Decorator', 'DJ', 'Caterer', 'Florist', 'Other')),
  contact text,
  email text,
  phone text,
  budgeted_amount numeric,
  actual_paid numeric,
  payment_status text default 'Pending' check (payment_status in ('Paid', 'Pending', 'TBD')),
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Social media handles
create table social_handles (
  id uuid primary key default uuid_generate_v4(),
  platform text not null check (platform in ('Instagram', 'WhatsApp', 'Facebook', 'Twitter')),
  handle text not null,
  url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Foreign key for guests.hotel_id
alter table guests add constraint fk_guests_hotel
  foreign key (hotel_id) references hotel_settings(id) on delete set null;

-- Indexes for performance
create index idx_guests_rsvp_status on guests(rsvp_status);
create index idx_guests_side on guests(side);
create index idx_guests_hotel_id on guests(hotel_id);
create index idx_guests_qr_token on guests(qr_token);
create index idx_photos_created_at on photos(created_at desc);
create index idx_catering_function_id on catering_items(function_id);
create index idx_timeline_function_id on timeline_events(function_id);

-- Seed data: Hotels
insert into hotel_settings (name, category, breakfast_type, default_checkin, default_checkout, rate_per_room_night, contracted_rooms) values
  ('LEO Resort', 'Premium/Fern', 'Yes-FREE', '2026-06-21', '2026-06-22', 6000, 40),
  ('LEO Medium', 'Standard', 'Yes-FREE', '2026-06-21', '2026-06-22', 3500, 0),
  ('XYZ Hotel', 'Budget', 'No', '2026-06-21', '2026-06-22', 2500, 0),
  ('Indralok', 'Standard', 'No', '2026-06-21', '2026-06-22', 3000, 0);

-- Seed data: Functions (F1-F4)
insert into functions (name, event_date, description) values
  ('F1 - Mandap Ceremony', '2026-06-21', 'Mandap ceremony with parallel venues, followed by lunch'),
  ('F2 - Haldi / Carnival', '2026-06-21', 'Haldi/Carnival at AMARA Lawn with high tea'),
  ('F3 - Sangeet / Pre-Wedding Reception', '2026-06-21', 'Sangeet evening with dinner and late night snacks'),
  ('F4 - Wedding Day', '2026-06-22', 'Main wedding ceremony with breakfast, baraat, and wedding lunch');

-- Seed data: Catering items (from hotel quotation)
insert into catering_items (function_id, meal_name, rate_per_plate, min_guarantee_pax, venue)
select id, 'Mandap Refreshments', 0, 0, 'Zira & Library' from functions where name = 'F1 - Mandap Ceremony'
union all
select (select id from functions where name = 'F1 - Mandap Ceremony'), 'Lunch', 683, 150, 'Kiara-3 Ballroom'
union all
select (select id from functions where name = 'F2 - Haldi / Carnival'), 'High Tea', 368, 200, 'AMARA Lawn'
union all
select (select id from functions where name = 'F3 - Sangeet / Pre-Wedding Reception'), 'Dinner', 893, 550, 'Kiara Ballroom'
union all
select (select id from functions where name = 'F3 - Sangeet / Pre-Wedding Reception'), 'Late Night Snacks', 400, 0, 'Kiara Ballroom'
union all
select (select id from functions where name = 'F4 - Wedding Day'), 'Breakfast - In-House Free', 0, 0, 'Kesar'
union all
select (select id from functions where name = 'F4 - Wedding Day'), 'Breakfast - Additional', 400, 0, 'Kesar'
union all
select (select id from functions where name = 'F4 - Wedding Day'), 'Wedding Lunch', 893, 500, 'Kiara Ballroom';

-- Seed data: Payment schedule
insert into payment_schedule (installment_name, due_date, amount, status, paid_on) values
  ('Token Advance', '2026-02-28', 100000, 'Paid', '2026-02-28'),
  ('Installment 1', '2026-03-19', 525000, 'Paid', '2026-03-19'),
  ('Installment 2', '2026-04-19', 500000, 'Pending', null),
  ('Installment 3', '2026-05-19', 500000, 'Pending', null);

-- Seed data: Timeline events (sample for F1)
-- Note: Will be expanded when building timeline module
