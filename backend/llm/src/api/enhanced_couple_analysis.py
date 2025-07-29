from fastapi import APIRouter, HTTPException

from schemas.enhanced_couple_analysis import (
    EnhancedCoupleAnalysisRequest,
    EnhancedCoupleAnalysisResponse,
)
from services.enhanced_couple_analysis_service import enhanced_couple_analysis_service

router = APIRouter(
    tags=["Enhanced Couple Analysis"],
)


@router.post(
    "/enhanced-couple-analysis",
    response_model=EnhancedCoupleAnalysisResponse,
    summary="향상된 커플 분석",
    description="""
MBTI, 소통 스타일, 사랑의 언어 등 다양한 심리적 요소를 AI가 종합 분석하여
커플의 관계 진단, 궁합 점수, 맞춤형 조언, 개선 방안 등을 제공하는 고급 분석 API입니다.
""",
)
def enhanced_couple_analysis(request: EnhancedCoupleAnalysisRequest):
    """
    향상된 커플 분석 API

    - **user_data**: 사용자 프로필 정보 (이름, 나이, MBTI, 관심사, 성격 등)
    - **partner_data**: 파트너 프로필 정보

    **반환값:**
    - **summary**: 커플 관계 요약
    - **advice**: 주요 조언
    - **compatibility_score**: 궁합 점수 (0-100)
    - **personality_analysis**: 성향 분석 결과
    - **relationship_insights**: 관계 인사이트
    - **improvement_suggestions**: 개선 제안
    """
    try:
        # UserProfileData를 Dict로 변환
        user_data_dict = request.user_data.dict()
        partner_data_dict = request.partner_data.dict()

        result = enhanced_couple_analysis_service.analyze_couple(
            user_data_dict, partner_data_dict
        )

        return EnhancedCoupleAnalysisResponse(
            summary=result.summary,
            advice=result.advice,
            compatibility_score=result.compatibility_score,
            personality_analysis=result.personality_analysis,
            relationship_insights=result.relationship_insights,
            improvement_suggestions=result.improvement_suggestions,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"분석 중 오류 발생: {str(e)}")
