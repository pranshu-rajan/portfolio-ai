from app.models.candidate import CandidateProfile
from app.models.project import ProjectDocument
from app.models.chat import ChatSession, MessageItem
from app.models.inquiry import RecruiterInquiry
from app.models.analytics import AnalyticsEvent

ALL_MODELS = [
    CandidateProfile,
    ProjectDocument,
    ChatSession,
    RecruiterInquiry,
    AnalyticsEvent
]

__all__ = [
    "CandidateProfile",
    "ProjectDocument",
    "ChatSession",
    "MessageItem",
    "RecruiterInquiry",
    "AnalyticsEvent",
    "ALL_MODELS"
]
