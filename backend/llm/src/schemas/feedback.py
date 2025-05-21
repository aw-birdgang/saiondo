from pydantic import BaseModel
from typing import Literal

class FeedbackRequest(BaseModel):
    message: str
    roomId: str
    model: Literal['openai', 'claude'] = 'openai'

class FeedbackResponse(BaseModel):
    response: str
