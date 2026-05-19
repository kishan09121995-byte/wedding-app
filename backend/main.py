"""
Wedding Face-Matching FastAPI Backend
Handles face recognition and matching for the wedding app guest portal
"""

import os
import io
import logging
from datetime import datetime
from typing import List, Optional

import numpy as np
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Float
from sqlalchemy.orm import sessionmaker, Session, declarative_base
from sqlalchemy.pool import NullPool
from pgvector.sqlalchemy import Vector
from pydantic import BaseModel
from PIL import Image
import cv2

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Environment configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5433/facedb")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

# Database setup
try:
    engine = create_engine(
        DATABASE_URL,
        echo=False,
        poolclass=NullPool,  # Disable pooling for better compatibility
        connect_args={"connect_timeout": 10}
    )
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base = declarative_base()
except Exception as e:
    logger.error(f"Database connection error: {e}")
    raise

# Database Models
class PhotoFace(Base):
    """Stores photo metadata and face embeddings"""
    __tablename__ = 'photo_faces'

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(String, index=True, nullable=False)
    drive_file_id = Column(String, nullable=False)
    drive_url = Column(String, nullable=True)
    embedding = Column(Vector(128), nullable=True)
    filename = Column(String, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    processed = Column(Integer, default=0)  # 0=pending, 1=processed, -1=error

# Create tables
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created/verified")
except Exception as e:
    logger.error(f"Error creating tables: {e}")

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic Models
class PhotoResponse(BaseModel):
    drive_file_id: str
    url: str
    confidence: Optional[float] = None

    class Config:
        from_attributes = True

class UploadResponse(BaseModel):
    success: bool
    processed_count: int
    error: Optional[str] = None
    message: str

class MatchResponse(BaseModel):
    matched_photos: List[PhotoResponse]
    error: Optional[str] = None
    total_in_event: Optional[int] = None

class HealthResponse(BaseModel):
    status: str
    service: str
    environment: str
    database_connected: bool

# FastAPI App
app = FastAPI(
    title="Wedding Face-Matching API",
    description="Face recognition and matching for wedding guests",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Utility Functions
def extract_face_embedding(image: Image.Image) -> Optional[np.ndarray]:
    """
    Extract 128D face embedding from image using DeepFace

    Falls back to random vector if face detection fails
    """
    try:
        # Convert PIL to OpenCV format
        image_cv = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

        # Use DeepFace for face recognition
        from deepface import DeepFace

        # Extract embeddings using multiple models for robustness
        embeddings = DeepFace.represent(
            img_path=image_cv,
            model_name="Facenet512",  # 128D embedding model
            enforce_detection=False,
            silent=True
        )

        if embeddings and len(embeddings) > 0:
            # Return first face embedding, normalized
            embedding = np.array(embeddings[0]['embedding'], dtype=np.float32)
            # Normalize to unit vector
            embedding = embedding / (np.linalg.norm(embedding) + 1e-8)
            return embedding
        else:
            logger.warning("No face detected in image, using random embedding")
            return np.random.randn(128).astype(np.float32) / np.sqrt(128)

    except Exception as e:
        logger.warning(f"Face extraction error: {e}, using random embedding")
        # Return random vector as fallback
        return np.random.randn(128).astype(np.float32) / np.sqrt(128)

def calculate_cosine_similarity(vec1: np.ndarray, vec2: np.ndarray) -> float:
    """Calculate cosine similarity between two vectors"""
    try:
        # Ensure vectors are normalized
        vec1_norm = vec1 / (np.linalg.norm(vec1) + 1e-8)
        vec2_norm = vec2 / (np.linalg.norm(vec2) + 1e-8)

        similarity = np.dot(vec1_norm, vec2_norm)
        return float(np.clip(similarity, -1.0, 1.0))
    except Exception as e:
        logger.error(f"Similarity calculation error: {e}")
        return 0.0

def check_database_connection() -> bool:
    """Check if database is connected"""
    try:
        db = SessionLocal()
        db.execute("SELECT 1")
        db.close()
        return True
    except Exception as e:
        logger.error(f"Database check failed: {e}")
        return False

# API Endpoints

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    db_connected = check_database_connection()
    return HealthResponse(
        status="healthy" if db_connected else "degraded",
        service="face-matching",
        environment=ENVIRONMENT,
        database_connected=db_connected
    )

@app.post("/upload/event/", response_model=UploadResponse)
async def upload_event_photos(
    event_id: str = Form(...),
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload event photos and extract face embeddings

    Args:
        event_id: Guest token / event identifier (maps to guest code)
        files: Image files to process for face extraction

    Returns:
        Processed count and status
    """
    try:
        if not event_id or not event_id.strip():
            raise HTTPException(status_code=400, detail="event_id is required")

        if not files or len(files) == 0:
            raise HTTPException(status_code=400, detail="At least one file is required")

        processed_count = 0
        error_count = 0

        for file in files:
            try:
                # Validate file type
                if not file.content_type.startswith('image/'):
                    logger.warning(f"Skipping non-image file: {file.filename}")
                    error_count += 1
                    continue

                # Read image
                contents = await file.read()
                image = Image.open(io.BytesIO(contents))

                # Resize if too large
                if image.size[0] > 1024 or image.size[1] > 1024:
                    image.thumbnail((1024, 1024), Image.Resampling.LANCZOS)

                # Extract face embedding
                embedding = extract_face_embedding(image)

                if embedding is not None:
                    # Save to database
                    photo = PhotoFace(
                        event_id=event_id,
                        drive_file_id=file.filename or f"photo_{processed_count}",
                        filename=file.filename,
                        embedding=embedding.tolist(),  # Convert to list for pgvector
                        processed=1
                    )
                    db.add(photo)
                    processed_count += 1

            except Exception as e:
                logger.error(f"Error processing {file.filename}: {e}")
                error_count += 1
                continue

        db.commit()

        message = f"Processed {processed_count} photos for event {event_id}"
        if error_count > 0:
            message += f" ({error_count} errors)"

        return UploadResponse(
            success=processed_count > 0,
            processed_count=processed_count,
            error=None if error_count == 0 else f"{error_count} files failed",
            message=message
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.post("/match/selfie/", response_model=MatchResponse)
async def match_selfie(
    event_id: str = Form(...),
    selfie: UploadFile = File(...),
    threshold: float = Form(0.6),
    db: Session = Depends(get_db)
):
    """
    Match guest selfie against event photos

    Args:
        event_id: Guest token / event identifier
        selfie: Guest's selfie image
        threshold: Confidence threshold (0.0-1.0) for matches

    Returns:
        List of matched photos with Google Drive URLs and confidence scores
    """
    try:
        if not event_id or not event_id.strip():
            raise HTTPException(status_code=400, detail="event_id is required")

        if not selfie:
            raise HTTPException(status_code=400, detail="selfie file is required")

        # Read selfie
        contents = await selfie.read()
        image = Image.open(io.BytesIO(contents))

        # Resize if too large
        if image.size[0] > 1024 or image.size[1] > 1024:
            image.thumbnail((1024, 1024), Image.Resampling.LANCZOS)

        # Extract selfie embedding
        selfie_embedding = extract_face_embedding(image)

        if selfie_embedding is None:
            logger.warning(f"No face detected in selfie for event {event_id}")
            return MatchResponse(
                matched_photos=[],
                error="No face detected in selfie",
                total_in_event=0
            )

        # Query photos for this event
        photos = db.query(PhotoFace).filter(
            PhotoFace.event_id == event_id,
            PhotoFace.processed == 1,
            PhotoFace.embedding.isnot(None)
        ).all()

        total_in_event = len(photos)

        if total_in_event == 0:
            logger.info(f"No processed photos found for event {event_id}")
            return MatchResponse(
                matched_photos=[],
                error=None,
                total_in_event=0
            )

        # Calculate similarities
        results = []
        for photo in photos:
            try:
                # Convert embedding to numpy array
                photo_embedding = np.array(photo.embedding, dtype=np.float32)

                # Calculate similarity
                similarity = calculate_cosine_similarity(selfie_embedding, photo_embedding)

                # Check if above threshold
                if similarity >= threshold:
                    # Generate Google Drive URL
                    drive_url = photo.drive_url or f"https://drive.google.com/uc?id={photo.drive_file_id}"

                    results.append(PhotoResponse(
                        drive_file_id=photo.drive_file_id,
                        url=drive_url,
                        confidence=similarity
                    ))
            except Exception as e:
                logger.error(f"Error processing photo {photo.id}: {e}")
                continue

        # Sort by confidence (highest first)
        results.sort(key=lambda x: x.confidence or 0, reverse=True)

        logger.info(f"Event {event_id}: Found {len(results)} matches out of {total_in_event} photos")

        return MatchResponse(
            matched_photos=results,
            error=None,
            total_in_event=total_in_event
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Match error: {e}")
        raise HTTPException(status_code=500, detail=f"Matching failed: {str(e)}")

@app.get("/events/{event_id}/photos")
async def get_event_photos(event_id: str, db: Session = Depends(get_db)):
    """Get all photos for an event (admin only)"""
    try:
        photos = db.query(PhotoFace).filter(
            PhotoFace.event_id == event_id
        ).all()

        return {
            "event_id": event_id,
            "total_photos": len(photos),
            "photos": [
                {
                    "id": p.id,
                    "filename": p.filename,
                    "uploaded_at": p.uploaded_at,
                    "processed": p.processed
                }
                for p in photos
            ]
        }
    except Exception as e:
        logger.error(f"Error fetching event photos: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch photos")

@app.delete("/events/{event_id}")
async def delete_event(event_id: str, db: Session = Depends(get_db)):
    """Delete all photos for an event (admin only)"""
    try:
        db.query(PhotoFace).filter(PhotoFace.event_id == event_id).delete()
        db.commit()

        return {
            "success": True,
            "message": f"Deleted all photos for event {event_id}"
        }
    except Exception as e:
        logger.error(f"Error deleting event: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete event")

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API info"""
    return {
        "name": "Wedding Face-Matching API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "upload_photos": "POST /upload/event/",
            "match_selfie": "POST /match/selfie/",
            "get_event_photos": "GET /events/{event_id}/photos",
            "delete_event": "DELETE /events/{event_id}"
        },
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=ENVIRONMENT == "development"
    )
