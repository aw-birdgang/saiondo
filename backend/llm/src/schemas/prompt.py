from typing import Literal

from pydantic import BaseModel


class PromptRequest(BaseModel):
    prompt: str
    model: Literal["openai", "claude"] = "openai"


class PromptResponse(BaseModel):
    response: str
