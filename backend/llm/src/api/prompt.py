from typing import Any, Dict

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.llm_provider import llm_provider

router = APIRouter(prefix="/prompt", tags=["prompt"])


class PromptRequest(BaseModel):
    prompt: str
    model: str = "openai"


@router.post("/ask")
async def ask_prompt(request: PromptRequest) -> Dict[str, Any]:
    try:
        response = llm_provider.ask(request.prompt, request.model)
        return {"response": response, "model": request.model}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
