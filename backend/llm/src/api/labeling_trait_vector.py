from fastapi import APIRouter
from schemas.labeling_trait_vector import (
    LabelingTraitVectorRequest, LabelingTraitVectorResponse
)
from services.labeling_trait_vector_service import LabelingTraitVectorService

router = APIRouter(tags=["Labeling Trait Vector"])

@router.post(
    "/labeling-trait-vector",
    summary="성향 벡터 라벨링",
    description="성향 벡터(특성치) 기반 라벨링 기능을 제공하는 API입니다."
)
def labeling_trait_vector(request: LabelingTraitVectorRequest):
    """
    메시지 히스토리 기반 라벨링 + 성향 벡터 + 분석 요약 통합
    """
    return LabelingTraitVectorService.label_trait_vector(request)
