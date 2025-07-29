from typing import Optional

from pydantic import BaseModel


class MCPContext(BaseModel):
    user_prompt: str
    partner_prompt: str
    user_gender: str  # 'male' or 'female'
    partner_gender: str
    model: str = "claude"  # or openai
    metadata: Optional[dict] = {}
