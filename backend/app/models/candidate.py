from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from beanie import Document
from pydantic import BaseModel, Field

class EducationItem(BaseModel):
    degree: str
    institution: str
    details: Optional[str] = None
    location: Optional[str] = None
    timeline: Optional[str] = None
    gpa_or_percentage: Optional[str] = None

class ExperienceItem(BaseModel):
    company: str
    role: str
    duration: Optional[str] = None
    timeline: Optional[str] = None
    location: Optional[str] = None
    bullets: List[str] = Field(default_factory=list)
    technologies: List[str] = Field(default_factory=list)

class LeadershipItem(BaseModel):
    role: str
    organization: str
    duration: Optional[str] = None
    timeline: Optional[str] = None
    bullets: List[str] = Field(default_factory=list)


class CandidateProfile(Document):
    name: str = "Pranshu Rajan"
    title: str = "Full Stack Developer & AI Engineer"
    email: str = "pranshurajan9211@gmail.com"
    phone: str = "+91 9316347270"
    location: str = "Ahmedabad, Gujarat, India"
    github: str = "https://github.com/pranshu-rajan"
    linkedin: str = "https://www.linkedin.com/in/pranshu-rajan/"
    summary: str
    skills_categories: Dict[str, List[str]]
    education: List[EducationItem]
    professional_experience: List[ExperienceItem]
    positions_of_responsibility: List[LeadershipItem]
    certifications: List[str]
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "candidates"
