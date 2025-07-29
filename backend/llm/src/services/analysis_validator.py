import logging
from dataclasses import dataclass
from typing import Dict

logger = logging.getLogger(__name__)


@dataclass
class ValidationError:
    field: str
    message: str
    code: str


class AnalysisValidator:
    """분석 데이터 검증 서비스"""

    def validate_couple_data(self, user_data: Dict, partner_data: Dict) -> None:
        """커플 데이터 검증"""
        errors = []

        # 필수 필드 검증
        required_fields = ["name", "age"]
        for field in required_fields:
            if field not in user_data:
                errors.append(
                    ValidationError(
                        field=f"user_data.{field}",
                        message=f"사용자 {field} 필드가 필요합니다.",
                        code="MISSING_REQUIRED_FIELD",
                    )
                )

            if field not in partner_data:
                errors.append(
                    ValidationError(
                        field=f"partner_data.{field}",
                        message=f"파트너 {field} 필드가 필요합니다.",
                        code="MISSING_REQUIRED_FIELD",
                    )
                )

        # 데이터 타입 검증
        if "age" in user_data and not isinstance(user_data["age"], int):
            errors.append(
                ValidationError(
                    field="user_data.age",
                    message="나이는 정수여야 합니다.",
                    code="INVALID_DATA_TYPE",
                )
            )

        if "age" in partner_data and not isinstance(partner_data["age"], int):
            errors.append(
                ValidationError(
                    field="partner_data.age",
                    message="나이는 정수여야 합니다.",
                    code="INVALID_DATA_TYPE",
                )
            )

        # MBTI 검증
        valid_mbti_types = [
            "INTJ",
            "INTP",
            "ENTJ",
            "ENTP",
            "INFJ",
            "INFP",
            "ENFJ",
            "ENFP",
            "ISTJ",
            "ISFJ",
            "ESTJ",
            "ESFJ",
            "ISTP",
            "ISFP",
            "ESTP",
            "ESFP",
        ]

        if "mbti" in user_data and user_data["mbti"] not in valid_mbti_types + [
            "UNKNOWN"
        ]:
            errors.append(
                ValidationError(
                    field="user_data.mbti",
                    message=(
                        f"유효하지 않은 MBTI 타입입니다. " f"유효한 타입: {', '.join(valid_mbti_types)}"
                    ),
                    code="INVALID_MBTI_TYPE",
                )
            )

        if "mbti" in partner_data and partner_data["mbti"] not in valid_mbti_types + [
            "UNKNOWN"
        ]:
            errors.append(
                ValidationError(
                    field="partner_data.mbti",
                    message=(
                        f"유효하지 않은 MBTI 타입입니다. " f"유효한 타입: {', '.join(valid_mbti_types)}"
                    ),
                    code="INVALID_MBTI_TYPE",
                )
            )

        if errors:
            error_messages = [f"{error.field}: {error.message}" for error in errors]
            raise ValueError(f"데이터 검증 실패: {'; '.join(error_messages)}")

    def validate_analysis_result(self, result: Dict) -> bool:
        """분석 결과 검증"""
        required_fields = ["summary", "advice", "compatibility_score"]

        for field in required_fields:
            if field not in result:
                logger.warning(f"분석 결과에 필수 필드가 없습니다: {field}")
                return False

        # 점수 범위 검증
        score = result.get("compatibility_score", 0)
        if not (0 <= score <= 100):
            logger.warning(f"궁합 점수가 유효하지 않습니다: {score}")
            return False

        return True
