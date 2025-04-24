from typing import Dict, Any, List, Optional

from langchain.schema import AIMessage, HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

from app.core.config import settings
from app.core.logger import log_info, log_error, log_debug
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
            log_debug("감정 분석 시작", {"text_length": len(text)})

            messages = [
                SystemMessage(content="당신은 텍스트의 감정을 분석하는 전문가입니다. 텍스트에서 감지되는 감정을 '긍정', '부정', '중립' 중 하나로만 응답해주세요."),
                HumanMessage(content=text)
            ]

            response = await self.llm.ainvoke(messages)
            sentiment = response.content.strip()

            log_debug("감정 분석 완료", {"sentiment": sentiment})
            return sentiment

        except Exception as e:
            log_error("감정 분석 실패", {
                "error": str(e),
                "error_type": type(e).__name__,
                "text": text
            })
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

            log_debug("응답 생성 시작", {
                "message_length": len(message),
                "sentiment": sentiment,
                "history_length": len(history)
            })

            # 대화 기록을 메시지 형식으로 변환
            conversation_messages = [
                SystemMessage(content="""당신은 친절하고 공감적인 한국어 AI 어시스턴트입니다.
                사용자의 감정을 이해하고 적절한 응답을 제공해주세요.
                응답은 2-3문장으로 간단하게 해주세요.""")
            ]

            # 이전 대화 기록 추가
            for msg in history[-5:]:  # 최근 5개 메시지만 사용
                if msg["role"] == "user":
                    conversation_messages.append(HumanMessage(content=msg["content"]))
                else:
                    conversation_messages.append(AIMessage(content=msg["content"]))

            # 현재 상황 정보 추가
            conversation_messages.append(
                SystemMessage(content=f"사용자의 현재 감정: {sentiment}")
            )

            # 현재 메시지 추가
            conversation_messages.append(HumanMessage(content=message))

            response = await self.llm.ainvoke(conversation_messages)
            generated_text = response.content.strip()

            log_debug("응답 생성 완료", {"response": generated_text})
            return generated_text

        except Exception as e:
            log_error("응답 생성 실패", {
                "error": str(e),
                "error_type": type(e).__name__,
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

            log_debug("메시지 처리 시작", {
                "message_length": len(message),
                "history_length": len(history)
            })

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
            log_debug("감정 분석 결과", {"sentiment": sentiment})

            # 응답 생성
            response = await self.generate_response(message, sentiment, history)
            log_debug("응답 생성 결과", {"response": response})

            # 대화 기록 업데이트
            updated_history = history + [
                {"role": "user", "content": message},
                {"role": "assistant", "content": response}
            ]

            result = {
                "response": response,
                "sentiment": sentiment,
                "history": updated_history,
                "end": False
            }

            log_info("메시지 처리 완료", {
                "sentiment": sentiment,
                "response_length": len(response),
                "history_length": len(updated_history)
            })

            return result

        except Exception as e:
            log_error("메시지 처리 실패", {
                "error": str(e),
                "error_type": type(e).__name__,
                "message": message
            })
            return {
                "response": "죄송합니다. 처리 중 오류가 발생했습니다.",
                "sentiment": "오류",
                "history": history,
                "end": True
            }
