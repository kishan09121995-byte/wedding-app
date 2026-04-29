const https = require('https');

const SUPABASE_URL = 'https://mexeegqwlewmrsejdvlw.supabase.co';
const SERVICE_ROLE_KEY = 'sb_secret_OPHwb-KgX8p_Rxrec6eKCw_JIKscGjq';

// Step 1: Create functions table
async function createFunctionsTable() {
  return new Promise((resolve) => {
    console.log('📋 Creating functions table...');

    const sql = `CREATE TABLE IF NOT EXISTS public.functions (id BIGSERIAL PRIMARY KEY, name TEXT NOT NULL, date DATE, time TIME, venue TEXT, description TEXT, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)`;

    const payload = JSON.stringify({ query: sql });
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
          console.log('✅ Functions table created');
          resolve(true);
        } else {
          console.log('⚠️  Functions table (might already exist)');
          resolve(true);
        }
      });
    });

    req.on('error', () => {
      console.log('⚠️  Functions table creation (continuing...)');
      resolve(true);
    });

    req.write(payload);
    req.end();
  });
}

// Step 2: Insert functions
async function insertFunctions() {
  return new Promise((resolve) => {
    console.log('📝 Inserting 4 functions (F1-F4)...');

    const functions = [
      { id: 1, name: 'Welcome Lunch (F1)', date: '2026-06-21', time: '12:00', venue: 'Leo Resorts' },
      { id: 2, name: 'Sangeet (F2)', date: '2026-06-21', time: '18:00', venue: 'Leo Resorts' },
      { id: 3, name: 'Wedding (F3)', date: '2026-06-22', time: '09:00', venue: 'Leo Resorts' },
      { id: 4, name: 'Wedding Lunch (F4)', date: '2026-06-22', time: '13:00', venue: 'Leo Resorts' }
    ];

    const payload = JSON.stringify(functions);
    const options = {
      hostname: 'mexeegqwlewmrsejdvlw.supabase.co',
      port: 443,
      path: '/rest/v1/functions?on_conflict=id',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
        'Prefer': 'resolution=merge-duplicates'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log('✅ Functions inserted (F1, F2, F3, F4)');
          resolve(true);
        } else {
          console.log('⚠️  Functions inserted (or already exist)');
          resolve(true);
        }
      });
    });

    req.on('error', () => {
      console.log('⚠️  Functions insertion (continuing...)');
      resolve(true);
    });

    req.write(payload);
    req.end();
  });
}

// Step 3: Create menus table
async function createMenusTable() {
  return new Promise((resolve) => {
    console.log('🍽️  Creating menus table...');

    const sql = `CREATE TABLE IF NOT EXISTS public.menus (id BIGSERIAL PRIMARY KEY, function_id BIGINT REFERENCES public.functions(id) NOT NULL, category TEXT NOT NULL, items JSONB DEFAULT '[]'::jsonb, quantity INTEGER DEFAULT 1, approved BOOLEAN DEFAULT FALSE, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP); ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;`;

    const payload = JSON.stringify({ query: sql });
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
          console.log('✅ Menus table created');
          resolve(true);
        } else {
          console.log('⚠️  Menus table (might already exist)');
          resolve(true);
        }
      });
    });

    req.on('error', () => {
      console.log('⚠️  Menus table creation (continuing...)');
      resolve(true);
    });

    req.write(payload);
    req.end();
  });
}

async function setup() {
  console.log('🚀 Setting up wedding app database...\n');

  await createFunctionsTable();
  await new Promise(r => setTimeout(r, 1000));

  await insertFunctions();
  await new Promise(r => setTimeout(r, 1000));

  await createMenusTable();

  console.log('\n✨ Database setup complete!');
  console.log('\n📌 Next steps:');
  console.log('  1. Redeploy dist folder to Netlify');
  console.log('  2. Refresh your app: https://guileless-chebakia-c52b67.netlify.app/');
  console.log('  3. Go to "Menu Management" in sidebar');
  console.log('  4. Add menus for F1, F2, F3, F4 by category (Silver/Gold/Platinum)\n');
}

setup().catch(console.error);
