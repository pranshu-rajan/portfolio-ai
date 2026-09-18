from typing import List, Optional
from pydantic import BaseModel, Field

class ChatRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=1000)
    session_id: Optional[str] = None
    stream: bool = False

class ChatResponse(BaseModel):
    answer: str
    suggested_follow_ups: List[str] = Field(default_factory=list)
    session_id: Optional[str] = None
    model_used: str = "openai/gpt-oss-120b"

class StreamChunk(BaseModel):
    token: str
    done: bool = False
    suggested_follow_ups: Optional[List[str]] = None
