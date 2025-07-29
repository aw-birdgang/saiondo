from fastapi import APIRouter

from schemas.couple_analysis import CoupleAnalysisRequest, CoupleAnalysisResponse
from services.couple_analysis_service import couple_analysis_service

router = APIRouter(
    tags=["Couple Analysis"],
)


@router.post(
    "/couple-analysis",
    summary="기본 커플 분석",
    description="두 사람의 프로필(간단 정보, 프롬프트 등) 기반으로 커플 궁합/관계 분석을 수행하는 API입니다.",
)
def couple_analysis(request: CoupleAnalysisRequest):
    response = couple_analysis_service.analyze(request.prompt)
    return CoupleAnalysisResponse(response=response)
