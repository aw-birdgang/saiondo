from fastapi import APIRouter
from schemas.labeling_trait_vector import (
    LabelingTraitVectorRequest, LabelingTraitVectorResponse
)
from services.labeling_trait_vector_service import LabelingTraitVectorService

router = APIRouter()

@router.post("/labeling_trait_vector", response_model=LabelingTraitVectorResponse, tags=["LabelingTraitVector"])
def labeling_trait_vector(request: LabelingTraitVectorRequest):
    """
    메시지 히스토리 기반 라벨링 + 성향 벡터 + 분석 요약 통합
    """
    return LabelingTraitVectorService.label_trait_vector(request)
