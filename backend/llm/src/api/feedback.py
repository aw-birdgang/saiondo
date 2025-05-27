from fastapi import APIRouter
from schemas.feedback import FeedbackRequest, FeedbackResponse, FeedbackHistoryRequest
from services.feedback_service import feedback_service

router = APIRouter()

@router.post("/feedback", response_model=FeedbackResponse, summary="LLM 피드백 요청")
def feedback(request: FeedbackRequest):
    response = feedback_service.feedback(request.message, request.roomId, request.model)
    return FeedbackResponse(response=response)

@router.post("/feedback-history", response_model=FeedbackResponse, summary="히스토리 기반 LLM 피드백 요청")
def feedback_history(request: FeedbackHistoryRequest):
    response = feedback_service.feedback_history(request.messages, request.model)
    return FeedbackResponse(response=response)
