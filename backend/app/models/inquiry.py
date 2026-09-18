from typing import Optional
from datetime import datetime, timezone
from beanie import Document
from pydantic import Field, EmailStr

class RecruiterInquiry(Document):
    from_email: str
    subject: str
    message: str
    status: str = Field(default="received", index=True)  # "received" | "reviewed" | "responded"
    sender_ip: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "inquiries"
