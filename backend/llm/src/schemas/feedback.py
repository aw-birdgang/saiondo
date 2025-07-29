from typing import Literal

from pydantic import BaseModel


class Message(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str


class FeedbackRequest(BaseModel):
    message: str
    roomId: str
    model: Literal["openai", "claude"] = "openai"


class FeedbackResponse(BaseModel):
    response: str


class FeedbackHistoryRequest(BaseModel):
    messages: list
    roomId: str
