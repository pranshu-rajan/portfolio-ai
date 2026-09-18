from app.routers.chat import router as chat_router
from app.routers.projects import router as projects_router
from app.routers.candidate import router as candidate_router
from app.routers.inquiries import router as inquiries_router

__all__ = [
    "chat_router",
    "projects_router",
    "candidate_router",
    "inquiries_router"
]
