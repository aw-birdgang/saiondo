from typing import Dict, Any, List, Optional
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from app.core.config import settings
from app.core.logger import log_info, log_error
from app.services.base import BaseService

class LLMService(BaseService):
    def __init__(self):
        super().__init__()
        
        if not settings.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY가 설정되지 않았습니다.")
        
        api_key = settings.OPENAI_API_KEY.get_secret_value()
        
        try:
            self.llm = ChatOpenAI(
                api_key=api_key,
                model=settings.MODEL_NAME,
                temperature=settings.MODEL_TEMPERATURE
            )
            log_info("LLM 서비스가 초기화되었습니다.", {"model": settings.MODEL_NAME})
            
        except Exception as e:
            log_error("LLM 서비스 초기화 실패", {"error": str(e)})
            raise

    async def analyze_sentiment(self, text: str) -> str:
        """감정 분석 수행"""
        try:
            prompt = ChatPromptTemplate.from_template(
                "다음 텍스트의 감정을 분석해주세요: {input}"
            )
            chain = prompt | self.llm
            response = await chain.ainvoke({"input": text})
            return response.content
        except Exception as e:
            log_error("감정 분석 실패", {"error": str(e), "text": text})
            return "감정 분석 실패"

    async def generate_response(
        self, 
        message: str, 
        sentiment: str,
        history: Optional[List[Dict[str, str]]] = None
    ) -> str:
        """응답 생성"""
        try:
            if history is None:
                history = []
            
            history_text = "\n".join([
                f"{msg['role']}: {msg['content']}"
                for msg in history[-5:]  # 최근 5개 메시지만 사용
            ])
            
            prompt = ChatPromptTemplate.from_template(
                """이전 대화 기록:
                {history}
                
                사용자의 현재 감정: {sentiment}
                
                사용자 메시지: {message}
                
                위 정보를 바탕으로 공감적이고 적절한 응답을 생성해주세요.
                """
            )
            
            chain = prompt | self.llm
            response = await chain.ainvoke({
                "history": history_text,
                "sentiment": sentiment,
                "message": message
            })
            
            return response.content
            
        except Exception as e:
            log_error("응답 생성 실패", {
                "error": str(e),
                "message": message,
                "sentiment": sentiment
            })
            return "응답 생성에 실패했습니다."

    async def process_message(
        self, 
        message: str,
        history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """메시지 처리"""
        try:
            if history is None:
                history = []
            
            # 종료 메시지 확인
            if "종료" in message.lower():
                return {
                    "response": "대화를 종료합니다. 좋은 하루 되세요!",
                    "sentiment": "종료",
                    "history": history,
                    "end": True
                }
            
            # 감정 분석
            sentiment = await self.analyze_sentiment(message)
            
            # 응답 생성
            response = await self.generate_response(message, sentiment, history)
            
            # 대화 기록 업데이트
            updated_history = history + [
                {"role": "user", "content": message},
                {"role": "assistant", "content": response}
            ]
            
            return {
                "response": response,
                "sentiment": sentiment,
                "history": updated_history,
                "end": False
            }
            
        except Exception as e:
            error_response = await self.handle_error(e, {"message": message})
            return {
                "response": error_response["error"],
                "sentiment": "오류",
                "history": history,
                "end": True
            }