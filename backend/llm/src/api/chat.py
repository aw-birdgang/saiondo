from fastapi import APIRouter
from schemas.chat import ChatRequest, ChatResponse
from services.chat_service import chat_service

router = APIRouter()

@router.post("/chat", response_model=ChatResponse, summary="LLM 프롬프트 전송")
def chat(request: ChatRequest):
    response = chat_service.chat(request.prompt, request.model)
    return ChatResponse(response=response)
