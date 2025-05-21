from fastapi import APIRouter
from schemas.feedback import FeedbackRequest, FeedbackResponse
from services.feedback_service import feedback_service

router = APIRouter()

@router.post("/feedback", response_model=FeedbackResponse, summary="LLM 피드백 요청")
def feedback(request: FeedbackRequest):
    response = feedback_service.feedback(request.message, request.roomId, request.model)
    return FeedbackResponse(response=response)
