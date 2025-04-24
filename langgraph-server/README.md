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

#기본 대화 테스트:
```bash
curl -X POST "http://localhost:8000/api/v1/chat" \
     -H "Content-Type: application/json" \
     -d '{
       "message": "안녕하세요, 오늘 날씨가 정말 좋네요!"
     }'
```

#대화 기록을 포함한 테스트:
```bash
curl -X POST "http://localhost:8000/api/v1/chat" \
     -H "Content-Type: application/json" \
     -d '{
       "message": "그래서 오늘 공원에 산책하러 갈까 생각중이에요",
       "history": [
         {"role": "user", "content": "안녕하세요, 오늘 날씨가 정말 좋네요!"},
         {"role": "assistant", "content": "네, 정말 좋은 날씨네요! 기분 좋은 하루가 될 것 같아요."}
       ]
     }'
```

#감정 분석 테스트
```bash
curl -X POST "http://localhost:8000/api/v1/chat" \
     -H "Content-Type: application/json" \
     -d '{
       "message": "오늘 승진 소식을 들었어요! 정말 기쁩니다!"
     }'
```

#대화 종료 테스트:
```bash
curl -X POST "http://localhost:8000/api/v1/chat" \
     -H "Content-Type: application/json" \
     -d '{
       "message": "대화 종료"
     }'
```

#헬스 체크 테스트:
```bash
curl "http://localhost:8000/health"
```

#웹 검색 기능:
```bash
curl -X POST "http://localhost:8000/api/v1/chat" \
     -H "Content-Type: application/json" \
     -d '{"message": "최근 개봉한 영화 중에서 평점이 가장 높은 것 찾아보고 줄거리 알려줘"}'

curl -X POST "http://localhost:8000/api/v1/chat" \
     -H "Content-Type: application/json" \
     -d '{
       "message": "최근 인공지능 기술 트렌드에 대해 알려줘"
     }'
```

#위키피디아 검색:
```bash
curl -X POST "http://localhost:8000/api/v1/chat" \
     -H "Content-Type: application/json" \
     -d '{"message": "인공지능의 역사에 대해 알려줘"}'
```

#계산기능:
```bash
curl -X POST "http://localhost:8000/api/v1/chat" \
     -H "Content-Type: application/json" \
     -d '{"message": "345 곱하기 67은 얼마야?"}'

curl -X POST "http://localhost:8000/api/v1/chat" \
     -H "Content-Type: application/json" \
     -d '{
       "message": "234 곱하기 567은 얼마야?"
     }'
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
```
langgraph-server/
├── app/
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes.py      # API 엔드포인트
│   │   └── schemas.py     # API 요청/응답 스키마
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py      # 설정 관리
│   │   ├── log_config.py  # 로깅 기본 설정
│   │   └── logger.py      # 로깅 유틸리티
│   ├── services/
│   │   ├── __init__.py
│   │   ├── base.py        # 기본 서비스 클래스
│   │   ├── chat_service.py # 채팅 서비스
│   │   ├── llm_service.py  # LLM 서비스
│   │   └── tools.py       # 도구 서비스
│   └── __init__.py
├── tests/
│   ├── __init__.py
│   ├── conftest.py        # 테스트 설정
│   ├── test_api.py        # API 테스트
│   └── test_services.py   # 서비스 테스트
├── .env                   # 환경 변수
├── .env.example          # 환경 변수 예시
├── .gitignore
├── README.md
├── requirements.txt      # 의존성
└── main.py              # 앱 진입점
```

# 추가 도구
langchain-community>=0.0.10
wikipedia
duckduckgo-search
python-dotenv>=1.0.0
