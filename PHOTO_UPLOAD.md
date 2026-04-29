# Google Drive Photo Upload to Cloudinary

This script automatically uploads wedding photos from Google Drive to Cloudinary and saves them in Supabase.

## ✅ Setup Steps

### 1. Add Google API Key to `.env.local`

First, **revoke the exposed API key** you shared earlier:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → **Credentials**
3. Find and delete the key `AIzaSyCgPkak3zNlEcfn7pQZuvwi1zDwXtVktFw`
4. Create a new API key:
   - Click **"+ CREATE CREDENTIALS"** → **"API Key"**
   - Copy the new key
   - Click the lock icon to restrict it to Google Drive API only

### 2. Update `.env.local`

Edit `C:\Users\Kishan\wedding-app\.env.local`:

```env
VITE_SUPABASE_URL=https://mexeegqwlewmrsejdvlw.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_DSfOh1b64Rv6fX_J703Xzw_INxl1eMx
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
GOOGLE_API_KEY=YOUR_NEW_API_KEY_HERE
GOOGLE_DRIVE_FOLDER_ID=1BKIM0XbS7pmaj54A1T2_dVh9QYID8l_W
```

**Where to get values:**
- **CLOUDINARY_CLOUD_NAME**: [cloudinary.com/console](https://cloudinary.com/console) → Settings → Cloud Name
- **CLOUDINARY_UPLOAD_PRESET**: [cloudinary.com](https://cloudinary.com) → Settings → Upload → Unsigned presets → Create one named `wedding_app`
- **GOOGLE_API_KEY**: Your new API key from step 1

### 3. Install Dependencies

Run in terminal:

```bash
npm install
```

This installs `node-fetch` and `dotenv` needed for the upload script.

---

## 🚀 Usage

### Option A: Run with npm command

```bash
npm run upload:photos
```

### Option B: Run directly with Node

```bash
node uploadFromGoogleDrive.js
```

---

## 📊 What the Script Does

1. **Reads Google Drive folder** → Lists all image files
2. **Downloads from Google Drive** → Fetches each photo
3. **Uploads to Cloudinary** → Stores in your Cloudinary account
4. **Saves to Supabase** → Stores URLs in `photos` table
5. **Appears in Photo Gallery** → Automatically shows in your app!

---

## ✨ Example Output

```
🎬 Wedding Photo Upload Script

Configuration:
  Google Drive Folder: 1BKIM0XbS7pmaj54A1T2_dVh9QYID8l_W
  Cloudinary: your_cloud_name
  Supabase: mexeegqwlewmrsejdvlw

📷 Fetching photos from Google Drive...
✅ Found 47 photos in Google Drive

🚀 Starting upload of 47 photos...

[1/47] Uploading bride_portrait.jpg... ✅
[2/47] Uploading groom_portrait.jpg... ✅
[3/47] Uploading couple_shot.jpg... ✅
...
[47/47] Uploading group_photo_5.jpg... ✅

============================================================
✅ UPLOAD COMPLETE!

   Total: 47
   Successful: 47
   Failed: 0

📸 Your photos are now in the Photo Gallery!
   Go to: Photo Gallery → All Photos

📋 Results saved to: upload_results.json
```

---

## 🔍 Verify Upload

1. Open your wedding app
2. Go to **Photo Gallery** page
3. Scroll down to **"All Photos"** section
4. All your Google Drive photos should now appear! 📸

---

## ⚠️ Troubleshooting

### "GOOGLE_API_KEY not configured"
- Make sure you updated `.env.local` with your actual API key
- Don't use the old exposed key - create a new one

### "Using demo Cloudinary account"
- Update `.env.local` with your real Cloudinary values
- Create an unsigned upload preset in Cloudinary settings

### "Google Drive API Error: Permission denied"
- Make sure you shared the Google Drive folder with your service account email
- Or use the new API key approach

### Photos not appearing
- Check that Supabase is accessible
- Verify Cloudinary upload was successful
- Check browser console for errors

---

## 📝 Results File

After upload completes, check `upload_results.json` for:
- Total photos processed
- Success/failure count
- All Cloudinary URLs uploaded

---

## 🎬 Done!

Your wedding photos are now:
- ✅ Uploaded to Cloudinary
- ✅ Stored in Supabase
- ✅ Available in Photo Gallery
- ✅ Ready for AI face detection (via Magic Gallery backend)

Enjoy! 🎉
