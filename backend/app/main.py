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


# Root Welcome Endpoint
@app.get("/", include_in_schema=False)
async def root():
    return {
        "service": "Pranshu Rajan Portfolio & AI Twin API",
        "status": "online",
        "docs": "/docs",
        "health": "/health",
        "version": "1.0.0"
    }

# Health Checks

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
