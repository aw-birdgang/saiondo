from fastapi import APIRouter
from schemas.feedback import FeedbackRequest, FeedbackResponse, FeedbackHistoryRequest
from services.feedback_service import feedback_service

router = APIRouter(
    tags=["Feedback"],
)

@router.post(
    "/feedback",
    summary="피드백 제출",
    description="사용자 피드백(만족도, 개선점 등)을 수집하고 저장하는 API입니다."
)
def submit_feedback(request: FeedbackRequest):
    response = feedback_service.feedback(request.message, request.roomId, request.model)
    return FeedbackResponse(response=response)

@router.post("/feedback-history", response_model=FeedbackResponse, summary="히스토리 기반 LLM 피드백 요청")
def feedback_history(request: FeedbackHistoryRequest):
    response = feedback_service.feedback_history(request.messages, request.model)
    return FeedbackResponse(response=response)
