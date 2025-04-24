from fastapi import APIRouter, HTTPException
from app.services.chat_service import ChatService
from app.api.schemas import ChatInput, ChatResponse, ErrorResponse
from app.core.logger import log_info, log_error

router = APIRouter()
chat_service = ChatService()

@router.post("/chat", response_model=ChatResponse)
async def chat(chat_input: ChatInput):
    """채팅 API 엔드포인트"""
    try:
        log_info("채팅 요청 수신", {
            "input_length": len(chat_input.message),
            "has_history": bool(chat_input.history)
        })
        
        result = await chat_service.process_chat(
            message=chat_input.message,
            history=chat_input.history
        )
        
        response = ChatResponse(
            response=result["response"],
            sentiment=result["sentiment"],
            history=result["history"],
            end=result["end"]
        )
        
        log_info("채팅 응답 완료", {
            "sentiment": result["sentiment"],
            "end": result["end"],
            "response_length": len(result["response"])
        })
        
        return response
        
    except Exception as e:
        error_context = {
            "error_type": type(e).__name__,
            "error_details": str(e)
        }
        log_error("채팅 처리 중 오류 발생", error_context)
        
        raise HTTPException(
            status_code=500,
            detail=ErrorResponse(
                error="채팅 처리 중 오류가 발생했습니다",
                details=error_context
            ).dict()
        )

@router.delete("/chat/{user_id}")
async def clear_chat_history(user_id: str):
    try:
        log_info(f"사용자 {user_id}의 대화 기록 삭제 요청")
        chat_service.clear_chat_history(user_id)
        log_info(f"사용자 {user_id}의 대화 기록 삭제 완료")
        
        return {
            "message": "대화 기록이 삭제되었습니다",
            "timestamp": datetime.now().isoformat()
        }
    
    except Exception as e:
        log_error(f"대화 기록 삭제 중 오류 발생: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=ErrorResponse(
                error="기록 삭제 중 오류가 발생했습니다",
                details={"error_message": str(e)},
                timestamp=datetime.now().isoformat()
            ).dict()
        )