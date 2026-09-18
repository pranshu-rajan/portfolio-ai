from typing import Optional, Dict, Any
from datetime import datetime, timezone
from beanie import Document
from pydantic import Field

class AnalyticsEvent(Document):
    event_type: str = Field(index=True)  # "page_view" | "project_click" | "ai_query" | "resume_download"
    resource_id: Optional[str] = None
    query: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "analytics_events"
