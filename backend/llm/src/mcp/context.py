from pydantic import BaseModel
from typing import Optional

class MCPContext(BaseModel):
    user_prompt: str
    partner_prompt: str
    user_gender: str  # 'male' or 'female'
    partner_gender: str
    model: str = "claude"  # or openai
    metadata: Optional[dict] = {}
