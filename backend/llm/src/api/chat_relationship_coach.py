from fastapi import APIRouter

from schemas.chat_relationship_coach import (
    ChatRelationshipCoachRequest,
    ChatRelationshipCoachResponse,
)
from services.chat_relationship_coach_service import chat_relationship_coach_service

router = APIRouter(
    tags=["Relationship Coach"],
)


@router.post(
    "/chat-relationship-coach",
    summary="관계 코치 챗봇",
    description="연애/관계 고민에 특화된 AI 코치 챗봇 API입니다.",
)
def chat_relationship_coach_endpoint(request: ChatRelationshipCoachRequest):
    response = chat_relationship_coach_service.run(request.messages, request.model)
    return ChatRelationshipCoachResponse(response=response)
