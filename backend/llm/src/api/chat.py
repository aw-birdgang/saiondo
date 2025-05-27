from fastapi import APIRouter
from schemas.chat import ChatRequest, ChatResponse, ChatHistoryRequest
from services.chat_service import chat_service

router = APIRouter()

@router.post("/chat", response_model=ChatResponse, summary="LLM 프롬프트 전송")
def chat(request: ChatRequest):
    response = chat_service.chat(request.prompt, request.model)
    return ChatResponse(response=response)

@router.post("/chat-history", response_model=ChatResponse, summary="LLM 대화 히스토리 전송")
def chat_history(request: ChatHistoryRequest):
    response = chat_service.chat_history(request.messages, request.model)
    return ChatResponse(response=response)
