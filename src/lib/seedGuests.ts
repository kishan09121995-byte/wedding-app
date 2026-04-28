// Sample guest data generator - 294 guests (161 Groom + 133 Bride)

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
  'Aarav Pillai', 'Priya Jain', 'Saurav Agarwal', 'Tanvi Nair', 'Harsh Desai',
  'Preeti Menon', 'Ramesh Bhat', 'Swapna Singh', 'Ashish Kapoor', 'Ritika Patel',
  'Anuj Saxena', 'Neetu Sharma', 'Chirag Iyer', 'Simran Rao', 'Dinesh Reddy',
  'Kavya Gill', 'Eshan Trivedi', 'Aarav Verma', 'Disha Kumar', 'Harsh Jain',
  'Preeti Malhotra', 'Gaurav Nair', 'Ishi Chopra', 'Yash Desai', 'Sana Menon',
  'Vedant Bhat', 'Tanya Patel', 'Vikas Sharma', 'Swati Agarwal', 'Ashok Iyer',
  'Priyanka Gupta', 'Rohan Joshi', 'Pooja Kapoor', 'Aryan Saxena', 'Zara Reddy',
  'Kunal Nair', 'Ish Chopra', 'Yash Trivedi', 'Sana Verma', 'Vedant Malhotra',
  'Tanya Desai', 'Vikas Patel', 'Swati Gill', 'Ashok Menon', 'Priyanka Bhat',
  'Rohan Sharma', 'Pooja Iyer', 'Aryan Rao', 'Zara Saxena', 'Kunal Jain',
]

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
  'Aadhya Desai', 'Jayesh Menon', 'Sunita Agarwal', 'Vedant Khan', 'Riya Chopra',
  'Kunal Saxena', 'Shreya Bhat', 'Yash Trivedi', 'Anita Nair', 'Chirag Iyer',
  'Payal Sharma', 'Aryan Verma', 'Kavya Gupta', 'Dinesh Patel', 'Simran Singh',
  'Eshan Reddy', 'Ishi Desai', 'Gaurav Menon', 'Disha Agarwal', 'Neeraj Khan',
  'Aarav Chopra', 'Priya Saxena', 'Saurav Bhat', 'Tanvi Trivedi', 'Harsh Nair',
  'Preeti Iyer', 'Ramesh Sharma', 'Swapna Verma', 'Ashish Gupta', 'Ritika Patel',
  'Anuj Singh', 'Neetu Reddy', 'Chirag Desai', 'Simran Menon', 'Dinesh Agarwal',
  'Kavya Khan', 'Eshan Chopra', 'Aarav Saxena', 'Disha Bhat', 'Harsh Trivedi',
  'Preeti Nair', 'Gaurav Iyer', 'Ishi Sharma', 'Yash Verma', 'Sana Gupta',
  'Vedant Patel', 'Tanya Singh', 'Vikas Reddy', 'Swati Desai', 'Ashok Menon',
  'Priyanka Agarwal', 'Rohan Khan', 'Pooja Chopra', 'Aryan Saxena', 'Zara Bhat',
  'Kunal Trivedi', 'Ishi Nair', 'Yash Iyer', 'Sana Sharma', 'Vedant Verma',
]

const cities = [
  'Ahmedabad', 'Mumbai', 'Delhi', 'Bangalore', 'Pune',
  'Hyderabad', 'Chennai', 'Kolkata', 'Chandigarh', 'Jaipur',
  'Lucknow', 'Indore', 'Surat', 'Vadodara', 'Rajkot',
  'Junagadh', 'Bhavnagar', 'Anand', 'Himmatnagar', 'Nadiad',
]

export function generateSampleGuests() {
  const guests = []
  let guestId = 1

  // Groom side guests (161)
  for (let i = 0; i < 161; i++) {
    const namePool = groomNames
    const name = namePool[i % namePool.length]
    const pax = Math.floor(Math.random() * 3) + 1 // 1-3 people per group
    const jainPax = Math.random() > 0.7 ? Math.floor(Math.random() * pax) + 1 : 0 // 30% are Jain
    const city = cities[Math.floor(Math.random() * cities.length)]
    const rsvpStatus = Math.random() > 0.1 ? 'Confirmed' : Math.random() > 0.5 ? 'Not Decided' : 'Declined'
    const roomNeeded = rsvpStatus === 'Confirmed' && Math.random() > 0.4 ? 'Yes' : 'No'

    guests.push({
      id: guestId.toString(),
      name: `${name} (G${guestId})`,
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
    })
    guestId++
  }

  // Bride side guests (133)
  for (let i = 0; i < 133; i++) {
    const namePool = brideNames
    const name = namePool[i % namePool.length]
    const pax = Math.floor(Math.random() * 3) + 1
    const jainPax = Math.random() > 0.65 ? Math.floor(Math.random() * pax) + 1 : 0 // 35% Jain on bride side
    const city = cities[Math.floor(Math.random() * cities.length)]
    const rsvpStatus = Math.random() > 0.1 ? 'Confirmed' : Math.random() > 0.5 ? 'Not Decided' : 'Declined'
    const roomNeeded = rsvpStatus === 'Confirmed' && Math.random() > 0.4 ? 'Yes' : 'No'

    guests.push({
      id: guestId.toString(),
      name: `${name} (B${guestId - 161})`,
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
    })
    guestId++
  }

  return guests
}
