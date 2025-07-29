from unittest.mock import patch

import pytest

from services.analysis_validator import AnalysisValidator
from services.enhanced_couple_analysis_service import (
    CoupleAnalysisResult,
    EnhancedCoupleAnalysisService,
)


class TestEnhancedCoupleAnalysisService:
    @pytest.fixture
    def service(self):
        return EnhancedCoupleAnalysisService()

    def test_analyze_couple_success(
        self, service, sample_user_data, sample_partner_data
    ):
        """커플 분석 성공 테스트"""
        with patch("services.llm_provider.llm_provider.ask") as mock_ask:
            mock_ask.return_value = """
            {
                "summary": "잘 맞는 커플입니다",
                "advice": "서로를 이해하세요",
                "compatibility_score": 85,
                "personality_analysis": {
                    "user": {"dominant_traits": ["분석적"], "strengths": ["논리적"]},
                    "partner": {"dominant_traits": ["창의적"], "strengths": ["감성적"]}
                },
                "relationship_insights": ["서로 보완적"],
                "improvement_suggestions": ["대화 시간 늘리기"]
            }
            """

            result = service.analyze_couple(sample_user_data, sample_partner_data)

            assert isinstance(result, CoupleAnalysisResult)
            assert result.summary == "잘 맞는 커플입니다"
            assert result.compatibility_score == 85
            assert len(result.relationship_insights) > 0

    def test_analyze_couple_fallback(
        self, service, sample_user_data, sample_partner_data
    ):
        """커플 분석 실패 시 fallback 테스트"""
        with patch("services.llm_provider.llm_provider.ask") as mock_ask:
            mock_ask.side_effect = Exception("LLM 서비스 오류")

            result = service.analyze_couple(sample_user_data, sample_partner_data)

            assert isinstance(result, CoupleAnalysisResult)
            assert "분석을 완료할 수 없습니다" in result.summary
            assert result.compatibility_score == 50


class TestAnalysisValidator:
    @pytest.fixture
    def validator(self):
        return AnalysisValidator()

    def test_validate_couple_data_success(self, validator):
        """데이터 검증 성공 테스트"""
        user_data = {"name": "김철수", "age": 28, "mbti": "INTJ"}
        partner_data = {"name": "이영희", "age": 26, "mbti": "ENFP"}

        # 예외가 발생하지 않아야 함
        validator.validate_couple_data(user_data, partner_data)

    def test_validate_couple_data_missing_fields(self, validator):
        """필수 필드 누락 테스트"""
        user_data = {"name": "김철수"}  # age 누락
        partner_data = {"age": 26}  # name 누락

        with pytest.raises(ValueError) as exc_info:
            validator.validate_couple_data(user_data, partner_data)

        assert "사용자 age 필드가 필요합니다" in str(exc_info.value)
        assert "파트너 name 필드가 필요합니다" in str(exc_info.value)

    def test_validate_couple_data_invalid_mbti(self, validator):
        """잘못된 MBTI 타입 테스트"""
        user_data = {"name": "김철수", "age": 28, "mbti": "INVALID"}
        partner_data = {"name": "이영희", "age": 26, "mbti": "ENFP"}

        with pytest.raises(ValueError) as exc_info:
            validator.validate_couple_data(user_data, partner_data)

        assert "유효하지 않은 MBTI 타입입니다" in str(exc_info.value)
