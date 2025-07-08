from fastapi import APIRouter

router = APIRouter(tags=["Health"])

@router.get(
    "/health",
    summary="서버 헬스 체크",
    description="서버의 상태를 확인할 수 있는 헬스체크 API입니다."
)
def health_check():
    return {"status": "ok", "message": "LLM 서버 정상 작동 중 💪"}
