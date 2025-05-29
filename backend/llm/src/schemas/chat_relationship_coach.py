from pydantic import BaseModel
from typing import Any, Dict, List, Literal

class LLMMessage(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str

class ChatRelationshipCoachRequest(BaseModel):
    messages: List[LLMMessage]
    model: Literal["openai", "claude"] = "openai"

class ChatRelationshipCoachResponse(BaseModel):
    response: str
