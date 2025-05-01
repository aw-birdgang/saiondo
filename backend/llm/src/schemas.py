from pydantic import BaseModel
from typing import Literal

class ChatRequest(BaseModel):
    prompt: str
    model: Literal['openai', 'claude']  # LLM 선택

class ChatResponse(BaseModel):
    response: str
