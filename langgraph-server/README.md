# LangGraph Chat Server

LangGraph를 활용한 대화형 AI 서버입니다. 텍스트 분석, 요약, 번역, 감정 분석 등의 기능을 제공합니다.

## 기능

- 텍스트 감정 분석
- 텍스트 요약
- 다국어 번역
- 컨텍스트 기반 응답 생성
- 대화 기록 관리

## 설치 방법

1. 저장소 클론
```bash
git clone <repository-url>
cd langgraph-server
```

2. 가상환경 생성 및 활성화
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
.\venv\Scripts\activate  # Windows
```

3. 의존성 설치
```bash
pip install -r requirements.txt
```

4. 환경 변수 설정
```bash
cp .env.example .env
# .env 파일을 편집하여 필요한 설정 추가
```

## 실행 방법

프로젝트 루트 디렉토리에서 다음 명령어를 실행합니다:

```bash
# 방법 1: Python으로 직접 실행
python main.py

# 방법 2: uvicorn으로 실행
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

서버는 기본적으로 http://localhost:8000 에서 실행됩니다.

## API 엔드포인트

### POST /api/chat
대화 처리 엔드포인트

요청 예시:
```json
{
    "text": "오늘은 날씨가 정말 좋네요!",
    "language": "ko",
    "user_id": "user123"
}
```

응답 예시:
```json
{
    "response": "네, 정말 좋은 날씨네요!",
    "summary": "날씨가 좋다는 언급",
    "sentiment": "긍정적",
    "translated": "The weather is really nice today!",
    "context": {}
}
```

### DELETE /api/chat/{user_id}
사용자의 대화 기록 삭제

## 환경 변수

- `OPENAI_API_KEY`: OpenAI API 키
- `ENVIRONMENT`: 실행 환경 (development/production)
- `LOG_LEVEL`: 로깅 레벨
- `MODEL_NAME`: 사용할 GPT 모델명
- `MODEL_TEMPERATURE`: 모델 temperature 값
- `SECRET_KEY`: 보안 키

## 라이선스

MIT

# 코드에서 로그 추가하기
from app.core.logger import logger

logger.debug("디버그 정보")
logger.info("정보 메시지")
logger.warning("경고 메시지")
logger.error("오류 메시지")

# 실시간 로그 확인
tail -f langgraph_server.log

# 더 자세한 로그 보기
LOG_LEVEL=DEBUG python main.py




#
````
langgraph-server/
├── app/
│   ├── __init__.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes.py
│   │   └── schemas.py
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   └── logger.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── chat_service.py
│   │   ├── llm_service.py
│   │   └── memory_service.py
│   └── utils/
│       ├── __init__.py
│       └── helpers.py
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   └── test_services/
│       ├── __init__.py
│       ├── test_chat_service.py
│       └── test_llm_service.py
├── .env.example
├── .gitignore
├── main.py
├── README.md
└── requirements.txt
````
