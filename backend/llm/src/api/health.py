from typing import Any, Dict

from fastapi import APIRouter

router = APIRouter(prefix="/health", tags=["health"])


@router.get("/")
async def health_check() -> Dict[str, Any]:
    return {"status": "healthy", "message": "SAIONDO LLM Backend is running"}
