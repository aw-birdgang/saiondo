from fastapi import APIRouter
from schemas.couple_analysis import CoupleAnalysisRequest, CoupleAnalysisResponse
from services.couple_analysis_service import couple_analysis_service

router = APIRouter()

@router.post("/couple-analysis", response_model=CoupleAnalysisResponse, summary="커플 상태/페르소나/조언 분석")
def couple_analysis(request: CoupleAnalysisRequest):
    result = couple_analysis_service.analyze(request.dict())
    return CoupleAnalysisResponse(**result)
