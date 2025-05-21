from fastapi import APIRouter
from schemas.couple_analysis import CoupleAnalysisRequest, CoupleAnalysisResponse
from services.couple_analysis_service import couple_analysis_service

router = APIRouter()

@router.post("/couple-analysis", response_model=CoupleAnalysisResponse, summary="커플 분석 프롬프트 전달 및 결과 반환")
def couple_analysis(request: CoupleAnalysisRequest):
    response = couple_analysis_service.analyze(request.prompt)
    return CoupleAnalysisResponse(response=response)
