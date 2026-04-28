const https = require('https');

const SUPABASE_URL = 'https://mexeegqwlewmrsejdvlw.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1leGVlZ3F3bGV3bXJzZWpkdmx3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxMzk3MzUwMywiZXhwIjoxNzI5NTI1NTAzfQ.dkqKZvvvEFR0q-RUZB-EK9Y0oKMKZ-6HNTw0j1FjBfQ';

const users = [
  { email: 'kishan@weddingapp.test', password: 'test123@', role: 'admin' },
  { email: 'megha@weddingapp.test', password: 'test123@', role: 'admin' },
  { email: 'palak@weddingapp.test', password: 'test123@', role: 'editor' },
  { email: 'payal@weddingapp.test', password: 'test123@', role: 'editor' },
  { email: 'darsh@weddingapp.test', password: 'test123@', role: 'editor' },
  { email: 'sahil@weddingapp.test', password: 'test123@', role: 'editor' },
  { email: 'kruti@weddingapp.test', password: 'test123@', role: 'editor' },
  { email: 'dharmesh@weddingapp.test', password: 'test123@', role: 'editor' },
  { email: 'nilesh@weddingapp.test', password: 'test123@', role: 'editor' },
  { email: 'alka@weddingapp.test', password: 'test123@', role: 'editor' },
  { email: 'nalita@weddingapp.test', password: 'test123@', role: 'editor' },
  { email: 'photographer@weddingapp.test', password: 'test123@', role: 'vendor' },
  { email: 'decorator@weddingapp.test', password: 'test123@', role: 'vendor' },
  { email: 'caterer@weddingapp.test', password: 'test123@', role: 'vendor' },
  { email: 'eventmanager1@weddingapp.test', password: 'test123@', role: 'event_manager' },
  { email: 'eventmanager2@weddingapp.test', password: 'test123@', role: 'event_manager' },
];

async function createAccount(email, password, role) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: { role, username: email.split('@')[0] }
    });

    const options = {
      hostname: 'mexeegqwlewmrsejdvlw.supabase.co',
      port: 443,
      path: '/auth/v1/admin/users',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`✅ Created: ${email}`);
          resolve(true);
        } else {
          console.log(`❌ ${email}: ${res.statusCode} - ${data}`);
          resolve(false);
        }
      });
    });

    req.on('error', (e) => {
      console.error(`❌ ${email}: ${e.message}`);
      resolve(false);
    });

    req.write(payload);
    req.end();
  });
}

async function createAllAccounts() {
  console.log('🚀 Creating 16 wedding app accounts...\n');
  let created = 0;

  for (const user of users) {
    await createAccount(user.email, user.password, user.role);
    await new Promise(r => setTimeout(r, 500)); // 500ms delay between requests
  }

  console.log('\n✨ Account creation complete!');
}

createAllAccounts().catch(console.error);
