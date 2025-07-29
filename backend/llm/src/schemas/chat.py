from typing import List, Literal

from pydantic import BaseModel


class ChatRequest(BaseModel):
    prompt: str
    model: Literal["openai", "claude"] = "openai"


class LLMMessage(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str


class ChatHistoryRequest(BaseModel):
    messages: List[LLMMessage]
    model: Literal["openai", "claude"]


class ChatResponse(BaseModel):
    response: str
