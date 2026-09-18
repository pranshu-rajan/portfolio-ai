import json
from pathlib import Path
from fastapi import APIRouter, HTTPException, status
from app.models.candidate import CandidateProfile

router = APIRouter(prefix="/candidate", tags=["Candidate Profile"])

@router.get("")
async def get_candidate_profile():
    """Retrieve full verified profile of Pranshu Rajan."""
    profile = await CandidateProfile.find_one()
    if profile:
        return profile.model_dump(mode="json")

    # Fallback to local resume.json if database has not been seeded yet
    candidate_paths = [
        Path(__file__).resolve().parents[3] / "src" / "data" / "resume.json",
        Path(__file__).resolve().parents[2] / "src" / "data" / "resume.json",
        Path("/app/src/data/resume.json"),
        Path(__file__).resolve().parents[1] / "data" / "resume.json"
    ]
    for p in candidate_paths:
        if p.exists():
            try:
                with open(p, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                pass

    # Verified fallback candidate profile
    return {
        "name": "Pranshu Rajan",
        "title": "Full Stack Developer & AI Engineer",
        "email": "pranshurajan9211@gmail.com",
        "phone": "+91 9316347270",
        "location": "Ahmedabad, Gujarat, India",
        "github": "https://github.com/pranshu-rajan",
        "linkedin": "https://www.linkedin.com/in/pranshu-rajan/",
        "summary": "Full Stack Developer and AI Engineer passionate about building high-performance web systems, custom vector databases, offline P2P payment architectures, and deep packet inspection tools.",
        "skills_categories": {
            "Languages": ["JavaScript", "TypeScript", "Python", "C++17", "Java", "SQL"],
            "Frontend": ["React.js", "Next.js", "Tailwind CSS", "Framer Motion"],
            "Backend": ["FastAPI", "Node.js", "Spring Boot", "REST APIs"],
            "Databases": ["MongoDB", "PostgreSQL", "SQLite"],
            "AI/ML": ["RAG", "HNSW Indexing", "BM25", "Groq LPU", "PyTorch"]
        }
    }

