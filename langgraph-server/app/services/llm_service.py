from typing import Dict, Any, List, Optional
import time

from langchain.schema import AIMessage, HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

from app.core.config import settings
from app.core.logger import log_info, log_error, log_debug
from app.services.base import BaseService
from app.services.tools import ToolService


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
            self.tool_service = ToolService()
            log_info("LLM 서비스가 초기화되었습니다.", {"model": settings.MODEL_NAME})

        except Exception as e:
            log_error("LLM 서비스 초기화 실패", {"error": str(e)})
            raise

    async def analyze_sentiment(self, text: str) -> str:
        """감정 분석 수행"""
        try:
            start_time = time.time()
            messages = [
                SystemMessage(content="당신은 텍스트의 감정을 분석하는 전문가입니다. 텍스트에서 감지되는 감정을 '긍정', '부정', '중립' 중 하나로만 응답해주세요."),
                HumanMessage(content=text)
            ]
            
            response = await self.llm.ainvoke(messages)
            sentiment = response.content.strip()
            
            log_debug("감정 분석 완료", {
                "sentiment": sentiment,
                "text_length": len(text),
                "processing_time_ms": round((time.time() - start_time) * 1000, 2)
            })
            return sentiment
            
        except Exception as e:
            log_error("감정 분석 실패", {
                "error": str(e),
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

            messages = [
                SystemMessage(content="""당신은 친절하고 공감적인 한국어 AI 어시스턴트입니다.
                사용자의 감정을 이해하고 적절한 응답을 제공해주세요.
                응답은 2-3문장으로 간단하게 해주세요."""),
                *[
                    HumanMessage(content=msg["content"])
                    if msg["role"] == "user"
                    else AIMessage(content=msg["content"])
                    for msg in history[-5:]
                ],
                SystemMessage(content=f"사용자의 현재 감정: {sentiment}"),
                HumanMessage(content=message)
            ]
            
            response = await self.llm.ainvoke(messages)
            response_text = response.content.strip()
            
            log_debug("응답 생성 완료", {
                "response_length": len(response_text),
                "contains_question": "?" in response_text,
                "sentiment_reflected": sentiment.lower() in response_text.lower()
            })
            return response_text
            
        except Exception as e:
            log_error("응답 생성 실패", {
                "error": str(e),
                "message": message,
                "sentiment": sentiment
            })
            return "응답 생성에 실패했습니다."

    async def analyze_intent(self, text: str) -> Dict[str, Any]:
        """사용자 의도 분석"""
        try:
            prompt = ChatPromptTemplate.from_template("""
            다음 사용자 메시지의 의도를 분석해주세요:
            {text}
            
            다음 형식으로 응답해주세요:
            {
                "intent": "검색" 또는 "계산" 또는 "일반대화",
                "requires_tool": true/false,
                "tool_type": "Web_Search" 또는 "Wikipedia" 또는 "Calculator" 또는 "None",
                "query": "검색이나 계산이 필요한 경우 구체적인 질의"
            }
            """)
            
            chain = prompt | self.llm
            response = await chain.ainvoke({"text": text})
            
            import json
            intent_data = json.loads(response.content)
            return intent_data
            
        except Exception as e:
            log_error("의도 분석 실패", {"error": str(e)})
            return {
                "intent": "일반대화",
                "requires_tool": False,
                "tool_type": "None",
                "query": ""
            }

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

            # 의도 분석
            intent = await self.analyze_intent(message)
            
            # 도구 사용이 필요한 경우
            if intent["requires_tool"]:
                try:
                    tool_response = await self.tool_service.agent.arun(
                        f"{message}\n이전 대화: {str(history)}"
                    )
                    
                    return {
                        "response": tool_response,
                        "intent": intent["intent"],
                        "tool_used": intent["tool_type"],
                        "history": history + [
                            {"role": "user", "content": message},
                            {"role": "assistant", "content": tool_response}
                        ],
                        "end": False
                    }
                except Exception as e:
                    log_error("도구 실행 실패", {"error": str(e)})
                    return await self._handle_general_chat(message, history)
            else:
                return await self._handle_general_chat(message, history)
            
        except Exception as e:
            log_error("메시지 처리 실패", {"error": str(e)})
            return {
                "response": "죄송합니다. 처리 중 오류가 발생했습니다.",
                "intent": "오류",
                "tool_used": None,
                "history": history,
                "end": True
            }

    async def _handle_general_chat(
        self, 
        message: str, 
        history: List[Dict[str, str]]
    ) -> Dict[str, Any]:
        """일반 대화 처리"""
        try:
            sentiment = await self.analyze_sentiment(message)
            response = await self.generate_response(message, sentiment, history)
            
            return {
                "response": response,
                "intent": "일반대화",
                "tool_used": None,
                "sentiment": sentiment,
                "history": history + [
                    {"role": "user", "content": message},
                    {"role": "assistant", "content": response}
                ],
                "end": "종료" in message.lower()
            }
        except Exception as e:
            log_error("일반 대화 처리 실패", {"error": str(e)})
            raise

    async def handle_search_query(self, query: str) -> str:
        """검색 쿼리 처리"""
        try:
            # ToolService를 통한 웹 검색 실행
            search_result = await self.tool_service.agent.arun(
                f"다음 질문에 대해 최신 정보를 찾아주세요: {query}"
            )
            return search_result
        except Exception as e:
            log_error("검색 실패", {"error": str(e)})
            return "죄송합니다. 검색 중 오류가 발생했습니다."

    async def handle_calculation(self, expression: str) -> str:
        """수학 계산 처리"""
        try:
            # ToolService를 통한 계산 실행
            calc_result = await self.tool_service.agent.arun(
                f"다음 수학 문제를 풀어주세요: {expression}"
            )
            return calc_result
        except Exception as e:
            log_error("계산 실패", {"error": str(e)})
            return "죄송합니다. 계산 중 오류가 발생했습니다."

    async def handle_complex_query(self, query: str) -> Dict[str, Any]:
        """복합 쿼리 처리"""
        try:
            # 1. 의도 분석
            intent = await self.analyze_intent(query)
            
            # 2. 필요한 도구들 결정
            tools_needed = self._determine_required_tools(intent)
            
            # 3. 순차적 도구 실행
            results = {}
            for tool in tools_needed:
                if tool == "Weather":
                    results["weather"] = await self.tool_service.agent.arun(
                        f"다음 지역의 날씨를 알려주세요: {query}"
                    )
                elif tool == "News":
                    results["news"] = await self.tool_service.agent.arun(
                        f"다음 주제의 최신 뉴스를 찾아주세요: {query}"
                    )
            
            # 4. 결과 종합
            return self._combine_results(results)
            
        except Exception as e:
            log_error("복합 쿼리 처리 실패", {"error": str(e)})
            return {"error": "처리 중 오류가 발생했습니다."}
