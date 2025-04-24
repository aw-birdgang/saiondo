import logging
import sys
from datetime import datetime
from typing import Optional, Dict, Any
from pythonjsonlogger import jsonlogger
from app.core.config import settings

class CustomJsonFormatter(jsonlogger.JsonFormatter):
    def add_fields(self, log_record, record, message_dict):
        super(CustomJsonFormatter, self).add_fields(log_record, record, message_dict)
        log_record['timestamp'] = datetime.now().isoformat()
        log_record['level'] = record.levelname
        log_record['logger'] = record.name

def setup_logger(name: str = "langgraph_server") -> logging.Logger:
    """로거 설정 및 초기화"""
    logger = logging.getLogger(name)
    logger.setLevel(getattr(logging, settings.LOG_LEVEL))

    # 이미 핸들러가 설정되어 있다면 초기화
    if logger.handlers:
        logger.handlers.clear()

    # JSON 포맷터
    formatter = CustomJsonFormatter('%(timestamp)s %(level)s %(name)s %(message)s')

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

def log_with_context(level: str, message: str, extra: Optional[Dict[str, Any]] = None):
    """컨텍스트와 함께 로그 기록"""
    if extra is None:
        extra = {}
    
    log_func = getattr(logger, level.lower())
    log_func(message, extra=extra)

def log_debug(message: str, extra: Optional[Dict[str, Any]] = None):
    log_with_context("DEBUG", message, extra)

def log_info(message: str, extra: Optional[Dict[str, Any]] = None):
    log_with_context("INFO", message, extra)

def log_warning(message: str, extra: Optional[Dict[str, Any]] = None):
    log_with_context("WARNING", message, extra)

def log_error(message: str, extra: Optional[Dict[str, Any]] = None):
    log_with_context("ERROR", message, extra)

def log_critical(message: str, extra: Optional[Dict[str, Any]] = None):
    log_with_context("CRITICAL", message, extra)