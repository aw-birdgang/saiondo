from fastapi import APIRouter
from schemas.prompt import PromptRequest, PromptResponse
from services.prompt_service import prompt_service

router = APIRouter()

@router.post("/prompt", response_model=PromptResponse, summary="LLM 프롬프트 전송")
def prompt(request: PromptRequest):
    response = prompt_service.prompt(request.prompt, request.model)
    return PromptResponse(response=response)
