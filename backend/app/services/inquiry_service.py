import logging
from app.models.inquiry import RecruiterInquiry
from app.schemas.inquiry import InquiryCreate, InquiryResponse

logger = logging.getLogger(__name__)

class InquiryService:
    @staticmethod
    async def create_inquiry(inquiry_in: InquiryCreate, client_ip: str = None) -> InquiryResponse:
        inquiry = RecruiterInquiry(
            from_email=str(inquiry_in.from_email),
            subject=inquiry_in.subject,
            message=inquiry_in.message,
            sender_ip=client_ip
        )
        try:
            await inquiry.insert()
            logger.info(f"Saved recruiter inquiry from {inquiry.from_email} to MongoDB.")
        except Exception as e:
            logger.warning(f"Failed to persist inquiry to MongoDB: {e}")

        return InquiryResponse(
            id=str(getattr(inquiry, "id", "local-id")),
            from_email=inquiry.from_email,
            subject=inquiry.subject,
            status="received",
            created_at=inquiry.created_at
        )
