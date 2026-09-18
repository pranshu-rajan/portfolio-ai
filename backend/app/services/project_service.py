from typing import List, Optional
from app.models.project import ProjectDocument
from app.schemas.project import ProjectOut, ProjectListResponse

class ProjectService:
    @staticmethod
    async def get_all_projects(category: Optional[str] = None, featured: Optional[bool] = None) -> ProjectListResponse:
        query = {}
        if category and category.lower() != "all":
            query["category"] = category
        if featured is not None:
            query["featured"] = featured

        projects = await ProjectDocument.find(query).to_list()
        
        project_outs = [
            ProjectOut(
                slug=p.slug,
                title=p.title,
                tagline=p.tagline,
                category=p.category,
                description=p.description,
                highlights=p.highlights,
                technologies=p.technologies,
                live_url=p.live_url,
                github_url=p.github_url,
                featured=p.featured,
                stars=p.stars,
                role=p.role,
                timeline=p.timeline,
                metrics=p.metrics,
                accent_color=p.accent_color,
                preview_gradient=p.preview_gradient,
                icon=p.icon
            )
            for p in projects
        ]
        return ProjectListResponse(total=len(project_outs), projects=project_outs)

    @staticmethod
    async def get_project_by_slug(slug: str) -> Optional[ProjectOut]:
        p = await ProjectDocument.find_one(ProjectDocument.slug == slug)
        if not p:
            return None
        return ProjectOut(
            slug=p.slug,
            title=p.title,
            tagline=p.tagline,
            category=p.category,
            description=p.description,
            highlights=p.highlights,
            technologies=p.technologies,
            live_url=p.live_url,
            github_url=p.github_url,
            featured=p.featured,
            stars=p.stars,
            role=p.role,
            timeline=p.timeline,
            metrics=p.metrics,
            accent_color=p.accent_color,
            preview_gradient=p.preview_gradient,
            icon=p.icon
        )
