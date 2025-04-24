from typing import Any, Dict, Optional
from app.core.logger import log_error

class BaseService:
    """기본 서비스 클래스"""
    
    async def handle_error(
        self, 
        error: Exception, 
        context: Optional[Dict[str, Any]] = None,
        message: str = "서비스 오류가 발생했습니다"
    ) -> Dict[str, Any]:
        """에러 처리 및 로깅"""
        error_context = {
            "error_type": type(error).__name__,
            "error_message": str(error)
        }
        if context:
            error_context.update(context)
        
        log_error(message, error_context)
        return {"error": str(error)}
