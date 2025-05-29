from fastapi import APIRouter
from schemas.chat_relationship_coach import ChatRelationshipCoachRequest, ChatRelationshipCoachResponse
from services.chat_relationship_coach_service import chat_relationship_coach_service

router = APIRouter()

@router.post("/chat-relationship-coach", response_model=ChatRelationshipCoachResponse)
def chat_relationship_coach_endpoint(request: ChatRelationshipCoachRequest):
    response = chat_relationship_coach_service.run(
        request.messages,
        request.model
    )
    return ChatRelationshipCoachResponse(response=response)
