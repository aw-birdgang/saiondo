from fastapi import APIRouter
from mcp.context import MCPContext
from graph.love_analysis_graph import build_graph
from schemas import (
    ChatRequest, ChatResponse,
    FeedbackRequest, FeedbackResponse
)
from llm import ask_llm, feedback_llm

router = APIRouter()
graph = build_graph()

@router.post("/chat", response_model=ChatResponse, summary="LLM 프롬프트 전송")
def chat(request: ChatRequest):
    response = ask_llm(request.prompt, request.model)
    return ChatResponse(response=response)

@router.post("/feedback", response_model=FeedbackResponse, summary="LLM 피드백 요청")
def feedback(request: FeedbackRequest):
    response = feedback_llm(request.message, request.roomId, request.model)
    return FeedbackResponse(response=response)

@router.get("/health", summary="서버 헬스 체크")
def health_check():
    return {"status": "ok", "message": "LLM 서버 정상 작동 중 💪"}

@router.post("/analyze")
def analyze_love(ctx: MCPContext):
    result = graph.invoke(ctx)
    return {
        "user_traits": result["metadata"]["user_traits"],
        "match_result": result["metadata"]["match_result"],
        "advice": result["metadata"]["advice"]
    }
