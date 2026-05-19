# FastAPI Backend Deployment Guide

Wedding App Face-Matching Backend | Deployment Instructions

## Quick Start (Local Development)

### 1. Prerequisites
- Docker & Docker Compose installed
- Python 3.11+
- PostgreSQL client (optional)

### 2. Start Local Services

```bash
cd backend
docker compose up -d
```

This starts:
- PostgreSQL with pgvector (port 5433)
- Redis (port 6376)
- FastAPI server (port 8000)

### 3. Verify Setup

```bash
# Check containers are running
docker compose ps

# Check API health
curl http://localhost:8000/health

# View API docs
open http://localhost:8000/docs
```

---

## Production Deployment

### Option 1: Render.com (Recommended ✅)

**Advantages:**
- Free tier available
- Easy GitHub integration
- PostgreSQL & Redis managed services
- Auto-deployment on git push

**Setup Steps:**

1. **Create Render Account**
   - Sign up at https://render.com
   - Link GitHub account

2. **Create PostgreSQL Database**
   - New → PostgreSQL
   - Name: `wedding-facedb`
   - Region: Choose closest to users
   - Copy connection string

3. **Create Redis Cache**
   - New → Redis
   - Name: `wedding-redis`
   - Region: Same as DB
   - Copy connection string

4. **Create Web Service**
   ```
   New → Web Service
   Repository: Your GitHub repo
   Name: wedding-face-api
   Environment: Docker
   Autode ploy: Yes
   ```

5. **Set Environment Variables**
   ```
   DATABASE_URL = postgresql://user:password@host:5432/database
   REDIS_URL = redis://:password@host:10000
   ENVIRONMENT = production
   CORS_ORIGINS = https://bim-nexus-9dc9d.web.app
   ```

6. **Deploy**
   - Click "Deploy"
   - View logs in dashboard
   - Get URL: `https://wedding-face-api.onrender.com`

**Cost:**
- PostgreSQL: $15/month (or free with limited features)
- Redis: $5/month
- Web Service: Free (with limitations) or $7/month

---

### Option 2: Railway.app

**Setup Steps:**

1. **Create Project**
   - Connect GitHub repo
   - Select `backend` as root directory

2. **Add PostgreSQL Plugin**
   - Plugins → PostgreSQL
   - Railway auto-generates `DATABASE_URL`

3. **Add Redis Plugin**
   - Plugins → Redis
   - Railway auto-generates `REDIS_URL`

4. **Deploy**
   - Railway auto-deploys from `Dockerfile`
   - Get URL in deployment dashboard

**Environment Variables:**
```
ENVIRONMENT=production
CORS_ORIGINS=https://bim-nexus-9dc9d.web.app
```

**Cost:** Pay as you go, typically $5-15/month

---

### Option 3: Fly.io (Docker-native)

**Setup Steps:**

1. **Install Fly CLI**
   ```bash
   curl -L https://fly.io/install.sh | sh
   fly auth login
   ```

2. **Launch App**
   ```bash
   cd backend
   fly launch
   # Select region closest to users
   # Choose to create PostgreSQL: Yes
   # Choose to create Redis: Yes
   ```

3. **Deploy**
   ```bash
   fly deploy
   ```

4. **View URL**
   ```bash
   fly open
   ```

---

## Environment Variables Reference

| Variable | Required | Example | Notes |
|----------|----------|---------|-------|
| `DATABASE_URL` | ✅ | `postgresql://...` | PostgreSQL connection string |
| `REDIS_URL` | ❌ | `redis://...` | Optional, for caching |
| `PORT` | ❌ | `8000` | Default: 8000 |
| `ENVIRONMENT` | ❌ | `production` | development or production |
| `CORS_ORIGINS` | ✅ | `https://bim-nexus-9dc9d.web.app` | Frontend URL, comma-separated |
| `FACE_MODEL` | ❌ | `Facenet512` | Face embedding model |
| `SIMILARITY_THRESHOLD` | ❌ | `0.6` | Match confidence threshold (0.0-1.0) |

---

## API Endpoints

### Health Check
```
GET /health

Response:
{
  "status": "healthy",
  "service": "face-matching",
  "environment": "production",
  "database_connected": true
}
```

### Upload Event Photos
```
POST /upload/event/

Body (multipart/form-data):
- event_id: string (guest code)
- files: [File, File, ...]

Response:
{
  "success": true,
  "processed_count": 10,
  "message": "Processed 10 photos for event guest_123"
}
```

### Match Selfie
```
POST /match/selfie/

Body (multipart/form-data):
- event_id: string (guest code)
- selfie: File
- threshold: float (optional, default 0.6)

Response:
{
  "matched_photos": [
    {
      "drive_file_id": "file_id_1",
      "url": "https://drive.google.com/uc?id=...",
      "confidence": 0.95
    }
  ],
  "total_in_event": 15
}
```

### Get Event Photos
```
GET /events/{event_id}/photos

Response:
{
  "event_id": "guest_123",
  "total_photos": 10,
  "photos": [...]
}
```

### Delete Event
```
DELETE /events/{event_id}

Response:
{
  "success": true,
  "message": "Deleted all photos for event guest_123"
}
```

---

## Monitoring & Debugging

### View Logs (Render)
```bash
# Web UI: Dashboard → Service → Logs
# Or via CLI:
# render logs --service wedding-face-api
```

### Test Deployment
```bash
# Health check
curl https://wedding-face-api.onrender.com/health

# API docs
open https://wedding-face-api.onrender.com/docs
```

### Database Connection Issues
```bash
# Test connection
psql -h host -U user -d facedb -c "SELECT 1"

# Check pgvector installed
psql -h host -U user -d facedb -c "CREATE EXTENSION IF NOT EXISTS vector; SELECT 1"
```

---

## Performance Optimization

### Database Indexing
```sql
-- Already created in model:
CREATE INDEX idx_event_id ON photo_faces(event_id);
CREATE INDEX idx_embedding ON photo_faces USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

### Connection Pooling
```python
# Using NullPool in development, consider using QueuePool in production:
from sqlalchemy.pool import QueuePool

engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=10,
    max_overflow=20
)
```

---

## Cost Estimation

| Service | Free Tier | Paid Tier | Total/Month |
|---------|-----------|-----------|-------------|
| **Render** | Limited | $15 + $5 | $20 |
| **Railway** | $5 credits | $0.50/hour | $15-20 |
| **Fly.io** | $3 credit | $0.50/hour | $10-15 |

---

## Update Frontend URL

Once deployed, update the frontend `.env`:

```env
# Development
VITE_FASTAPI_URL=http://localhost:8000

# Production (Render example)
VITE_FASTAPI_URL=https://wedding-face-api.onrender.com
```

Then rebuild and redeploy React app:
```bash
npm run build
firebase deploy --only hosting
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 500 error on `/match/selfie/` | Check if photos exist for event_id |
| CORS errors | Verify `CORS_ORIGINS` includes your frontend URL |
| Database connection timeout | Check `DATABASE_URL` is correct |
| Out of memory | Reduce `max_pool_size` in connection settings |
| Slow face detection | Consider using lighter model (e.g., `VGGFace` instead of `Facenet512`) |

---

## Next Steps

1. ✅ Deploy to Render/Railway/Fly
2. ✅ Update `VITE_FASTAPI_URL` in frontend `.env`
3. ✅ Redeploy frontend to Firebase
4. ✅ Test guest portal face matching
5. ✅ Set up admin photo upload endpoint
6. ✅ Monitor performance and logs

