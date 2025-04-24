import logging
import sys
from datetime import datetime
from typing import Optional, Dict, Any
from pythonjsonlogger import jsonlogger
from app.core.config import settings
from app.core.log_config import default_logger, _format_extra

class CustomJsonFormatter(jsonlogger.JsonFormatter):
    def add_fields(self, log_record: Dict[str, Any], record: logging.LogRecord, message_dict: Dict[str, Any]) -> None:
        super(CustomJsonFormatter, self).add_fields(log_record, record, message_dict)
        log_record['timestamp'] = datetime.now().isoformat()
        log_record['level'] = record.levelname
        log_record['logger'] = record.name
        
        # extra 필드가 있으면 병합
        if getattr(record, 'extra', None):
            for key, value in record.extra.items():
                if key != 'message':  # message 필드는 건너뜀
                    log_record[key] = value

def setup_logger(name: str = "langgraph_server") -> logging.Logger:
    """로거 설정 및 초기화"""
    logger = logging.getLogger(name)
    logger.setLevel(getattr(logging, settings.LOG_LEVEL))

    # 이미 핸들러가 설정되어 있다면 초기화
    if logger.handlers:
        logger.handlers.clear()

    # JSON 포맷터
    formatter = CustomJsonFormatter(
        '%(timestamp)s %(level)s %(name)s %(message)s'
    )

    # 콘솔 핸들러
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    # 파일 핸들러
    file_handler = logging.FileHandler("langgraph_server.log")
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)

    return logger

logger = setup_logger()

def log_debug(message: str, extra: Optional[Dict[str, Any]] = None) -> None:
    """디버그 레벨 로그"""
    default_logger.debug(message, extra=_format_extra(extra))

def log_info(message: str, extra: Optional[Dict[str, Any]] = None) -> None:
    """정보 레벨 로그"""
    default_logger.info(message, extra=_format_extra(extra))

def log_warning(message: str, extra: Optional[Dict[str, Any]] = None) -> None:
    """경고 레벨 로그"""
    default_logger.warning(message, extra=_format_extra(extra))

def log_error(message: str, extra: Optional[Dict[str, Any]] = None) -> None:
    """에러 레벨 로그"""
    default_logger.error(message, extra=_format_extra(extra))

def log_critical(message: str, extra: Optional[Dict[str, Any]] = None) -> None:
    """치명적 에러 레벨 로그"""
    default_logger.critical(message, extra=_format_extra(extra))