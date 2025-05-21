from pydantic import BaseModel
from typing import Literal

class ChatRequest(BaseModel):
    prompt: str
    model: Literal['openai', 'claude'] = 'openai'

class ChatResponse(BaseModel):
    response: str
