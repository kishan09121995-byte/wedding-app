import { supabase } from './supabase'

const SQL_SCHEMA = `
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Guests / RSVP table (Master table - 294 rows)
create table if not exists guests (
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
  hotel_id text,
  room_category text check (room_category in ('Standard', 'Deluxe', 'Superior', 'Suite', 'Presidential')),
  check_in date,
  check_out date,
  room_number text,
  notes text,
  qr_token text unique,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Hotel settings
create table if not exists hotel_settings (
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
create table if not exists functions (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  event_date date not null,
  description text,
  created_at timestamp with time zone default now()
);

-- Catering items per function
create table if not exists catering_items (
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
create table if not exists budget_additional (
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
create table if not exists payment_schedule (
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
create table if not exists timeline_events (
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
create table if not exists photos (
  id uuid primary key default uuid_generate_v4(),
  url text not null,
  cloudinary_public_id text,
  uploaded_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- Photo guest tags
create table if not exists photo_guest_tags (
  id uuid primary key default uuid_generate_v4(),
  photo_id uuid not null references photos(id) on delete cascade,
  guest_id uuid not null references guests(id) on delete cascade,
  confidence numeric,
  created_at timestamp with time zone default now()
);

-- Vendors
create table if not exists vendors (
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
create table if not exists social_handles (
  id uuid primary key default uuid_generate_v4(),
  platform text not null check (platform in ('Instagram', 'WhatsApp', 'Facebook', 'Twitter')),
  handle text not null,
  url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Indexes for performance
create index if not exists idx_guests_rsvp_status on guests(rsvp_status);
create index if not exists idx_guests_side on guests(side);
create index if not exists idx_guests_hotel_id on guests(hotel_id);
create index if not exists idx_guests_qr_token on guests(qr_token);
create index if not exists idx_photos_created_at on photos(created_at desc);
create index if not exists idx_catering_function_id on catering_items(function_id);
create index if not exists idx_timeline_function_id on timeline_events(function_id);

-- Seed data: Hotels
insert into hotel_settings (name, category, breakfast_type, default_checkin, default_checkout, rate_per_room_night, contracted_rooms)
select 'LEO Resort', 'Premium/Fern', 'Yes-FREE', '2026-06-21'::date, '2026-06-22'::date, 6000, 40
where not exists (select 1 from hotel_settings where name = 'LEO Resort');

insert into hotel_settings (name, category, breakfast_type, default_checkin, default_checkout, rate_per_room_night, contracted_rooms)
select 'LEO Medium', 'Standard', 'Yes-FREE', '2026-06-21'::date, '2026-06-22'::date, 3500, 0
where not exists (select 1 from hotel_settings where name = 'LEO Medium');

insert into hotel_settings (name, category, breakfast_type, default_checkin, default_checkout, rate_per_room_night, contracted_rooms)
select 'XYZ Hotel', 'Budget', 'No', '2026-06-21'::date, '2026-06-22'::date, 2500, 0
where not exists (select 1 from hotel_settings where name = 'XYZ Hotel');

insert into hotel_settings (name, category, breakfast_type, default_checkin, default_checkout, rate_per_room_night, contracted_rooms)
select 'Indralok', 'Standard', 'No', '2026-06-21'::date, '2026-06-22'::date, 3000, 0
where not exists (select 1 from hotel_settings where name = 'Indralok');

-- Seed data: Functions (F1-F4)
insert into functions (name, event_date, description)
select 'F1 - Mandap Ceremony', '2026-06-21'::date, 'Mandap ceremony with parallel venues, followed by lunch'
where not exists (select 1 from functions where name = 'F1 - Mandap Ceremony');

insert into functions (name, event_date, description)
select 'F2 - Haldi / Carnival', '2026-06-21'::date, 'Haldi/Carnival at AMARA Lawn with high tea'
where not exists (select 1 from functions where name = 'F2 - Haldi / Carnival');

insert into functions (name, event_date, description)
select 'F3 - Sangeet / Pre-Wedding Reception', '2026-06-21'::date, 'Sangeet evening with dinner and late night snacks'
where not exists (select 1 from functions where name = 'F3 - Sangeet / Pre-Wedding Reception');

insert into functions (name, event_date, description)
select 'F4 - Wedding Day', '2026-06-22'::date, 'Main wedding ceremony with breakfast, baraat, and wedding lunch'
where not exists (select 1 from functions where name = 'F4 - Wedding Day');

-- Seed data: Payment schedule
insert into payment_schedule (installment_name, due_date, amount, status, paid_on)
select 'Token Advance', '2026-02-28'::date, 100000, 'Paid', '2026-02-28'::date
where not exists (select 1 from payment_schedule where installment_name = 'Token Advance');

insert into payment_schedule (installment_name, due_date, amount, status, paid_on)
select 'Installment 1', '2026-03-19'::date, 525000, 'Paid', '2026-03-19'::date
where not exists (select 1 from payment_schedule where installment_name = 'Installment 1');

insert into payment_schedule (installment_name, due_date, amount, status, paid_on)
select 'Installment 2', '2026-04-19'::date, 500000, 'Pending', null
where not exists (select 1 from payment_schedule where installment_name = 'Installment 2');

insert into payment_schedule (installment_name, due_date, amount, status, paid_on)
select 'Installment 3', '2026-05-19'::date, 500000, 'Pending', null
where not exists (select 1 from payment_schedule where installment_name = 'Installment 3');
`

export async function checkAndSetupDatabase(): Promise<{
  ready: boolean
  message: string
  needsSetup: boolean
}> {
  try {
    // Check if guests table exists by trying to query it
    const { count, error } = await supabase
      .from('guests')
      .select('*', { count: 'exact', head: true })

    if (error && error.code === 'PGRST116') {
      // Table doesn't exist
      return {
        ready: false,
        message: 'Database tables need to be created. Please run SQL migrations.',
        needsSetup: true,
      }
    }

    if (error) {
      console.error('Database check error:', error)
      return {
        ready: false,
        message: 'Error checking database',
        needsSetup: true,
      }
    }

    // Check if we have data
    if (count === 0) {
      return {
        ready: true,
        message: 'Tables exist but no guests. Ready to populate.',
        needsSetup: true,
      }
    }

    return {
      ready: true,
      message: `Database ready with ${count} guests`,
      needsSetup: false,
    }
  } catch (error) {
    console.error('Database setup check failed:', error)
    return {
      ready: false,
      message: 'Unable to check database',
      needsSetup: true,
    }
  }
}

export function getSQLSchema(): string {
  return SQL_SCHEMA
}
