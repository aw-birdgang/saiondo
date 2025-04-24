import logging
import sys
from datetime import datetime
from typing import Optional, Dict, Any
from pythonjsonlogger import jsonlogger

class CustomJsonFormatter(jsonlogger.JsonFormatter):
    def add_fields(self, log_record: Dict[str, Any], record: logging.LogRecord, message_dict: Dict[str, Any]) -> None:
        super(CustomJsonFormatter, self).add_fields(log_record, record, message_dict)
        log_record['timestamp'] = datetime.now().isoformat()
        log_record['level'] = record.levelname
        log_record['logger'] = record.name

def get_logger(name: str = "langgraph_server", level: str = "INFO") -> logging.Logger:
    """기본 로거 설정"""
    logger = logging.getLogger(name)
    logger.setLevel(getattr(logging, level))

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

# 기본 로거 인스턴스
default_logger = get_logger()

def _format_extra(extra: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """로그 추가 데이터 포맷팅"""
    if extra is None:
        return {}
    return {k: v for k, v in extra.items() if k != 'message'}
