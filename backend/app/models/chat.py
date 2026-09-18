from typing import List, Optional
from datetime import datetime, timezone
from beanie import Document
from pydantic import BaseModel, Field

class MessageItem(BaseModel):
    role: str  # "user" | "assistant" | "system"
    content: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    suggested_follow_ups: Optional[List[str]] = None

class ChatSession(Document):
    session_id: str = Field(unique=True, index=True)
    messages: List[MessageItem] = Field(default_factory=list)
    client_ip: Optional[str] = None
    user_agent: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "chat_sessions"
