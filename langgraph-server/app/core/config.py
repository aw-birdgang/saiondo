from functools import lru_cache
from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import Field, SecretStr

class Settings(BaseSettings):
    # API 설정
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "LangGraph Server"
    
    # 서버 설정
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    RELOAD: bool = True
    ENVIRONMENT: str = "development"
    
    # 보안 설정
    SECRET_KEY: str = Field(
        default="your-secret-key-here",
        env="SECRET_KEY",
        description="JWT 토큰 생성에 사용되는 비밀 키"
    )
    
    # OpenAI 설정
    OPENAI_API_KEY: Optional[SecretStr] = Field(
        default=None,
        env="OPENAI_API_KEY",
        description="OpenAI API 키"
    )
    MODEL_NAME: str = Field(
        default="gpt-3.5-turbo",
        env="MODEL_NAME",
        description="사용할 OpenAI 모델 이름"
    )
    MODEL_TEMPERATURE: float = Field(
        default=0.7,
        env="MODEL_TEMPERATURE",
        description="모델 temperature 설정"
    )
    
    # 로깅 설정
    LOG_LEVEL: str = Field(
        default="INFO",
        env="LOG_LEVEL",
        description="로깅 레벨"
    )
    
    # CORS 설정
    CORS_ORIGINS: List[str] = Field(
        default=["*"],
        env="CORS_ORIGINS",
        description="CORS 허용 도메인"
    )
    
    # WeatherAPI.com API 설정
    WEATHER_API_KEY: SecretStr
    
    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'
        case_sensitive = True
        extra = "allow"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # 설정 유효성 검사
        if not self.OPENAI_API_KEY:
            from app.core.log_config import default_logger
            default_logger.warning("OpenAI API 키가 설정되지 않았습니다.")

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()