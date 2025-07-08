from fastapi import APIRouter
from schemas.prompt import PromptRequest, PromptResponse
from services.prompt_service import prompt_service

router = APIRouter(
    tags=["Prompt"],
)

@router.post(
    "/prompt",
    summary="프롬프트 관리",
    description="프롬프트 등록, 조회 등 프롬프트 관리를 위한 API입니다."
)
def prompt(request: PromptRequest):
    response = prompt_service.prompt(request.prompt, request.model)
    return PromptResponse(response=response)
