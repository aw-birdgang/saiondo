import logging

from fastapi import APIRouter, BackgroundTasks, HTTPException

from schemas.enhanced_couple_analysis import (
    CoupleAnalysisBatchRequest,
    CoupleAnalysisBatchResponse,
)
from services.analysis_cache import AnalysisCache
from services.enhanced_couple_analysis_service import enhanced_couple_analysis_service

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Batch Analysis"])


@router.post(
    "/batch-couple-analysis",
    summary="배치 커플 분석",
    description="여러 커플 데이터를 한 번에 분석(배치)하는 API입니다. 대량 분석, 통계 등에 활용할 수 있습니다.",
)
def batch_couple_analysis(
    request: CoupleAnalysisBatchRequest, background_tasks: BackgroundTasks
):
    try:
        results = []
        success_count = 0

        for couple_data in request.couples:
            try:
                user_data = couple_data.get("user_data", {})
                partner_data = couple_data.get("partner_data", {})

                # 캐시 확인
                cache_key = f"{user_data.get('id', '')}_{partner_data.get('id', '')}"
                cached_result = AnalysisCache.get(cache_key)

                if cached_result:
                    results.append(cached_result)
                    success_count += 1
                else:
                    result = enhanced_couple_analysis_service.analyze_couple(
                        user_data, partner_data
                    )
                    results.append(result)
                    success_count += 1

                    # 캐시에 저장
                    AnalysisCache.set(cache_key, result)

            except Exception as e:
                logger.error(f"개별 커플 분석 실패: {str(e)}")
                # 실패한 경우 기본 결과 추가
                fallback_result = (
                    enhanced_couple_analysis_service._get_fallback_analysis()
                )
                results.append(fallback_result)

        return CoupleAnalysisBatchResponse(
            results=results,
            total_count=len(request.couples),
            success_count=success_count,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"배치 분석 중 오류 발생: {str(e)}")


@router.get("/analysis-status/{batch_id}")
def get_analysis_status(batch_id: str):
    """배치 분석 상태 조회"""
    # 구현 예정: Redis 등을 사용한 상태 추적
    return {"status": "completed", "batch_id": batch_id}
