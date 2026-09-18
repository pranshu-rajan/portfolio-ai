from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

class InquiryCreate(BaseModel):
    from_email: EmailStr
    subject: str = Field(..., min_length=2, max_length=200)
    message: str = Field(..., min_length=5, max_length=5000)

class InquiryResponse(BaseModel):
    id: str
    from_email: str
    subject: str
    status: str
    created_at: datetime
    message_receipt: str = "Message successfully received and stored in database."
