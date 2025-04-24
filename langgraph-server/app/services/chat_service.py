from typing import Dict, Any, List, Optional
from app.services.llm_service import LLMService
from app.core.logger import log_info, log_error
from app.services.base import BaseService
import time

class ChatService(BaseService):
    def __init__(self):
        super().__init__()
        self.llm_service = LLMService()
    
    async def process_message(
        self, 
        message: str,
        history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """채팅 메시지 처리"""
        start_time = time.time()
        try:
            log_info("채팅 처리 시작", {
                "message_length": len(message),
                "has_history": bool(history)
            })
            
            # LLM 서비스를 통한 메시지 처리
            result = await self.llm_service.process_message(
                message=message,
                history=history
            )
            
            processing_time = time.time() - start_time
            log_info("채팅 처리 완료", {
                "intent": result.get("intent"),
                "tool_used": result.get("tool_used"),
                "response_length": len(result.get("response", "")),
                "processing_time_ms": round(processing_time * 1000, 2)
            })
            
            return {
                "response": result.get("response", "처리 중 오류가 발생했습니다."),
                "intent": result.get("intent", "오류"),
                "tool_used": result.get("tool_used"),
                "sentiment": result.get("sentiment"),
                "history": result.get("history", history or []),
                "end": result.get("end", False)
            }
            
        except Exception as e:
            error_context = {
                "error_type": type(e).__name__,
                "error_details": str(e),
                "message_length": len(message)
            }
            log_error("채팅 처리 실패", error_context)
            
            return {
                "response": "죄송합니다. 처리 중 오류가 발생했습니다.",
                "intent": "오류",
                "tool_used": None,
                "sentiment": None,
                "history": history or [],
                "end": True
            }

    async def analyze_message(
        self,
        message: str
    ) -> Dict[str, Any]:
        """메시지 분석"""
        try:
            # 의도 분석
            intent = await self.llm_service.analyze_intent(message)
            
            # 감정 분석 (필요한 경우)
            sentiment = None
            if not intent.get("requires_tool"):
                sentiment = await self.llm_service.analyze_sentiment(message)
            
            return {
                "intent": intent,
                "sentiment": sentiment
            }
        except Exception as e:
            await self.handle_error(e, {"message": message})
            return {
                "intent": {
                    "intent": "오류",
                    "requires_tool": False,
                    "tool_type": "None",
                    "query": ""
                },
                "sentiment": None
            } 