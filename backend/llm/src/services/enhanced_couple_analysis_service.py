import json
import logging
from typing import Dict, List, Optional
from dataclasses import dataclass
from services.llm_provider import llm_provider

logger = logging.getLogger(__name__)

@dataclass
class PersonalityTrait:
    category: str
    value: str
    confidence: float
    source: str

@dataclass
class CoupleAnalysisResult:
    summary: str
    advice: str
    compatibility_score: float
    personality_analysis: Dict[str, PersonalityTrait]
    relationship_insights: List[str]
    improvement_suggestions: List[str]

class EnhancedCoupleAnalysisService:
    def __init__(self):
        self.analysis_templates = {
            'mbti_compatibility': self._get_mbti_compatibility_prompt,
            'communication_style': self._get_communication_style_prompt,
            'love_language': self._get_love_language_prompt,
            'conflict_resolution': self._get_conflict_resolution_prompt,
        }
    
    def analyze_couple(self, user_data: Dict, partner_data: Dict) -> CoupleAnalysisResult:
        """향상된 커플 분석"""
        try:
            # 1. 기본 성향 분석
            basic_analysis = self._analyze_basic_personality(user_data, partner_data)
            
            # 2. MBTI 궁합 분석
            mbti_analysis = self._analyze_mbti_compatibility(user_data, partner_data)
            
            # 3. 소통 스타일 분석
            communication_analysis = self._analyze_communication_style(user_data, partner_data)
            
            # 4. 사랑의 언어 분석
            love_language_analysis = self._analyze_love_language(user_data, partner_data)
            
            # 5. 종합 분석 및 조언 생성
            comprehensive_analysis = self._generate_comprehensive_analysis(
                basic_analysis, mbti_analysis, communication_analysis, love_language_analysis
            )
            
            return comprehensive_analysis
            
        except Exception as e:
            logger.error(f"커플 분석 중 오류 발생: {str(e)}")
            return self._get_fallback_analysis()
    
    def _analyze_basic_personality(self, user_data: Dict, partner_data: Dict) -> Dict:
        """기본 성향 분석"""
        prompt = f"""
        다음은 커플의 기본 정보입니다:
        
        사용자: {json.dumps(user_data, ensure_ascii=False)}
        파트너: {json.dumps(partner_data, ensure_ascii=False)}
        
        각자의 성향을 분석하고 다음 형식으로 응답해주세요:
        {{
            "user_personality": {{
                "dominant_traits": ["특징1", "특징2"],
                "strengths": ["강점1", "강점2"],
                "growth_areas": ["개선점1", "개선점2"]
            }},
            "partner_personality": {{
                "dominant_traits": ["특징1", "특징2"],
                "strengths": ["강점1", "강점2"],
                "growth_areas": ["개선점1", "개선점2"]
            }}
        }}
        """
        
        response = llm_provider.ask(prompt)
        return json.loads(response)
    
    def _analyze_mbti_compatibility(self, user_data: Dict, partner_data: Dict) -> Dict:
        """MBTI 궁합 분석"""
        user_mbti = user_data.get('mbti', 'UNKNOWN')
        partner_mbti = partner_data.get('mbti', 'UNKNOWN')
        
        prompt = f"""
        MBTI 궁합 분석:
        사용자 MBTI: {user_mbti}
        파트너 MBTI: {partner_mbti}
        
        다음 형식으로 분석해주세요:
        {{
            "compatibility_score": 85,
            "strengths": ["공통점1", "공통점2"],
            "challenges": ["도전과제1", "도전과제2"],
            "communication_tips": ["소통팁1", "소통팁2"],
            "relationship_advice": "관계 발전을 위한 조언"
        }}
        """
        
        response = llm_provider.ask(prompt)
        return json.loads(response)
    
    def _analyze_communication_style(self, user_data: Dict, partner_data: Dict) -> Dict:
        """소통 스타일 분석"""
        prompt = f"""
        소통 스타일 분석:
        사용자: {json.dumps(user_data, ensure_ascii=False)}
        파트너: {json.dumps(partner_data, ensure_ascii=False)}
        
        각자의 소통 스타일을 분석하고 개선 방안을 제시해주세요:
        {{
            "user_communication_style": "직설적/감정적/논리적 등",
            "partner_communication_style": "직설적/감정적/논리적 등",
            "communication_compatibility": 80,
            "improvement_suggestions": ["개선안1", "개선안2"]
        }}
        """
        
        response = llm_provider.ask(prompt)
        return json.loads(response)
    
    def _analyze_love_language(self, user_data: Dict, partner_data: Dict) -> Dict:
        """사랑의 언어 분석"""
        prompt = f"""
        사랑의 언어 분석:
        사용자: {json.dumps(user_data, ensure_ascii=False)}
        파트너: {json.dumps(partner_data, ensure_ascii=False)}
        
        각자의 사랑의 언어를 분석해주세요:
        {{
            "user_love_language": {{
                "primary": "Words of Affirmation/Acts of Service/Gifts/Quality Time/Physical Touch",
                "secondary": "Words of Affirmation/Acts of Service/Gifts/Quality Time/Physical Touch"
            }},
            "partner_love_language": {{
                "primary": "Words of Affirmation/Acts of Service/Gifts/Quality Time/Physical Touch",
                "secondary": "Words of Affirmation/Acts of Service/Gifts/Quality Time/Physical Touch"
            }},
            "love_language_compatibility": 90,
            "expression_suggestions": ["표현방법1", "표현방법2"]
        }}
        """
        
        response = llm_provider.ask(prompt)
        return json.loads(response)
    
    def _generate_comprehensive_analysis(self, *analyses) -> CoupleAnalysisResult:
        """종합 분석 생성"""
        prompt = f"""
        다음 분석 결과들을 종합하여 커플을 위한 종합적인 조언을 생성해주세요:
        
        분석 결과: {json.dumps(analyses, ensure_ascii=False)}
        
        다음 형식으로 응답해주세요:
        {{
            "summary": "커플 관계 요약",
            "advice": "주요 조언",
            "compatibility_score": 85,
            "personality_analysis": {{
                "user": {{
                    "dominant_traits": ["특징1", "특징2"],
                    "strengths": ["강점1", "강점2"]
                }},
                "partner": {{
                    "dominant_traits": ["특징1", "특징2"],
                    "strengths": ["강점1", "강점2"]
                }}
            }},
            "relationship_insights": ["인사이트1", "인사이트2"],
            "improvement_suggestions": ["개선안1", "개선안2"]
        }}
        """
        
        response = llm_provider.ask(prompt)
        result_data = json.loads(response)
        
        return CoupleAnalysisResult(
            summary=result_data.get('summary', ''),
            advice=result_data.get('advice', ''),
            compatibility_score=result_data.get('compatibility_score', 0),
            personality_analysis=result_data.get('personality_analysis', {}),
            relationship_insights=result_data.get('relationship_insights', []),
            improvement_suggestions=result_data.get('improvement_suggestions', [])
        )
    
    def _get_fallback_analysis(self) -> CoupleAnalysisResult:
        """오류 시 기본 분석 반환"""
        return CoupleAnalysisResult(
            summary="분석을 완료할 수 없습니다. 잠시 후 다시 시도해주세요.",
            advice="서로의 감정을 자주 표현하고 대화를 나누어보세요.",
            compatibility_score=50,
            personality_analysis={},
            relationship_insights=["서로를 이해하는 시간이 필요합니다."],
            improvement_suggestions=["정기적인 대화 시간을 가지세요."]
        )

# 싱글턴 인스턴스
enhanced_couple_analysis_service = EnhancedCoupleAnalysisService()
