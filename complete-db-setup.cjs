const https = require('https');

const SUPABASE_URL = 'https://mexeegqwlewmrsejdvlw.supabase.co';
const SERVICE_ROLE_KEY = 'sb_secret_OPHwb-KgX8p_Rxrec6eKCw_JIKscGjq';

const tables = [
  // Guests table
  {
    name: 'guests',
    sql: `CREATE TABLE IF NOT EXISTS public.guests (
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
    ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "guest_read" ON public.guests FOR SELECT USING (true);
    CREATE POLICY "guest_insert" ON public.guests FOR INSERT WITH CHECK (true);
    CREATE POLICY "guest_update" ON public.guests FOR UPDATE USING (true);
    CREATE POLICY "guest_delete" ON public.guests FOR DELETE USING (true);`
  },
  // Hotels table
  {
    name: 'hotels',
    sql: `CREATE TABLE IF NOT EXISTS public.hotels (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT,
      rate_per_room_night NUMERIC,
      contracted_rooms INTEGER,
      default_checkin DATE,
      default_checkout DATE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );`
  },
  // Functions table
  {
    name: 'functions',
    sql: `CREATE TABLE IF NOT EXISTS public.functions (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      date DATE,
      time TIME,
      venue TEXT,
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    INSERT INTO public.functions (id, name, date, time, venue, description) VALUES
      (1, 'Welcome Lunch (F1)', '2026-06-21'::DATE, '12:00'::TIME, 'Leo Resorts', 'Welcome lunch'),
      (2, 'Sangeet (F2)', '2026-06-21'::DATE, '18:00'::TIME, 'Leo Resorts', 'Sangeet ceremony'),
      (3, 'Wedding (F3)', '2026-06-22'::DATE, '09:00'::TIME, 'Leo Resorts', 'Wedding ceremony'),
      (4, 'Wedding Lunch (F4)', '2026-06-22'::DATE, '13:00'::TIME, 'Leo Resorts', 'Wedding lunch')
    ON CONFLICT (id) DO NOTHING;`
  },
  // Menus table
  {
    name: 'menus',
    sql: `CREATE TABLE IF NOT EXISTS public.menus (
      id BIGSERIAL PRIMARY KEY,
      function_id BIGINT REFERENCES public.functions(id),
      category TEXT,
      items JSONB DEFAULT '[]'::jsonb,
      quantity INTEGER DEFAULT 1,
      approved BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "menu_read" ON public.menus FOR SELECT USING (true);
    CREATE POLICY "menu_insert" ON public.menus FOR INSERT WITH CHECK (true);
    CREATE POLICY "menu_update" ON public.menus FOR UPDATE USING (true);
    CREATE POLICY "menu_delete" ON public.menus FOR DELETE USING (true);`
  },
  // Assignments table (NEW - for responsibilities)
  {
    name: 'assignments',
    sql: `CREATE TABLE IF NOT EXISTS public.assignments (
      id BIGSERIAL PRIMARY KEY,
      guest_id BIGINT REFERENCES public.guests(id),
      responsibility TEXT,
      assigned_to TEXT,
      status TEXT DEFAULT 'Pending',
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "assign_read" ON public.assignments FOR SELECT USING (true);
    CREATE POLICY "assign_insert" ON public.assignments FOR INSERT WITH CHECK (true);
    CREATE POLICY "assign_update" ON public.assignments FOR UPDATE USING (true);
    CREATE POLICY "assign_delete" ON public.assignments FOR DELETE USING (true);`
  },
  // Guest Arrivals table (NEW)
  {
    name: 'guest_arrivals',
    sql: `CREATE TABLE IF NOT EXISTS public.guest_arrivals (
      id BIGSERIAL PRIMARY KEY,
      guest_id BIGINT REFERENCES public.guests(id),
      arrival_date DATE,
      arrival_time TIME,
      transport_type TEXT,
      driver_assigned TEXT,
      vehicle_number TEXT,
      status TEXT DEFAULT 'Pending',
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    ALTER TABLE public.guest_arrivals ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "arrival_read" ON public.guest_arrivals FOR SELECT USING (true);
    CREATE POLICY "arrival_insert" ON public.guest_arrivals FOR INSERT WITH CHECK (true);
    CREATE POLICY "arrival_update" ON public.guest_arrivals FOR UPDATE USING (true);
    CREATE POLICY "arrival_delete" ON public.guest_arrivals FOR DELETE USING (true);`
  },
  // Décor & Photography table (NEW)
  {
    name: 'event_details',
    sql: `CREATE TABLE IF NOT EXISTS public.event_details (
      id BIGSERIAL PRIMARY KEY,
      function_id BIGINT REFERENCES public.functions(id),
      detail_type TEXT,
      description TEXT,
      assigned_to TEXT,
      status TEXT DEFAULT 'Pending',
      photo_url TEXT,
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    ALTER TABLE public.event_details ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "detail_read" ON public.event_details FOR SELECT USING (true);
    CREATE POLICY "detail_insert" ON public.event_details FOR INSERT WITH CHECK (true);
    CREATE POLICY "detail_update" ON public.event_details FOR UPDATE USING (true);
    CREATE POLICY "detail_delete" ON public.event_details FOR DELETE USING (true);`
  }
];

async function createTables() {
  console.log('🚀 Creating database tables...\n');

  for (const table of tables) {
    await new Promise((resolve) => {
      console.log(`📋 Creating ${table.name}...`);

      const payload = JSON.stringify({ query: table.sql });
      const options = {
        hostname: 'mexeegqwlewmrsejdvlw.supabase.co',
        port: 443,
        path: '/rest/v1/rpc/exec_sql',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'apikey': SERVICE_ROLE_KEY,
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log(`✅ ${table.name} ready`);
          } else {
            console.log(`⚠️  ${table.name} (may already exist)`);
          }
          resolve();
        });
      });

      req.on('error', () => {
        console.log(`⚠️  ${table.name}`);
        resolve();
      });

      req.write(payload);
      req.end();
    });

    await new Promise(r => setTimeout(r, 500));
  }

  console.log('\n✨ All tables created!\n');
}

createTables().catch(console.error);
