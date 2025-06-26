from pydantic import BaseModel
from typing import List, Optional, Dict, Any

# 입력 메시지
class ChatMessage(BaseModel):
    sender: str  # "male", "female", "other"
    text: str

class LabelingTraitVectorRequest(BaseModel):
    user_id: Optional[str] = None
    messages: List[ChatMessage]

# 메시지별 라벨링 결과
class LabeledMessage(BaseModel):
    sender: str
    text: str
    labels: Dict[str, Any]

# TraitVector (성향 벡터)
class TraitVector(BaseModel):
    user_id: Optional[str] = None
    message_count: int

    affection_level: float
    gratitude_level: float
    frustration_level: float
    anxiety_level: float
    jealousy_level: float
    loneliness_level: float
    sadness_level: float
    resentment_level: float

    request_tendency: float
    complaint_tendency: float
    expectation_level: float
    boundaries_level: float
    reproach_level: float
    accommodation_level: float
    withdrawal_level: float
    confrontation_level: float
    reconnection_attempts: int

    explanation_ratio: float
    questioning_rate: float
    silence_ratio: float
    meta_conversation_ratio: float
    passive_aggressive_ratio: float
    repetition_ratio: float

    secure_ratio: float
    anxious_ratio: float
    avoidant_ratio: float
    fearful_ratio: float
    ambivalent_ratio: float
    attachment_style: str

    dominant_emotion: str
    dominant_communication: str
    emotional_stability_score: float
    expression_openness_score: float

# 최종 API 응답
class LabelingTraitVectorResponse(BaseModel):
    labeled_messages: List[LabeledMessage]
    trait_vector: TraitVector
    summary: Dict[str, Any]  # 분석 요약 결과 (텍스트 또는 dict)
