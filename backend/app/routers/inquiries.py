from fastapi import APIRouter, Request, status
from app.schemas.inquiry import InquiryCreate, InquiryResponse
from app.services.inquiry_service import InquiryService

router = APIRouter(prefix="/inquiries", tags=["Recruiter Inquiries"])

@router.post("", response_model=InquiryResponse, status_code=status.HTTP_201_CREATED)
async def submit_inquiry(inquiry: InquiryCreate, request: Request):
    """Submits a recruiter outreach inquiry from the portfolio Mail app."""
    client_ip = request.client.host if request.client else None
    return await InquiryService.create_inquiry(inquiry, client_ip=client_ip)
