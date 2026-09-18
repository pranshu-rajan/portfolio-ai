from fastapi import APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.ai_service import AIService

router = APIRouter(prefix="/chat", tags=["AI Twin Chat"])

@router.post("", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """Generates a grounded answer representing Pranshu Rajan."""
    try:
        result = await AIService.generate_answer(
            question=request.question,
            session_id=request.session_id
        )
        return ChatResponse(
            answer=result["answer"],
            suggested_follow_ups=result.get("suggested_follow_ups", []),
            session_id=request.session_id,
            model_used=result.get("model_used", "openai/gpt-oss-120b")
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chat inference failed: {str(e)}"
        )

@router.post("/stream")
async def chat_stream_endpoint(request: ChatRequest):
    """Streams real-time answer tokens via Server-Sent Events (SSE)."""
    try:
        return StreamingResponse(
            AIService.stream_answer(request.question),
            media_type="text/event-stream"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Stream generation failed: {str(e)}"
        )
