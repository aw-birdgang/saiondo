from pydantic import BaseModel
from typing import List, Optional, Literal

class CoupleAnalysisRequest(BaseModel):
    user1_name: str
    user1_mbti: str
    user1_gender: str
    user2_name: str
    user2_mbti: str
    user2_gender: str
    anniversary: Optional[str] = None
    keywords: Optional[List[str]] = []
    relationship_months: Optional[int] = None
    model: Literal['openai', 'claude'] = 'openai'

class CoupleAnalysisResponse(BaseModel):
    summary: str
    advice: str
    persona1: str
    persona2: str
    keywords: List[str]
