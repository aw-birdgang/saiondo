from typing import Dict, Any, Optional, List
from app.services.llm_service import LLMService
from app.core.logger import log_info, log_error

class ChatService:
    def __init__(self):
        self.llm_service = LLMService()
    
    async def process_chat(
        self, 
        message: str,
        history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """채팅 처리"""
        try:
            log_info("채팅 요청 처리 시작", {"message": message})
            
            result = await self.llm_service.process_message(message, history)
            
            log_info("채팅 요청 처리 완료", {
                "sentiment": result["sentiment"],
                "end": result["end"]
            })
            
            return result
            
        except Exception as e:
            log_error("채팅 처리 실패", {"error": str(e)})
            return {
                "response": "죄송합니다. 처리 중 오류가 발생했습니다.",
                "sentiment": "오류",
                "history": history or [],
                "end": True
            } 