from typing import List, Optional
from datetime import datetime, timezone
from beanie import Document
from pydantic import Field

class ProjectDocument(Document):
    slug: str = Field(unique=True, index=True)
    title: str
    tagline: str
    category: str = Field(index=True)
    description: str
    highlights: List[str]
    technologies: List[str] = Field(default_factory=list, index=True)
    live_url: Optional[str] = None
    github_url: Optional[str] = None
    featured: bool = Field(default=False, index=True)
    stars: int = 1
    role: str
    timeline: str = "2026"
    metrics: Optional[str] = None
    accent_color: str = "#8b5cf6"
    preview_gradient: str = "from-purple-600 to-blue-600"
    icon: str = "Bot"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "projects"
        indexes = [
            "slug",
            "category",
            "featured",
            "technologies"
        ]
