from typing import List, Literal

from pydantic import BaseModel


class LLMMessage(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str


class ChatRelationshipCoachRequest(BaseModel):
    messages: List[LLMMessage]
    model: Literal["openai", "claude"] = "openai"


class ChatRelationshipCoachResponse(BaseModel):
    response: str
