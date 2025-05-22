from pydantic import BaseModel
from typing import Literal

class PromptRequest(BaseModel):
    prompt: str
    model: Literal['openai', 'claude'] = 'openai'

class PromptResponse(BaseModel):
    response: str
