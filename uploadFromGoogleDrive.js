import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const API_KEY = process.env.GOOGLE_API_KEY;
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;
const CLOUDINARY_CLOUD = process.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`;

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function listGoogleDrivePhotos() {
  console.log('\n📷 Fetching photos from Google Drive...');
  try {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}' in parents and mimeType contains 'image/'&key=${API_KEY}&fields=files(id,name)&pageSize=1000`
    );

    const data = await response.json();

    if (data.error) {
      throw new Error(`Google Drive API Error: ${data.error.message}`);
    }

    const files = data.files || [];
    console.log(`✅ Found ${files.length} photos in Google Drive`);
    return files;
  } catch (error) {
    console.error('❌ Error fetching from Google Drive:', error.message);
    throw error;
  }
}

async function uploadToCloudinary(fileId, fileName) {
  const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

  const formData = new FormData();
  formData.append('file', downloadUrl);
  formData.append('upload_preset', UPLOAD_PRESET);

  try {
    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    if (data.secure_url) {
      console.log(`   ✅ ${fileName.substring(0, 40)}`);
      return data.secure_url;
    } else {
      throw new Error('No secure_url returned');
    }
  } catch (error) {
    console.error(`   ❌ ${fileName}: ${error.message}`);
    return null;
  }
}

async function saveToSupabase(cloudinaryUrl, fileName) {
  try {
    const { data, error } = await supabase
      .from('photos')
      .insert([{ url: cloudinaryUrl, guest_tags: [], ai_tags: fileName }])
      .select();

    if (error) {
      console.error(`      ⚠️  Supabase save failed: ${error.message}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error(`      ⚠️  Supabase error: ${error.message}`);
    return false;
  }
}

async function processAllPhotos() {
  console.log('\n🎬 Wedding Photo Upload Script\n');
  console.log('Configuration:');
  console.log(`  Google Drive Folder: ${FOLDER_ID}`);
  console.log(`  Cloudinary: ${CLOUDINARY_CLOUD}`);
  console.log(`  Supabase: ${process.env.VITE_SUPABASE_URL?.split('.')[0]}\n`);

  if (!API_KEY || API_KEY === 'YOUR_NEW_API_KEY_HERE') {
    console.error('❌ ERROR: GOOGLE_API_KEY not configured in .env.local');
    console.error('   Please add: GOOGLE_API_KEY=your_actual_api_key');
    process.exit(1);
  }

  if (!CLOUDINARY_CLOUD || CLOUDINARY_CLOUD === 'demo') {
    console.warn('⚠️  WARNING: Using demo Cloudinary account (default values)');
    console.warn('   For production, set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET\n');
  }

  try {
    const photos = await listGoogleDrivePhotos();

    if (photos.length === 0) {
      console.log('No photos found in Google Drive folder');
      return;
    }

    console.log(`\n🚀 Starting upload of ${photos.length} photos...\n`);

    let successful = 0;
    let failed = 0;
    const uploadedUrls = [];

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      const progress = `[${i + 1}/${photos.length}]`;

      process.stdout.write(`${progress} Uploading ${photo.name.substring(0, 35)}... `);

      const url = await uploadToCloudinary(photo.id, photo.name);

      if (url) {
        const saved = await saveToSupabase(url, photo.name);
        if (saved) {
          successful++;
          uploadedUrls.push(url);
        } else {
          failed++;
        }
      } else {
        failed++;
      }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`✅ UPLOAD COMPLETE!\n`);
    console.log(`   Total: ${photos.length}`);
    console.log(`   Successful: ${successful}`);
    console.log(`   Failed: ${failed}\n`);

    if (uploadedUrls.length > 0) {
      console.log('📸 Your photos are now in the Photo Gallery!');
      console.log('   Go to: Photo Gallery → All Photos\n');

      const resultsFile = 'upload_results.json';
      fs.writeFileSync(resultsFile, JSON.stringify({
        timestamp: new Date().toISOString(),
        totalPhotos: photos.length,
        successful,
        failed,
        uploadedUrls
      }, null, 2));

      console.log(`📋 Results saved to: ${resultsFile}\n`);
    }

  } catch (error) {
    console.error('\n❌ FATAL ERROR:', error.message);
    process.exit(1);
  }
}

processAllPhotos();
