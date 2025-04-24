from typing import Optional, List, Dict
from pydantic import BaseModel, Field

class ChatMessage(BaseModel):
    role: str = Field(..., description="메시지 작성자 (user 또는 assistant)")
    content: str = Field(..., description="메시지 내용")

class ChatInput(BaseModel):
    message: str = Field(..., description="사용자 메시지")
    history: Optional[List[Dict[str, str]]] = Field(
        default_factory=list,
        description="대화 기록"
    )

class ChatResponse(BaseModel):
    response: str = Field(..., description="AI 응답")
    sentiment: str = Field(..., description="감정 분석 결과")
    history: List[Dict[str, str]] = Field(..., description="업데이트된 대화 기록")
    end: bool = Field(..., description="대화 종료 여부")

class ErrorResponse(BaseModel):
    error: str = Field(..., description="에러 메시지")
    details: Optional[Dict] = Field(default_factory=dict, description="추가 에러 정보")