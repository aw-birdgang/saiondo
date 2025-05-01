from fastapi import APIRouter
from schemas import ChatRequest, ChatResponse
from llm import ask_llm

router = APIRouter()

@router.post("/chat", response_model=ChatResponse, summary="LLM 프롬프트 전송")
def chat(request: ChatRequest):
    result = ask_llm(request.prompt)
    return ChatResponse(response=result)

@router.get("/health", summary="서버 헬스 체크")
def health_check():
    return {"status": "ok", "message": "LLM 서버 정상 작동 중 💪"}

@router.get("/health/live")
def liveness_check():
    return {"status": "alive"}

@router.get("/health/ready")
def readiness_check():
    # DB 연결, API 키 유효성 등 체크 가능
    return {"status": "ready"}
