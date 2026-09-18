import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import db
from app.routers import (
    chat_router,
    projects_router,
    candidate_router,
    inquiries_router
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Initializing FastAPI application services...")
    await db.connect()

    # Auto-seed MongoDB Atlas if empty
    try:
        from app.models.project import ProjectDocument
        count = await ProjectDocument.count()
        if count == 0:
            logger.info("MongoDB database is empty. Auto-seeding projects & candidate profile...")
            from scripts.seed_db import seed_collections
            await seed_collections()
            logger.info("Auto-seeding completed.")
    except Exception as e:
        logger.warning(f"Startup auto-seed check skipped: {e}")

    yield
    # Shutdown
    logger.info("Shutting down application services...")
    await db.disconnect()

app = FastAPI(
    title="Pranshu Rajan Portfolio & AI Twin API",
    description="Scalable asynchronous FastAPI backend with MongoDB and Groq LPU inference.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
origins = settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else ["*"]
allow_all = "*" in origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if not allow_all else ["*"],
    allow_origin_regex=r"https://.*\.vercel\.app" if not allow_all else None,
    allow_credentials=not allow_all,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root & Info Endpoints
@app.get("/", include_in_schema=False)
@app.get("/api", include_in_schema=False)
async def root():
    return {
        "service": "Pranshu Rajan Portfolio & AI Twin API",
        "status": "online",
        "docs": "/docs",
        "health": "/health",
        "endpoints": {
            "projects": "/api/v1/projects",
            "candidate": "/api/v1/candidate",
            "chat": "/api/v1/chat",
            "inquiries": "/api/v1/inquiries",
            "seed": "/api/v1/seed"
        },
        "version": "1.0.0"
    }

# One-Click Database Seeding Endpoint
@app.get("/api/v1/seed", tags=["Database Seeding"])
async def trigger_seed():
    """Manually triggers seeding of verified projects & candidate profile into MongoDB."""
    from scripts.seed_db import seed_collections
    count = await seed_collections()
    return {
        "status": "success",
        "message": f"Successfully seeded {count} projects and candidate profile into MongoDB Atlas.",
        "projects_endpoint": "/api/v1/projects",
        "candidate_endpoint": "/api/v1/candidate"
    }


@app.get("/health", tags=["Health"])
@app.get("/api/v1/health", tags=["Health"])
async def health_check():
    db_ok = await db.ping()
    return {
        "status": "healthy",
        "service": "pranshu-portfolio-api",
        "database": "connected" if db_ok else "disconnected",
        "environment": settings.ENVIRONMENT
    }

# Include API v1 Routers
app.include_router(chat_router, prefix="/api/v1")
app.include_router(projects_router, prefix="/api/v1")
app.include_router(candidate_router, prefix="/api/v1")
app.include_router(inquiries_router, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
