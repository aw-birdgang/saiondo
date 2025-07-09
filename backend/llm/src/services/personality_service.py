import json
import logging
from typing import Dict, Any, List
from services.llm_provider import llm_provider  # services의 llm_provider 사용

logger = logging.getLogger(__name__)

class PersonalityService:
    def analyze(self, prompt: str, model: str = None) -> str:
        """
        일반적인 분석 엔드포인트 (NestJS에서 호출)
        """
        try:
            response = llm_provider.ask(prompt, model)
            logger.info(f"LLM 응답: {response}")
            return response
        except Exception as e:
            logger.error(f"LLM 분석 실패: {str(e)}")
            raise e
    
    def analyze_conversation(self, request) -> Dict[str, Any]:
        """
        대화 기반 성향 분석
        """
        prompt = f"""다음 대화를 분석하여 성향을 파악해주세요:
        사용자: {request.userId}
        상대방: {request.partnerId or '없음'}
        대화: {json.dumps([msg.dict() for msg in request.messages], ensure_ascii=False)}
        
        분석 결과를 다음 JSON 형식으로 반환해주세요:
        {{
            "personalityTraits": {{"trait": "외향적", "score": 0.8}},
            "feedback": "더 자주 감정을 표현해보세요.",
            "score": 0.87
        }}"""
        
        response = llm_provider.ask(prompt)
        return json.loads(response)
    
    def analyze_mbti(self, request) -> Dict[str, Any]:
        """
        MBTI 분석
        """
        prompt = f"""다음 데이터를 기반으로 MBTI를 분석해주세요:
        사용자: {request.userId}
        데이터: {json.dumps(request.data, ensure_ascii=False)}
        
        분석 결과를 다음 JSON 형식으로 반환해주세요:
        {{
            "mbti": "INFP",
            "description": "이상주의적이고 감성적입니다.",
            "match": {{"best": "ENFJ", "worst": "ESTJ"}}
        }}
        
        반드시 유효한 JSON 형식으로만 응답해주세요."""
        
        try:
            response = llm_provider.ask(prompt)
            logger.info(f"MBTI 분석 응답: {response}")
            
            # JSON 파싱 시도
            try:
                result = json.loads(response)
                return result
            except json.JSONDecodeError:
                # JSON 파싱 실패 시 기본 응답
                logger.error(f"JSON 파싱 실패: {response}")
                return {
                    "mbti": "분석 실패",
                    "description": "응답을 파싱할 수 없습니다.",
                    "match": {}
                }
        except Exception as e:
            logger.error(f"MBTI 분석 실패: {str(e)}")
            return {
                "mbti": "분석 실패",
                "description": f"분석 중 오류 발생: {str(e)}",
                "match": {}
            }
    
    def analyze_communication(self, request) -> Dict[str, Any]:
        """
        소통 스타일 분석
        """
        prompt = f"""다음 대화를 분석하여 소통 스타일을 파악해주세요:
        사용자: {request.userId}
        대화: {json.dumps([msg.dict() for msg in request.messages], ensure_ascii=False)}
        
        분석 결과를 다음 JSON 형식으로 반환해주세요:
        {{
            "style": "직접적/감정적",
            "description": "감정을 솔직하게 표현하는 직접적 스타일입니다.",
            "feedback": "상대방의 입장도 고려해보세요."
        }}"""
        
        response = llm_provider.ask(prompt)
        return json.loads(response)
    
    def analyze_love_language(self, request) -> Dict[str, Any]:
        """
        사랑의 언어 분석
        """
        prompt = f"""다음 데이터를 기반으로 사랑의 언어를 분석해주세요:
        사용자: {request.userId}
        데이터: {json.dumps(request.data, ensure_ascii=False)}
        
        분석 결과를 다음 JSON 형식으로 반환해주세요:
        {{
            "mainLanguage": "행동",
            "description": "행동으로 사랑을 표현하는 경향이 강합니다.",
            "match": {{"best": "말", "worst": "선물"}}
        }}"""
        
        response = llm_provider.ask(prompt)
        return json.loads(response)
    
    def analyze_behavior(self, request) -> Dict[str, Any]:
        """
        행동 패턴 분석
        """
        prompt = f"""다음 행동 데이터를 분석하여 패턴을 파악해주세요:
        사용자: {request.userId}
        데이터: {json.dumps(request.data, ensure_ascii=False)}
        
        분석 결과를 다음 JSON 형식으로 반환해주세요:
        {{
            "pattern": "야간 활동이 많음",
            "description": "주로 밤에 활동하는 경향이 있습니다.",
            "recommendation": "규칙적인 생활을 시도해보세요."
        }}"""
        
        response = llm_provider.ask(prompt)
        return json.loads(response)
    
    def analyze_emotion(self, request) -> Dict[str, Any]:
        """
        감정 상태 분석
        """
        prompt = f"""다음 대화를 분석하여 감정 상태를 파악해주세요:
        사용자: {request.userId}
        대화: {json.dumps([msg.dict() for msg in request.messages], ensure_ascii=False)}
        
        분석 결과를 다음 JSON 형식으로 반환해주세요:
        {{
            "emotion": "스트레스",
            "description": "최근 스트레스가 증가한 상태입니다.",
            "feedback": "충분한 휴식을 취해보세요."
        }}"""
        
        response = llm_provider.ask(prompt)
        return json.loads(response)
    
    def chatbot_detect(self, request) -> Dict[str, Any]:
        """
        챗봇 기반 성향 탐지
        """
        prompt = f"""다음 챗봇 대화를 분석하여 성향을 탐지해주세요:
        사용자: {request.userId}
        대화: {json.dumps([msg.dict() for msg in request.messages], ensure_ascii=False)}
        
        분석 결과를 다음 JSON 형식으로 반환해주세요:
        {{
            "detectedTraits": {{"trait": "외향적", "score": 0.7}},
            "feedback": "긍정적인 대화를 유지해보세요."
        }}"""
        
        response = llm_provider.ask(prompt)
        return json.loads(response)
    
    def generate_feedback(self, request) -> Dict[str, Any]:
        """
        성향 기반 피드백 생성
        """
        prompt = f"""다음 상황을 기반으로 피드백을 생성해주세요:
        사용자: {request.userId}
        상대방: {request.partnerId or '없음'}
        상황: {json.dumps(request.data, ensure_ascii=False)}
        
        피드백을 다음 JSON 형식으로 반환해주세요:
        {{
            "feedback": "서로의 감정을 자주 표현해보세요.",
            "recommendation": "함께 산책을 해보세요."
        }}"""
        
        response = llm_provider.ask(prompt)
        return json.loads(response)

# 싱글톤 인스턴스
personality_service = PersonalityService()
