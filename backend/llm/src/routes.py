from fastapi import APIRouter
from schemas import ChatRequest, ChatResponse
from llm import ask_llm

router = APIRouter()

@router.post("/chat", response_model=ChatResponse, summary="LLM에 메시지 보내기")
def chat(request: ChatRequest):
    result = ask_llm(request.prompt)
    return ChatResponse(response=result)
