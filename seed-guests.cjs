const https = require('https');

const SUPABASE_URL = 'https://mexeegqwlewmrsejdvlw.supabase.co';
const ANON_KEY = 'sb_publishable_DSfOh1b64Rv6fX_J703Xzw_INxl1eMx';

// Sample guest data - 294 guests
const generateGuests = () => {
  const guests = [];
  const firstNames = ['Kishan', 'Megha', 'Raj', 'Priya', 'Amit', 'Neha', 'Vikram', 'Anjali', 'Arjun', 'Divya', 'Rohit', 'Siya', 'Aman', 'Isha', 'Bhavesh', 'Riya'];
  const lastNames = ['Patel', 'Shah', 'Trivedi', 'Desai', 'Joshi', 'Mehta', 'Verma', 'Singh', 'Kumar', 'Gupta'];
  const cities = ['Ahmedabad', 'Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai', 'Kolkata', 'Junagadh'];
  const hotels = [1, 2, 3, 4];

  // Groom side - 161 guests
  for (let i = 0; i < 161; i++) {
    guests.push({
      name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]} G${i}`,
      city: cities[i % cities.length],
      side: 'Groom',
      pax_total: Math.floor(Math.random() * 4) + 1,
      jain_pax: Math.random() > 0.7 ? Math.floor(Math.random() * 2) + 1 : 0,
      rsvp_status: ['Confirmed', 'Not Decided', 'Declined'][Math.floor(Math.random() * 3)],
      f1: Math.random() > 0.2 ? 'Yes' : 'No',
      f2: Math.random() > 0.2 ? 'Yes' : 'No',
      f3: Math.random() > 0.1 ? 'Yes' : 'No',
      f4: Math.random() > 0.2 ? 'Yes' : 'No',
      room_needed: Math.random() > 0.6 ? true : false,
      hotel_id: hotels[Math.floor(Math.random() * hotels.length)],
      room_category: 'Standard',
      check_in: '2026-06-21',
      check_out: '2026-06-22',
      notes: '',
      qr_token: Math.random().toString(36).substring(2, 15)
    });
  }

  // Bride side - 133 guests
  for (let i = 0; i < 133; i++) {
    guests.push({
      name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]} B${i}`,
      city: cities[i % cities.length],
      side: 'Bride',
      pax_total: Math.floor(Math.random() * 4) + 1,
      jain_pax: Math.random() > 0.7 ? Math.floor(Math.random() * 2) + 1 : 0,
      rsvp_status: ['Confirmed', 'Not Decided', 'Declined'][Math.floor(Math.random() * 3)],
      f1: Math.random() > 0.2 ? 'Yes' : 'No',
      f2: Math.random() > 0.2 ? 'Yes' : 'No',
      f3: Math.random() > 0.1 ? 'Yes' : 'No',
      f4: Math.random() > 0.2 ? 'Yes' : 'No',
      room_needed: Math.random() > 0.6 ? true : false,
      hotel_id: hotels[Math.floor(Math.random() * hotels.length)],
      room_category: 'Standard',
      check_in: '2026-06-21',
      check_out: '2026-06-22',
      notes: '',
      qr_token: Math.random().toString(36).substring(2, 15)
    });
  }

  return guests;
};

async function seedGuests() {
  console.log('🚀 Generating 294 sample guests...');
  const guests = generateGuests();

  console.log('📤 Inserting into Supabase (in batches of 50)...');
  let inserted = 0;

  for (let i = 0; i < guests.length; i += 50) {
    const batch = guests.slice(i, i + 50);

    return new Promise((resolve) => {
      const payload = JSON.stringify(batch);

      const options = {
        hostname: 'mexeegqwlewmrsejdvlw.supabase.co',
        port: 443,
        path: '/rest/v1/guests',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
          'Authorization': `Bearer ${ANON_KEY}`,
          'apikey': ANON_KEY,
          'Prefer': 'return=representation'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            inserted += batch.length;
            console.log(`✅ Batch ${i / 50 + 1}: Inserted ${batch.length} guests (Total: ${inserted})`);

            // Continue with next batch
            if (i + 50 < guests.length) {
              setTimeout(() => seedGuests(), 500);
            } else {
              console.log(`\n✨ Successfully seeded ${inserted} guests!`);
              resolve();
            }
          } else {
            console.log(`❌ Batch failed: ${res.statusCode}`);
            console.log(data);
            resolve();
          }
        });
      });

      req.on('error', (e) => {
        console.error(`❌ Error: ${e.message}`);
        resolve();
      });

      req.write(payload);
      req.end();
    });
  }
}

seedGuests().catch(console.error);
