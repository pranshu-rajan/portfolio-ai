from typing import Optional
from fastapi import APIRouter, HTTPException, Query, status
from app.schemas.project import ProjectOut, ProjectListResponse
from app.services.project_service import ProjectService

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.get("", response_model=ProjectListResponse)
async def list_projects(
    category: Optional[str] = Query(None, description="Filter by category (Full Stack, AI & ML, Systems & Tools)"),
    featured: Optional[bool] = Query(None, description="Filter by featured flag")
):
    """List all portfolio projects with optional category/featured filtering."""
    return await ProjectService.get_all_projects(category=category, featured=featured)

@router.get("/{slug}", response_model=ProjectOut)
async def get_project(slug: str):
    """Retrieve details for a single project by unique slug."""
    project = await ProjectService.get_project_by_slug(slug)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with slug '{slug}' not found."
        )
    return project
