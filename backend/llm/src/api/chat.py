from fastapi import APIRouter

from schemas.chat import ChatHistoryRequest, ChatRequest, ChatResponse
from services.chat_service import chat_service

router = APIRouter(
    tags=["AI Chat"],
)


@router.post(
    "/chat",
    summary="LLM 프롬프트 채팅",
    description="OpenAI, Claude 등 LLM에 프롬프트를 보내고 답변을 받는 일반 챗봇 API입니다.",
)
def chat(request: ChatRequest):
    response = chat_service.chat(request.prompt, request.model)
    return ChatResponse(response=response)


@router.post(
    "/chat-history",
    summary="LLM 대화 히스토리 채팅",
    description="대화 히스토리(메시지 목록)를 LLM에 보내고 답변을 받는 API입니다.",
)
def chat_history(request: ChatHistoryRequest):
    print("LLM에 전달된 messages:", request.messages)
    response = chat_service.chat_history(request.messages, request.model)
    return ChatResponse(response=response)
