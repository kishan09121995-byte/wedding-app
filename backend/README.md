# Wedding Face-Matching FastAPI Backend

Face recognition and matching service for the wedding app guest portal.

## Features

✅ **Face Detection & Embedding**: Extract 128D face vectors from images  
✅ **Similarity Matching**: Compare selfies against event photos using pgvector  
✅ **Google Drive Integration**: Generate secure download links for matched photos  
✅ **Event Isolation**: Photos organized by guest code (event_id)  
✅ **Scalable**: PostgreSQL + pgvector for fast vector similarity search  
✅ **Production Ready**: Docker, health checks, comprehensive error handling  

## Quick Start

### Local Development (5 minutes)

```bash
# 1. Clone repo and navigate to backend
cd wedding-app/backend

# 2. Start services (Docker required)
docker compose up -d

# 3. Check health
curl http://localhost:8000/health

# 4. Open API docs
open http://localhost:8000/docs
```

### Environment Setup

```bash
# Copy example env
cp .env.example .env

# Edit .env with your values
VITE_FASTAPI_URL=http://localhost:8000
```

## API Usage

### Upload Photos for an Event

```bash
curl -X POST "http://localhost:8000/upload/event/" \
  -H "Content-Type: multipart/form-data" \
  -F "event_id=guest_123" \
  -F "files=@photo1.jpg" \
  -F "files=@photo2.jpg"
```

### Match Guest Selfie

```bash
curl -X POST "http://localhost:8000/match/selfie/" \
  -H "Content-Type: multipart/form-data" \
  -F "event_id=guest_123" \
  -F "selfie=@selfie.jpg" \
  -F "threshold=0.6"
```

Response:
```json
{
  "matched_photos": [
    {
      "drive_file_id": "photo_1",
      "url": "https://drive.google.com/uc?id=...",
      "confidence": 0.95
    }
  ],
  "total_in_event": 10
}
```

## Architecture

```
FastAPI Server (port 8000)
    ↓
SQLAlchemy ORM
    ↓
PostgreSQL + pgvector (port 5433)
    ↓
128D Face Embeddings (cosine similarity)
```

## Face Recognition Models

Supported models via DeepFace:
- **Facenet512** (recommended) - 128D embedding
- **VGGFace** - Fast, lightweight
- **OpenFace** - Good accuracy
- **ArcFace** - High quality, slower
- **Dlib** - Classic model

Switch via `FACE_MODEL` env var.

## Configuration

### Environment Variables

```env
# Required
DATABASE_URL=postgresql://user:password@localhost:5433/facedb
CORS_ORIGINS=http://localhost:5173,https://example.com

# Optional
REDIS_URL=redis://localhost:6379
PORT=8000
ENVIRONMENT=development
FACE_MODEL=Facenet512
SIMILARITY_THRESHOLD=0.6
```

## Project Structure

```
backend/
├── main.py                 # FastAPI application
├── requirements.txt        # Python dependencies
├── Dockerfile             # Container image
├── docker-compose.yml     # Local dev services
├── .env.example          # Environment template
├── DEPLOYMENT.md         # Production deployment guide
└── README.md             # This file
```

## Dependencies

- **fastapi** - Web framework
- **sqlalchemy** - ORM
- **pgvector** - Vector similarity search
- **deepface** - Face recognition
- **pillow** - Image processing
- **psycopg2** - PostgreSQL driver

See `requirements.txt` for full list.

## Database Schema

```sql
CREATE TABLE photo_faces (
    id SERIAL PRIMARY KEY,
    event_id VARCHAR(255) NOT NULL,
    drive_file_id VARCHAR(255) NOT NULL,
    drive_url VARCHAR(512),
    embedding VECTOR(128),
    filename VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT NOW(),
    processed INTEGER DEFAULT 0
);

CREATE INDEX idx_event_id ON photo_faces(event_id);
CREATE INDEX idx_embedding ON photo_faces USING ivfflat (embedding);
```

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/` | Root endpoint with API info |
| GET | `/health` | Health check |
| GET | `/docs` | OpenAPI documentation |
| POST | `/upload/event/` | Upload event photos |
| POST | `/match/selfie/` | Match guest selfie |
| GET | `/events/{event_id}/photos` | List event photos |
| DELETE | `/events/{event_id}` | Delete event photos |

## Performance Tuning

### Indexing
```sql
-- Vector index for fast similarity search
CREATE INDEX ON photo_faces USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

### Connection Pooling
- Development: NullPool (no pooling)
- Production: QueuePool with size=10, max_overflow=20

### Caching
- Redis for embedding cache
- Consider caching popular events

## Troubleshooting

**No matches found:**
- Check event_id exists
- Verify photos processed successfully
- Lower `SIMILARITY_THRESHOLD` if needed

**Database errors:**
- Verify PostgreSQL is running
- Check `DATABASE_URL` is correct
- Ensure pgvector extension installed

**Slow performance:**
- Create vector index (see Performance Tuning)
- Check database size (large events = slower queries)
- Consider scaling PostgreSQL

## Deployment

### Quick Deploy (Render.com)

```bash
# 1. Push to GitHub
git push origin main

# 2. Create Render service from repo
# 3. Add PostgreSQL and Redis services
# 4. Set environment variables
# 5. Deploy

# Result: https://wedding-face-api.onrender.com
```

See `DEPLOYMENT.md` for detailed instructions for Render, Railway, Fly.io.

## Development

### Run Tests
```bash
pytest tests/
```

### Format Code
```bash
black .
isort .
```

### Type Checking
```bash
mypy main.py
```

## Contributing

1. Create feature branch
2. Make changes
3. Test locally: `docker compose up -d && pytest`
4. Push and create PR

## Support

- **API Docs**: http://localhost:8000/docs (Swagger UI)
- **Issues**: Create GitHub issue
- **Deployment Help**: See DEPLOYMENT.md

## License

MIT

---

**Frontend Integration**: See `FASTAPI_SETUP_GUIDE.md` in the frontend directory for integrating this backend with the React app.
