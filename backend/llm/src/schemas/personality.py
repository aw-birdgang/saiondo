# backend/llm/src/schemas/personality.py
from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional

# 공통 메시지 타입
class Message(BaseModel):
    sender: str = Field(..., description="메시지 발신자")
    text: str = Field(..., description="메시지 내용")

# 대화 기반 성향 분석
class AnalyzeConversationRequest(BaseModel):
    userId: str = Field(..., description="분석 대상 userId", example="user-uuid")
    partnerId: Optional[str] = Field(None, description="상대 userId", example="partner-uuid")
    messages: List[Message] = Field(..., description="대화 메시지 배열")

class AnalyzeConversationResponse(BaseModel):
    personalityTraits: Dict[str, Any] = Field(..., description="성향 분석 결과")
    feedback: str = Field(..., description="피드백")
    score: float = Field(..., description="신뢰도 점수", ge=0.0, le=1.0)

# MBTI 분석
class AnalyzeMbtiRequest(BaseModel):
    userId: str = Field(..., description="분석 대상 userId", example="user-uuid")
    data: Dict[str, Any] = Field(..., description="설문/대화 데이터")

class AnalyzeMbtiResponse(BaseModel):
    mbti: str = Field(..., description="MBTI 유형", example="INFP")
    description: str = Field(..., description="유형별 설명")
    match: Optional[Dict[str, Any]] = Field(None, description="궁합 정보")

# 소통 스타일 분석
class AnalyzeCommunicationRequest(BaseModel):
    userId: str = Field(..., description="분석 대상 userId", example="user-uuid")
    messages: List[Message] = Field(..., description="대화 데이터")

class AnalyzeCommunicationResponse(BaseModel):
    style: str = Field(..., description="소통 스타일", example="직접적/감정적")
    description: str = Field(..., description="설명")
    feedback: str = Field(..., description="개선 피드백")

# 사랑의 언어 분석
class AnalyzeLoveLanguageRequest(BaseModel):
    userId: str = Field(..., description="분석 대상 userId", example="user-uuid")
    data: Dict[str, Any] = Field(..., description="대화/행동 데이터")

class AnalyzeLoveLanguageResponse(BaseModel):
    mainLanguage: str = Field(..., description="주요 사랑의 언어", example="행동")
    description: str = Field(..., description="설명")
    match: Optional[Dict[str, Any]] = Field(None, description="호환성")

# 행동 패턴 분석
class AnalyzeBehaviorRequest(BaseModel):
    userId: str = Field(..., description="분석 대상 userId", example="user-uuid")
    data: Dict[str, Any] = Field(..., description="행동 데이터")

class AnalyzeBehaviorResponse(BaseModel):
    pattern: str = Field(..., description="주요 행동 패턴", example="야간 활동이 많음")
    description: str = Field(..., description="설명")
    recommendation: str = Field(..., description="추천")

# 감정 상태 분석
class AnalyzeEmotionRequest(BaseModel):
    userId: str = Field(..., description="분석 대상 userId", example="user-uuid")
    messages: List[Message] = Field(..., description="대화/상담 데이터")

class AnalyzeEmotionResponse(BaseModel):
    emotion: str = Field(..., description="감정 상태", example="스트레스")
    description: str = Field(..., description="설명")
    feedback: str = Field(..., description="피드백")

# 챗봇 기반 성향 탐지
class ChatbotDetectRequest(BaseModel):
    userId: str = Field(..., description="분석 대상 userId", example="user-uuid")
    messages: List[Message] = Field(..., description="챗봇 대화 데이터")

class ChatbotDetectResponse(BaseModel):
    detectedTraits: Dict[str, Any] = Field(..., description="탐지된 성향")
    feedback: str = Field(..., description="피드백")

# 성향 기반 피드백
class FeedbackRequest(BaseModel):
    userId: str = Field(..., description="대상 userId", example="user-uuid")
    partnerId: Optional[str] = Field(None, description="상대 userId", example="partner-uuid")
    data: Dict[str, Any] = Field(..., description="분석/상황 데이터")

class FeedbackResponse(BaseModel):
    feedback: str = Field(..., description="피드백 메시지")
    recommendation: Optional[str] = Field(None, description="추천/조언")