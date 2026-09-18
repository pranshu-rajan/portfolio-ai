from typing import List, Optional
from pydantic import BaseModel

class ProjectOut(BaseModel):
    slug: str
    title: str
    tagline: str
    category: str
    description: str
    highlights: List[str]
    technologies: List[str]
    live_url: Optional[str] = None
    github_url: Optional[str] = None
    featured: bool
    stars: int
    role: str
    timeline: str
    metrics: Optional[str] = None
    accent_color: str
    preview_gradient: str
    icon: str

class ProjectListResponse(BaseModel):
    total: int
    projects: List[ProjectOut]
