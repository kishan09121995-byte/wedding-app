#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Credentials
const SUPABASE_URL = 'https://mexeegqwlewmrsejdvlw.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1leGVlZ3F3bGV3bXJzZWpkdmx3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzM3NDgzMywiZXhwIjoyMDkyOTUwODMzfQ.BwggZwl_y9easDUAbgPmGc4WyIkYNI57dV4Doarb7lE';
const ANON_KEY = 'sb_publishable_DSfOh1b64Rv6fX_J703Xzw_INxl1eMx';

// Admin client
const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// Guest names
const groomNames = [
  'Rajesh Batavia', 'Priya Batavia', 'Amit Shah', 'Neha Patel', 'Vikram Singh',
  'Anjali Verma', 'Sanjay Kumar', 'Pooja Sharma', 'Deepak Mota', 'Shreya Gupta',
  'Rohit Desai', 'Isha Mishra', 'Arjun Yadav', 'Kavya Nair', 'Nikhil Rathod',
  'Diya Chopra', 'Aditya Bhat', 'Ananya Iyer', 'Varun Pillai', 'Sakshi Reddy',
  'Harsh Joshi', 'Nisha Malhotra', 'Karan Kapoor', 'Riya Singh', 'Manish Batra',
  'Sneha Pandey', 'Suresh Menon', 'Divya Kulkarni', 'Prakash Rao', 'Meera Nambiar',
  'Ashok Trivedi', 'Payal Saxena', 'Mahesh Pillai', 'Swati Aggarwal', 'Ramesh Iyer',
  'Anita Krishnan', 'Naveen Kumar', 'Priyanka Sharma', 'Girish Agrawal', 'Sunita Verma',
  'Siddharth Kapadia', 'Ridhima Sinha', 'Jayesh Tiwari', 'Tanvi Bhat', 'Vikram Shenoy',
  'Aadhya Reddy', 'Rohan Menon', 'Pooja Jain', 'Aryan Malik', 'Zara Chopra',
  'Kunal Sharma', 'Ishi Patel', 'Yash Gupta', 'Sana Khan', 'Vedant Verma',
  'Tanya Nair', 'Vikas Rao', 'Swapna Iyer', 'Ashish Bose', 'Ritika Desai',
  'Anuj Kapoor', 'Neetu Singh', 'Chirag Modi', 'Simran Gill', 'Dinesh Reddy',
  'Kavya Menon', 'Eshan Kapoor', 'Aarav Malhotra', 'Disha Bansal', 'Harsh Tiwari',
  'Preeti Saxena', 'Gaurav Sharma', 'Isha Nambiar', 'Aryan Trivedi', 'Nidhi Gupta',
  'Rohit Verma', 'Sakshi Patel', 'Saurav Kumar', 'Aadhira Iyer', 'Yatin Desai',
  'Shreya Pillai', 'Neeraj Agarwal', 'Priya Menon', 'Akshay Bhat', 'Ritu Sharma',
  'Siddharth Joshi', 'Anjali Reddy', 'Ravi Nair', 'Divya Shah', 'Arjun Malhotra',
  'Sneha Kapoor', 'Varun Saxena', 'Zoya Verma', 'Nikhil Iyer', 'Pooja Gupta',
  'Amit Rao', 'Aarav Chopra', 'Diya Menon', 'Karan Singh', 'Ananya Patel',
  'Suresh Pillai', 'Meera Sharma', 'Prakash Desai', 'Nisha Bhat', 'Mahesh Trivedi',
  'Ridhima Nair', 'Girish Kumar', 'Isha Agarwal', 'Siddharth Gill', 'Tanya Reddy',
  'Vikas Malik', 'Swati Chopra', 'Ashok Verma', 'Priyanka Iyer', 'Rohan Gupta',
  'Aadhya Khan', 'Jayesh Joshi', 'Sunita Patel', 'Vedant Rao', 'Riya Saxena',
  'Kunal Desai', 'Shreya Singh', 'Yash Nair', 'Anita Menon', 'Chirag Sharma',
  'Payal Bhat', 'Aryan Kapoor', 'Kavya Trivedi', 'Dinesh Kumar', 'Simran Iyer',
  'Eshan Reddy', 'Ishi Malhotra', 'Gaurav Chopra', 'Disha Verma', 'Neeraj Gupta',
];

const brideNames = [
  'Vikram Vithlani', 'Priya Vithlani', 'Ashok Vithlani', 'Neha Joshi', 'Rajesh Patel',
  'Anjali Singh', 'Sanjay Sharma', 'Pooja Verma', 'Deepak Gupta', 'Shreya Nair',
  'Rohit Iyer', 'Isha Pillai', 'Arjun Reddy', 'Kavya Desai', 'Nikhil Menon',
  'Diya Agarwal', 'Aditya Khan', 'Ananya Chopra', 'Varun Saxena', 'Sakshi Bhat',
  'Harsh Trivedi', 'Nisha Malhotra', 'Karan Kapoor', 'Riya Jain', 'Manish Rao',
  'Sneha Nambiar', 'Suresh Kumar', 'Divya Sharma', 'Prakash Verma', 'Meera Gupta',
  'Ashok Patel', 'Payal Singh', 'Mahesh Iyer', 'Swati Reddy', 'Ramesh Desai',
  'Anita Menon', 'Naveen Agarwal', 'Priyanka Khan', 'Girish Chopra', 'Sunita Saxena',
  'Siddharth Bhat', 'Ridhima Trivedi', 'Jayesh Pillai', 'Tanvi Nair', 'Vikram Iyer',
  'Aadhya Sharma', 'Rohan Verma', 'Pooja Gupta', 'Aryan Patel', 'Zara Singh',
  'Kunal Reddy', 'Ishi Desai', 'Yash Menon', 'Sana Agarwal', 'Vedant Khan',
  'Tanya Chopra', 'Vikas Saxena', 'Swapna Bhat', 'Ashish Trivedi', 'Ritika Nair',
  'Anuj Iyer', 'Neetu Sharma', 'Chirag Verma', 'Simran Gupta', 'Dinesh Patel',
  'Kavya Singh', 'Eshan Reddy', 'Aarav Desai', 'Disha Menon', 'Harsh Agarwal',
  'Preeti Khan', 'Gaurav Chopra', 'Isha Saxena', 'Aryan Bhat', 'Nidhi Trivedi',
  'Rohit Nair', 'Sakshi Iyer', 'Saurav Sharma', 'Aadhira Verma', 'Yatin Gupta',
  'Shreya Patel', 'Neeraj Singh', 'Priya Reddy', 'Akshay Desai', 'Ritu Menon',
  'Siddharth Agarwal', 'Anjali Khan', 'Ravi Chopra', 'Divya Saxena', 'Arjun Bhat',
  'Sneha Trivedi', 'Varun Nair', 'Zoya Iyer', 'Nikhil Sharma', 'Pooja Verma',
  'Amit Gupta', 'Aarav Patel', 'Diya Singh', 'Karan Reddy', 'Ananya Desai',
  'Suresh Menon', 'Meera Agarwal', 'Prakash Khan', 'Nisha Chopra', 'Mahesh Saxena',
  'Ridhima Bhat', 'Girish Trivedi', 'Isha Nair', 'Siddharth Iyer', 'Tanya Sharma',
  'Vikas Verma', 'Swati Gupta', 'Ashok Patel', 'Priyanka Singh', 'Rohan Reddy',
];

const cities = [
  'Ahmedabad', 'Mumbai', 'Delhi', 'Bangalore', 'Pune',
  'Hyderabad', 'Chennai', 'Kolkata', 'Chandigarh', 'Jaipur',
  'Lucknow', 'Indore', 'Surat', 'Vadodara', 'Rajkot',
  'Junagadh', 'Bhavnagar', 'Anand', 'Himmatnagar', 'Nadiad',
];

function generateGuests() {
  const guests = [];

  // Groom side (161)
  for (let i = 0; i < 161; i++) {
    const name = groomNames[i % groomNames.length];
    const pax = Math.floor(Math.random() * 3) + 1;
    const jainPax = Math.random() > 0.7 ? Math.floor(Math.random() * pax) + 1 : 0;
    const city = cities[Math.floor(Math.random() * cities.length)];
    const rsvpStatus = Math.random() > 0.1 ? 'Confirmed' : Math.random() > 0.5 ? 'Not Decided' : 'Declined';
    const roomNeeded = rsvpStatus === 'Confirmed' && Math.random() > 0.4 ? 'Yes' : 'No';

    guests.push({
      name: `${name} (G${i + 1})`,
      city,
      pax_total: pax,
      side: 'Groom',
      rsvp_status: rsvpStatus,
      jain_pax: jainPax,
      f1: Math.random() > 0.15 ? 'Yes' : Math.random() > 0.5 ? 'No' : 'TBD',
      f2: Math.random() > 0.15 ? 'Yes' : Math.random() > 0.5 ? 'No' : 'TBD',
      f3: Math.random() > 0.15 ? 'Yes' : Math.random() > 0.5 ? 'No' : 'TBD',
      f4: Math.random() > 0.15 ? 'Yes' : Math.random() > 0.5 ? 'No' : 'TBD',
      room_needed: roomNeeded,
      hotel_id: roomNeeded === 'Yes' ? (Math.random() > 0.3 ? 'leo-resort' : 'leo-medium') : null,
      room_category: roomNeeded === 'Yes' ? 'Standard' : null,
      check_in: '2026-06-21',
      check_out: '2026-06-22',
      notes: Math.random() > 0.85 ? 'VIP' : null,
      qr_token: Math.random().toString(36).substring(2, 15),
    });
  }

  // Bride side (133)
  for (let i = 0; i < 133; i++) {
    const name = brideNames[i % brideNames.length];
    const pax = Math.floor(Math.random() * 3) + 1;
    const jainPax = Math.random() > 0.65 ? Math.floor(Math.random() * pax) + 1 : 0;
    const city = cities[Math.floor(Math.random() * cities.length)];
    const rsvpStatus = Math.random() > 0.1 ? 'Confirmed' : Math.random() > 0.5 ? 'Not Decided' : 'Declined';
    const roomNeeded = rsvpStatus === 'Confirmed' && Math.random() > 0.4 ? 'Yes' : 'No';

    guests.push({
      name: `${name} (B${i + 1})`,
      city,
      pax_total: pax,
      side: 'Bride',
      rsvp_status: rsvpStatus,
      jain_pax: jainPax,
      f1: Math.random() > 0.15 ? 'Yes' : Math.random() > 0.5 ? 'No' : 'TBD',
      f2: Math.random() > 0.15 ? 'Yes' : Math.random() > 0.5 ? 'No' : 'TBD',
      f3: Math.random() > 0.15 ? 'Yes' : Math.random() > 0.5 ? 'No' : 'TBD',
      f4: Math.random() > 0.15 ? 'Yes' : Math.random() > 0.5 ? 'No' : 'TBD',
      room_needed: roomNeeded,
      hotel_id: roomNeeded === 'Yes' ? (Math.random() > 0.3 ? 'leo-resort' : 'leo-medium') : null,
      room_category: roomNeeded === 'Yes' ? 'Standard' : null,
      check_in: '2026-06-21',
      check_out: '2026-06-22',
      notes: Math.random() > 0.85 ? 'VIP' : null,
      qr_token: Math.random().toString(36).substring(2, 15),
    });
  }

  return guests;
}

async function setupDatabase() {
  console.log('🚀 WEDDING APP AUTO-SETUP\n');
  console.log('═══════════════════════════════════════\n');

  try {
    // Step 1: Create Hotels
    console.log('📍 Step 1: Setting up hotels...');
    const hotels = [
      { name: 'LEO Resort', category: 'Premium/Fern', breakfast_type: 'Yes-FREE', default_checkin: '2026-06-21', default_checkout: '2026-06-22', rate_per_room_night: 6000, contracted_rooms: 40 },
      { name: 'LEO Medium', category: 'Standard', breakfast_type: 'Yes-FREE', default_checkin: '2026-06-21', default_checkout: '2026-06-22', rate_per_room_night: 3500, contracted_rooms: 0 },
      { name: 'XYZ Hotel', category: 'Budget', breakfast_type: 'No', default_checkin: '2026-06-21', default_checkout: '2026-06-22', rate_per_room_night: 2500, contracted_rooms: 0 },
      { name: 'Indralok', category: 'Standard', breakfast_type: 'No', default_checkin: '2026-06-21', default_checkout: '2026-06-22', rate_per_room_night: 3000, contracted_rooms: 0 },
    ];

    const { error: hotelError } = await supabaseAdmin.from('hotel_settings').insert(hotels);
    if (hotelError && !hotelError.message.includes('duplicate')) {
      console.error('⚠️  Hotels already exist or error:', hotelError.message);
    } else {
      console.log('✅ Hotels created');
    }

    // Step 2: Create Functions
    console.log('\n📍 Step 2: Setting up functions (F1-F4)...');
    const functions = [
      { name: 'F1 - Mandap Ceremony', event_date: '2026-06-21', description: 'Mandap ceremony with parallel venues, followed by lunch' },
      { name: 'F2 - Haldi / Carnival', event_date: '2026-06-21', description: 'Haldi/Carnival at AMARA Lawn with high tea' },
      { name: 'F3 - Sangeet / Pre-Wedding Reception', event_date: '2026-06-21', description: 'Sangeet evening with dinner and late night snacks' },
      { name: 'F4 - Wedding Day', event_date: '2026-06-22', description: 'Main wedding ceremony with breakfast, baraat, and wedding lunch' },
    ];

    const { error: fnError } = await supabaseAdmin.from('functions').insert(functions);
    if (fnError && !fnError.message.includes('duplicate')) {
      console.error('⚠️  Functions already exist or error:', fnError.message);
    } else {
      console.log('✅ Functions created');
    }

    // Step 3: Get function IDs for catering
    const { data: functionData } = await supabaseAdmin.from('functions').select('id, name');
    const fnMap = {};
    functionData?.forEach(fn => {
      fnMap[fn.name] = fn.id;
    });

    // Step 4: Create Catering Items
    console.log('\n📍 Step 3: Setting up catering items...');
    const catering = [
      { function_id: fnMap['F1 - Mandap Ceremony'], meal_name: 'Mandap Refreshments', rate_per_plate: 0, min_guarantee_pax: 0, venue: 'Zira & Library' },
      { function_id: fnMap['F1 - Mandap Ceremony'], meal_name: 'Lunch', rate_per_plate: 683, min_guarantee_pax: 150, venue: 'Kiara-3 Ballroom' },
      { function_id: fnMap['F2 - Haldi / Carnival'], meal_name: 'High Tea', rate_per_plate: 368, min_guarantee_pax: 200, venue: 'AMARA Lawn' },
      { function_id: fnMap['F3 - Sangeet / Pre-Wedding Reception'], meal_name: 'Dinner', rate_per_plate: 893, min_guarantee_pax: 550, venue: 'Kiara Ballroom' },
      { function_id: fnMap['F3 - Sangeet / Pre-Wedding Reception'], meal_name: 'Late Night Snacks', rate_per_plate: 400, min_guarantee_pax: 0, is_manual: true, venue: 'Kiara Ballroom' },
      { function_id: fnMap['F4 - Wedding Day'], meal_name: 'Breakfast - In-House Free', rate_per_plate: 0, min_guarantee_pax: 0, venue: 'Kesar' },
      { function_id: fnMap['F4 - Wedding Day'], meal_name: 'Breakfast - Additional', rate_per_plate: 400, min_guarantee_pax: 0, is_manual: true, venue: 'Kesar' },
      { function_id: fnMap['F4 - Wedding Day'], meal_name: 'Wedding Lunch', rate_per_plate: 893, min_guarantee_pax: 500, venue: 'Kiara Ballroom' },
    ];

    const { error: cateringError } = await supabaseAdmin.from('catering_items').insert(catering);
    if (cateringError && !cateringError.message.includes('duplicate')) {
      console.error('⚠️  Catering items already exist or error:', cateringError.message);
    } else {
      console.log('✅ Catering items created');
    }

    // Step 5: Create Payment Schedule
    console.log('\n📍 Step 4: Setting up payment schedule...');
    const payments = [
      { installment_name: 'Token Advance', due_date: '2026-02-28', amount: 100000, status: 'Paid', paid_on: '2026-02-28' },
      { installment_name: 'Installment 1', due_date: '2026-03-19', amount: 525000, status: 'Paid', paid_on: '2026-03-19' },
      { installment_name: 'Installment 2', due_date: '2026-04-19', amount: 500000, status: 'Pending', paid_on: null },
      { installment_name: 'Installment 3', due_date: '2026-05-19', amount: 500000, status: 'Pending', paid_on: null },
    ];

    const { error: paymentError } = await supabaseAdmin.from('payment_schedule').insert(payments);
    if (paymentError && !paymentError.message.includes('duplicate')) {
      console.error('⚠️  Payment schedule already exists or error:', paymentError.message);
    } else {
      console.log('✅ Payment schedule created');
    }

    // Step 6: Check if guests already exist
    console.log('\n📍 Step 5: Checking for existing guests...');
    const { count: guestCount } = await supabaseAdmin.from('guests').select('*', { count: 'exact', head: true });

    if (guestCount > 0) {
      console.log(`⚠️  Database already has ${guestCount} guests. Skipping insertion.`);
    } else {
      // Step 7: Generate and insert guests
      console.log('\n📍 Step 6: Generating 294 sample guests...');
      const guests = generateGuests();
      console.log('✅ Generated: 161 Groom + 133 Bride');

      console.log('\n📍 Step 7: Inserting guests into database...');
      const batchSize = 50;
      let inserted = 0;

      for (let i = 0; i < guests.length; i += batchSize) {
        const batch = guests.slice(i, i + batchSize);
        const { error: insertError } = await supabaseAdmin.from('guests').insert(batch);

        if (insertError) {
          console.error(`\n❌ Error inserting batch ${i}-${i + batchSize}:`, insertError.message);
          throw insertError;
        }

        inserted += batch.length;
        const progress = Math.round((inserted / guests.length) * 100);
        process.stdout.write(`\r   Inserted: ${inserted}/${guests.length} (${progress}%)`);
      }

      console.log('\n✅ All guests inserted successfully!');
    }

    // Final verification
    console.log('\n📍 Step 8: Verifying database...');
    const { count: finalGuestCount } = await supabaseAdmin.from('guests').select('*', { count: 'exact', head: true });
    const { data: hotelCount } = await supabaseAdmin.from('hotel_settings').select('*');
    const { data: functionCount } = await supabaseAdmin.from('functions').select('*');
    const { data: cateringCount } = await supabaseAdmin.from('catering_items').select('*');
    const { data: paymentCount } = await supabaseAdmin.from('payment_schedule').select('*');

    console.log('\n' + '═'.repeat(50));
    console.log('\n✅ DATABASE SETUP COMPLETE!\n');
    console.log('📊 Summary:');
    console.log(`   ✅ Hotels: ${hotelCount?.length || 0}/4`);
    console.log(`   ✅ Functions: ${functionCount?.length || 0}/4`);
    console.log(`   ✅ Catering Items: ${cateringCount?.length || 0}/8`);
    console.log(`   ✅ Payment Schedule: ${paymentCount?.length || 0}/4`);
    console.log(`   ✅ Guests: ${finalGuestCount || 0}/294`);

    if (finalGuestCount > 0) {
      const { data: guestStats } = await supabaseAdmin
        .from('guests')
        .select('side, rsvp_status')
        .eq('side', 'Groom');

      const { data: brideStats } = await supabaseAdmin
        .from('guests')
        .select('side, rsvp_status')
        .eq('side', 'Bride');

      console.log(`\n👥 Guests:`)
      console.log(`   Groom Side: ${guestStats?.length || 0}`);
      console.log(`   Bride Side: ${brideStats?.length || 0}`);

      const confirmed = (await supabaseAdmin.from('guests').select('*', { count: 'exact', head: true }).eq('rsvp_status', 'Confirmed')).count;
      console.log(`   Confirmed: ${confirmed || 0}`);
    }

    console.log('\n' + '═'.repeat(50));
    console.log('\n🚀 NEXT STEPS:\n');
    console.log('1. Create .env.local in wedding-app folder:');
    console.log('   VITE_SUPABASE_URL=' + SUPABASE_URL);
    console.log('   VITE_SUPABASE_ANON_KEY=' + ANON_KEY);
    console.log('\n2. Run:');
    console.log('   cd wedding-app');
    console.log('   npm install');
    console.log('   npm run dev');
    console.log('\n3. Open http://localhost:3000');
    console.log('4. Sign up with: kishan@example.com / password123');
    console.log('5. Go to "Master RSVP" → See all 294 guests! 🎉\n');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();
