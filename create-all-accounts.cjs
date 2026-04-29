const https = require('https');

const SUPABASE_URL = 'https://mexeegqwlewmrsejdvlw.supabase.co';
const SERVICE_ROLE_KEY = 'sb_secret_OPHwb-KgX8p_Rxrec6eKCw_JIKscGjq';

const users = [
  { email: 'kishan@weddingapp.test', password: 'test123@', role: 'admin', username: 'kishan' },
  { email: 'megha@weddingapp.test', password: 'test123@', role: 'admin', username: 'megha' },
  { email: 'palak@weddingapp.test', password: 'test123@', role: 'editor', username: 'palak' },
  { email: 'payal@weddingapp.test', password: 'test123@', role: 'editor', username: 'payal' },
  { email: 'darsh@weddingapp.test', password: 'test123@', role: 'editor', username: 'darsh' },
  { email: 'sahil@weddingapp.test', password: 'test123@', role: 'editor', username: 'sahil' },
  { email: 'kruti@weddingapp.test', password: 'test123@', role: 'editor', username: 'kruti' },
  { email: 'dharmesh@weddingapp.test', password: 'test123@', role: 'editor', username: 'dharmesh' },
  { email: 'nilesh@weddingapp.test', password: 'test123@', role: 'editor', username: 'nilesh' },
  { email: 'alka@weddingapp.test', password: 'test123@', role: 'editor', username: 'alka' },
  { email: 'nalita@weddingapp.test', password: 'test123@', role: 'editor', username: 'nalita' },
  { email: 'photographer@weddingapp.test', password: 'test123@', role: 'vendor', username: 'photographer' },
  { email: 'decorator@weddingapp.test', password: 'test123@', role: 'vendor', username: 'decorator' },
  { email: 'caterer@weddingapp.test', password: 'test123@', role: 'vendor', username: 'caterer' },
  { email: 'eventmanager1@weddingapp.test', password: 'test123@', role: 'event_manager', username: 'eventmanager1' },
  { email: 'eventmanager2@weddingapp.test', password: 'test123@', role: 'event_manager', username: 'eventmanager2' },
];

async function createAccount(email, password, role, username) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role,
        username
      }
    });

    const options = {
      hostname: 'mexeegqwlewmrsejdvlw.supabase.co',
      port: 443,
      path: '/auth/v1/admin/users',
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
          console.log(`✅ ${email}`);
          resolve(true);
        } else {
          console.log(`❌ ${email}: ${res.statusCode}`);
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
    await createAccount(user.email, user.password, user.role, user.username);
    await new Promise(r => setTimeout(r, 800));
  }

  console.log('\n✨ Account creation complete!');
}

createAllAccounts().catch(console.error);
