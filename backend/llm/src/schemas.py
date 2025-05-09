from pydantic import BaseModel
from typing import Literal

class ChatRequest(BaseModel):
    prompt: str
    model: Literal['openai', 'claude']  # LLM 선택

class ChatResponse(BaseModel):
    response: str

# 신규: FeedbackRequest/FeedbackResponse
class FeedbackRequest(BaseModel):
    message: str
    roomId: str
    model: Literal['openai', 'claude'] = 'openai'  # 기본값 openai

class FeedbackResponse(BaseModel):
    response: str
