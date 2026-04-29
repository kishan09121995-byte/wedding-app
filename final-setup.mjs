import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mexeegqwlewmrsejdvlw.supabase.co';
const SERVICE_ROLE_KEY = 'sb_secret_OPHwb-KgX8p_Rxrec6eKCw_JIKscGjq';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function generateGuests() {
  const names = ['Rajesh', 'Priya', 'Amit', 'Neha', 'Vikram', 'Anjali', 'Sanjay', 'Pooja', 'Deepak', 'Shreya'];
  const lastNames = ['Batavia', 'Shah', 'Patel', 'Singh', 'Verma', 'Joshi', 'Desai', 'Nair', 'Iyer', 'Gupta'];
  const cities = ['Ahmedabad', 'Mumbai', 'Delhi', 'Bangalore', 'Pune'];

  const guests = [];

  // Generate 161 groom side guests
  for (let i = 0; i < 161; i++) {
    guests.push({
      name: `${names[i % names.length]} ${lastNames[i % lastNames.length]} G${i}`,
      city: cities[i % cities.length],
      side: 'Groom',
      pax_total: Math.floor(Math.random() * 4) + 1,
      jain_pax: Math.random() > 0.7 ? 1 : 0,
      rsvp_status: ['Confirmed', 'Not Decided', 'Declined'][Math.floor(Math.random() * 3)],
      f1: Math.random() > 0.2 ? 'Yes' : 'No',
      f2: Math.random() > 0.2 ? 'Yes' : 'No',
      f3: Math.random() > 0.1 ? 'Yes' : 'No',
      f4: Math.random() > 0.2 ? 'Yes' : 'No',
      room_needed: Math.random() > 0.6,
      hotel_id: Math.floor(Math.random() * 4) + 1,
      room_category: 'Standard',
      check_in: '2026-06-21',
      check_out: '2026-06-22',
      qr_token: Math.random().toString(36).substring(2, 15)
    });
  }

  // Generate 133 bride side guests
  for (let i = 0; i < 133; i++) {
    guests.push({
      name: `${names[i % names.length]} ${lastNames[i % lastNames.length]} B${i}`,
      city: cities[i % cities.length],
      side: 'Bride',
      pax_total: Math.floor(Math.random() * 4) + 1,
      jain_pax: Math.random() > 0.7 ? 1 : 0,
      rsvp_status: ['Confirmed', 'Not Decided', 'Declined'][Math.floor(Math.random() * 3)],
      f1: Math.random() > 0.2 ? 'Yes' : 'No',
      f2: Math.random() > 0.2 ? 'Yes' : 'No',
      f3: Math.random() > 0.1 ? 'Yes' : 'No',
      f4: Math.random() > 0.2 ? 'Yes' : 'No',
      room_needed: Math.random() > 0.6,
      hotel_id: Math.floor(Math.random() * 4) + 1,
      room_category: 'Standard',
      check_in: '2026-06-21',
      check_out: '2026-06-22',
      qr_token: Math.random().toString(36).substring(2, 15)
    });
  }

  return guests;
}

async function setup() {
  console.log('🚀 Final setup with guest seeding...\n');

  try {
    console.log('📝 Generating 294 guests...');
    const guests = await generateGuests();

    console.log('📤 Seeding guests in batches...');
    for (let i = 0; i < guests.length; i += 50) {
      const batch = guests.slice(i, i + 50);

      const { data, error } = await supabase
        .from('guests')
        .insert(batch)
        .select();

      if (error) {
        console.log(`⚠️  Batch ${Math.floor(i / 50) + 1}: ${error.message}`);
      } else {
        console.log(`✅ Batch ${Math.floor(i / 50) + 1}: ${batch.length} guests`);
      }

      await new Promise(r => setTimeout(r, 500));
    }

    console.log('\n✨ Setup complete!');
    console.log('\n📌 Next:');
    console.log('  1. Rebuild: npm run build');
    console.log('  2. Redeploy dist to Netlify');
    console.log('  3. Login with username only (kishan, megha, etc)');
    console.log('  4. View Master RSVP with 294 guests\n');

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

setup();
