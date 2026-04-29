const https = require('https');

const SERVICE_ROLE_KEY = 'sb_secret_OPHwb-KgX8p_Rxrec6eKCw_JIKscGjq';
const SUPABASE_URL = 'https://mexeegqwlewmrsejdvlw.supabase.co';

const sql = `
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

ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "menu_read" ON public.menus;
DROP POLICY IF EXISTS "menu_insert" ON public.menus;
DROP POLICY IF EXISTS "menu_update" ON public.menus;
DROP POLICY IF EXISTS "menu_delete" ON public.menus;

CREATE POLICY "menu_read" ON public.menus FOR SELECT USING (true);
CREATE POLICY "menu_insert" ON public.menus FOR INSERT WITH CHECK (true);
CREATE POLICY "menu_update" ON public.menus FOR UPDATE USING (true);
CREATE POLICY "menu_delete" ON public.menus FOR DELETE USING (true);
`;

function executeSQL() {
  const payload = JSON.stringify({ query: sql });

  const options = {
    hostname: 'mexeegqwlewmrsejdvlw.supabase.co',
    port: 443,
    path: '/rest/v1/rpc/sql_query',
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
        console.log('✅ Menus table created successfully!');
        console.log('📊 You can now:');
        console.log('  1. Redeploy dist folder to Netlify');
        console.log('  2. Go to Menu Management in the app');
        console.log('  3. Add menus for F1, F2, F3, F4');
      } else {
        console.log(`❌ Error: ${res.statusCode}`);
        try {
          console.log(JSON.parse(data));
        } catch {
          console.log(data);
        }
      }
    });
  });

  req.on('error', (e) => {
    console.error(`❌ Request error: ${e.message}`);
  });

  req.write(payload);
  req.end();
}

console.log('🚀 Creating menus table in Supabase...');
executeSQL();
