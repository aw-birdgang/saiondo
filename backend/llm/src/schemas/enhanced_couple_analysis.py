from pydantic import BaseModel, Field
from typing import Dict, List, Any, Optional
from enum import Enum

class MBTIType(str, Enum):
    INTJ = "INTJ"
    INTP = "INTP"
    ENTJ = "ENTJ"
    ENTP = "ENTP"
    INFJ = "INFJ"
    INFP = "INFP"
    ENFJ = "ENFJ"
    ENFP = "ENFP"
    ISTJ = "ISTJ"
    ISFJ = "ISFJ"
    ESTJ = "ESTJ"
    ESFJ = "ESFJ"
    ISTP = "ISTP"
    ISFP = "ISFP"
    ESTP = "ESTP"
    ESFP = "ESFP"
    UNKNOWN = "UNKNOWN"

class LoveLanguageType(str, Enum):
    WORDS_OF_AFFIRMATION = "Words of Affirmation"
    ACTS_OF_SERVICE = "Acts of Service"
    GIFTS = "Gifts"
    QUALITY_TIME = "Quality Time"
    PHYSICAL_TOUCH = "Physical Touch"

class CommunicationStyle(str, Enum):
    DIRECT = "직설적"
    EMOTIONAL = "감정적"
    LOGICAL = "논리적"
    PASSIVE = "수동적"
    ASSERTIVE = "적극적"

class PersonalityTraitSchema(BaseModel):
    category: str = Field(..., description="성향 카테고리")
    value: str = Field(..., description="성향 값")
    confidence: float = Field(..., ge=0.0, le=1.0, description="신뢰도 (0-1)")
    source: str = Field(..., description="분석 소스")

class UserProfileData(BaseModel):
    name: str = Field(..., description="이름", example="김철수")
    age: int = Field(..., ge=18, le=100, description="나이", example=28)
    mbti: MBTIType = Field(..., description="MBTI 성격 유형", example=MBTIType.INTJ)
    interests: List[str] = Field(..., description="관심사 목록", example=["독서", "게임", "영화"])
    personality: str = Field(..., description="성격 특징", example="내향적이고 분석적이며 논리적")
    communication_style: CommunicationStyle = Field(..., description="소통 스타일", example=CommunicationStyle.LOGICAL)
    love_language: LoveLanguageType = Field(..., description="사랑의 언어", example=LoveLanguageType.WORDS_OF_AFFIRMATION)
    relationship_duration: Optional[int] = Field(None, ge=0, description="연애 기간(개월)", example=24)
    occupation: Optional[str] = Field(None, description="직업", example="개발자")
    education: Optional[str] = Field(None, description="학력", example="대학교 졸업")
    hobbies: Optional[List[str]] = Field(None, description="취미", example=["독서", "게임"])
    values: Optional[List[str]] = Field(None, description="중요한 가치관", example=["성장", "안정", "자유"])
    stress_factors: Optional[List[str]] = Field(None, description="스트레스 요인", example=["업무 압박", "경제적 부담"])
    goals: Optional[List[str]] = Field(None, description="목표", example=["결혼", "집 구매", "해외여행"])

class EnhancedCoupleAnalysisRequest(BaseModel):
    user_data: UserProfileData = Field(..., description="사용자 프로필 데이터")
    partner_data: UserProfileData = Field(..., description="파트너 프로필 데이터")
    
    class Config:
        schema_extra = {
            "example": {
                "user_data": {
                    "name": "김철수",
                    "age": 28,
                    "mbti": "INTJ",
                    "interests": ["독서", "게임", "프로그래밍"],
                    "personality": "내향적이고 분석적이며 논리적 사고를 선호합니다. 체계적이고 계획적인 성격입니다.",
                    "communication_style": "논리적",
                    "love_language": "Words of Affirmation",
                    "relationship_duration": 24,
                    "occupation": "소프트웨어 개발자",
                    "education": "컴퓨터공학과 졸업",
                    "hobbies": ["독서", "게임", "영화 감상"],
                    "values": ["성장", "안정", "지적 자극"],
                    "stress_factors": ["업무 압박", "새로운 기술 학습"],
                    "goals": ["결혼", "집 구매", "창업"]
                },
                "partner_data": {
                    "name": "이영희",
                    "age": 26,
                    "mbti": "ENFP",
                    "interests": ["여행", "음악", "미술"],
                    "personality": "외향적이고 창의적이며 감정적입니다. 새로운 경험을 즐기고 사람들과의 교류를 중요시합니다.",
                    "communication_style": "감정적",
                    "love_language": "Quality Time",
                    "relationship_duration": 24,
                    "occupation": "디자이너",
                    "education": "디자인학과 졸업",
                    "hobbies": ["여행", "음악 감상", "그림 그리기"],
                    "values": ["창의성", "자유", "인간관계"],
                    "stress_factors": ["창작 블록", "고객 요구사항"],
                    "goals": ["결혼", "해외여행", "자신만의 브랜드 런칭"]
                }
            }
        }

class PersonalityAnalysisResult(BaseModel):
    user: Dict[str, Any] = Field(..., description="사용자 성향 분석", example={
        "dominant_traits": ["분석적", "논리적", "체계적"],
        "strengths": ["문제 해결 능력", "계획 수립", "객관적 판단"],
        "growth_areas": ["감정 표현", "유연성", "대인관계"]
    })
    partner: Dict[str, Any] = Field(..., description="파트너 성향 분석", example={
        "dominant_traits": ["창의적", "감정적", "사교적"],
        "strengths": ["창의력", "공감 능력", "적응력"],
        "growth_areas": ["계획 수립", "일관성", "객관적 판단"]
    })

class EnhancedCoupleAnalysisResponse(BaseModel):
    summary: str = Field(..., description="커플 관계 요약", example="김철수와 이영희는 서로를 보완하는 관계입니다. 김철수의 논리적 사고와 이영희의 감성적 접근이 조화를 이룹니다.")
    advice: str = Field(..., description="주요 조언", example="서로의 차이점을 이해하고 존중하는 시간을 가지세요. 정기적인 대화 시간을 통해 서로의 감정을 공유하세요.")
    compatibility_score: float = Field(..., ge=0.0, le=100.0, description="궁합 점수 (0-100)", example=85.5)
    personality_analysis: PersonalityAnalysisResult = Field(..., description="성향 분석 결과")
    relationship_insights: List[str] = Field(..., description="관계 인사이트", example=[
        "서로의 성향이 보완적이어서 긴장감과 매력을 동시에 느낄 수 있습니다.",
        "소통 스타일의 차이로 인한 오해가 발생할 수 있으니 명확한 의사소통이 중요합니다."
    ])
    improvement_suggestions: List[str] = Field(..., description="개선 제안", example=[
        "주 1회 이상의 정기적인 데이트 시간을 가지세요.",
        "서로의 사랑의 언어를 이해하고 표현하는 방법을 배우세요.",
        "갈등 상황에서 서로의 관점을 이해하려고 노력하세요."
    ])

class CoupleAnalysisBatchRequest(BaseModel):
    couples: List[Dict[str, Any]] = Field(..., description="여러 커플 데이터", example=[
        {
            "user_data": {
                "name": "김철수",
                "age": 28,
                "mbti": "INTJ",
                "interests": ["독서", "게임"],
                "personality": "내향적이고 분석적",
                "communication_style": "논리적",
                "love_language": "Words of Affirmation"
            },
            "partner_data": {
                "name": "이영희",
                "age": 26,
                "mbti": "ENFP",
                "interests": ["여행", "음악"],
                "personality": "외향적이고 창의적",
                "communication_style": "감정적",
                "love_language": "Quality Time"
            }
        }
    ])
    analysis_type: str = Field(default="comprehensive", description="분석 유형", example="comprehensive")

class CoupleAnalysisBatchResponse(BaseModel):
    results: List[EnhancedCoupleAnalysisResponse] = Field(..., description="분석 결과 목록")
    total_count: int = Field(..., description="총 분석 수", example=1)
    success_count: int = Field(..., description="성공한 분석 수", example=1)
