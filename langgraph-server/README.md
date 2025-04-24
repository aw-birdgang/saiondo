# LangGraph Chat Server

LangGraph를 활용한 대화형 AI 서버입니다. 텍스트 분석, 요약, 번역, 감정 분석 등의 기능을 제공합니다.

## 목차
1. [기능](#기능)
2. [시작하기](#시작하기)
3. [아키텍처](#아키텍처)
4. [API 문서](#api-문서)
5. [개발 가이드](#개발-가이드)
6. [운영 가이드](#운영-가이드)
7. [트러블슈팅](#트러블슈팅)
8. [보안 가이드](#보안-가이드)
9. [라이선스](#라이선스)

## 기능

### 핵심 기능
- 텍스트 감정 분석
- 텍스트 요약
- 다국어 번역
- 컨텍스트 기반 응답 생성
- 대화 기록 관리

### 부가 기능
- 웹 검색 통합
- 위키피디아 검색
- 수학 계산
- 실시간 정보 조회

## 시작하기

### 사전 요구사항
- Python 3.9 이상
- OpenAI API 키
- (선택) 추가 API 키들

### 설치 방법
```bash
# 1. 저장소 클론
git clone <repository-url>
cd langgraph-server

# 2. 가상환경 설정
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
.\venv\Scripts\activate  # Windows

# 3. 의존성 설치
pip install --upgrade pip
pip install -r requirements.txt

# 4. 환경 설정
cp .env.example .env
# .env 파일 편집
```

### 환경 변수 설정
```ini
# 필수 설정
OPENAI_API_KEY=your-api-key
SECRET_KEY=your-secret-key

# 선택 설정
ENVIRONMENT=development
LOG_LEVEL=INFO
MODEL_NAME=gpt-4
MODEL_TEMPERATURE=0.7
```

### 실행 방법
```bash
# 개발 모드
python main.py

# 또는
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API 문서

### 채팅 API
#### POST /api/v1/chat
대화 처리 엔드포인트

요청 형식:
```json
{
    "message": "사용자 메시지",
    "history": [
        {"role": "user", "content": "이전 대화 내용"},
        {"role": "assistant", "content": "이전 응답"}
    ]
}
```

응답 형식:
```json
{
    "response": "AI 응답",
    "sentiment": "감정 분석 결과",
    "intent": "의도 분석 결과",
    "tool_used": "사용된 도구",
    "history": []
}
```

### 상태 확인 API
#### GET /health
서버 상태 확인

## 개발 가이드

### 로깅 시스템
```python
from app.core.logger import logger

# 로그 레벨별 사용
logger.debug("상세 디버그 정보")
logger.info("일반 정보")
logger.warning("경고")
logger.error("오류", extra={"error_details": str(e)})
```

### 로그 모니터링
```bash
# 실시간 로그
tail -f logs/langgraph_server.log

# 디버그 모드
LOG_LEVEL=DEBUG python main.py
```

## 운영 가이드

### 성능 모니터링
- API 응답 시간
- LLM 호출 지연시간
- 메모리 사용량
- 오류 발생 빈도

### 백업 및 복구
- 대화 기록 백업
- 설정 파일 백업
- 복구 절차

## 트러블슈팅

### 일반적인 문제
1. OpenAI API 오류
   - API 키 확인
   - 할당량 확인
   - 네트워크 연결 확인

2. 메모리 문제
   - 대화 기록 정리
   - 캐시 정리
   - 리소스 모니터링

3. 성능 문제
   - 로그 레벨 조정
   - 동시 요청 제한
   - 캐싱 활성화

## 보안 가이드

### API 키 관리
- 환경 변수 사용
- 키 순환 정책
- 접근 제한

### 데이터 보안
- 개인정보 처리
- 데이터 암호화
- 접근 로그 관리

## 라이선스
MIT License

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

## 종속성 분석

프로젝트의 주요 종속성을 그룹별로 설명합니다:

### 1. 웹 프레임워크
- **FastAPI (>=0.104.1)**
  - 고성능 비동기 웹 프레임워크
  - 자동 API 문서화 (Swagger/OpenAPI)
  - Pydantic 기반 데이터 검증
  - 비동기 요청 처리
- **Uvicorn (>=0.24.0)**
  - ASGI 서버 구현체
  - FastAPI 애플리케이션 실행
  - 고성능 비동기 처리
- **python-multipart (>=0.0.6)**
  - 파일 업로드 처리
  - form-data 지원

### 2. LLM & AI
- **LangChain (>=0.1.0)**
  - LLM 애플리케이션 개발 프레임워크
  - 체인과 에이전트 구현
  - 프롬프트 관리
- **LangChain Core (>=0.1.16)**
  - LangChain 핵심 기능
  - 기본 인터페이스 및 추상화
- **LangChain OpenAI (>=0.0.5)**
  - OpenAI 모델 통합
  - GPT 모델 접근
- **LangChain Community (>=0.0.10)**
  - 커뮤니티 기여 도구
  - 추가 기능 통합
- **OpenAI (>=1.10.0,<2.0.0)**
  - OpenAI API 클라이언트
  - GPT 모델 사용

### 3. LangGraph
- **LangGraph (>=0.0.10)**
  - LLM 기반 워크플로우 관리
  - 상태 기계 구현
  - 대화 흐름 제어
  - 에이전트 간 상호작용

### 4. 도구 및 유틸리티
- **검색 도구**
  - wikipedia-api (>=0.6.0): 위키피디아 검색
  - duckduckgo-search (>=4.1.1): 웹 검색
  - google-search-results (>=2.4.2): 구글 검색
  - wolframalpha (>=5.0.0): 수학/과학 계산
- **HTTP 클라이언트**
  - requests (>=2.31.0): 동기식 HTTP 요청
  - aiohttp (>=3.9.1): 비동기식 HTTP 요청
  - beautifulsoup4 (>=4.12.2): HTML 파싱
- **환경 설정**
  - python-dotenv (>=1.0.0): 환경변수 관리

### 5. 데이터 처리
- **Pydantic (>=2.5.2)**
  - 데이터 검증
  - API 스키마 정의
  - 설정 관리
- **보안**
  - python-jose (>=3.3.0): JWT 처리
  - passlib (>=1.7.4): 비밀번호 해싱
  - bcrypt (>=4.0.1): 암호화

### 6. 로깅
- **python-json-logger (>=2.0.7)**
  - JSON 형식 로그 출력
  - 구조화된 로깅
- **structlog (>=24.1.0)**
  - 컨텍스트 기반 로깅
  - 로그 이벤트 구조화

### 7. 테스팅
- **pytest (>=7.4.3)**
  - 테스트 프레임워크
  - 테스트 실행 및 관리
- **pytest-asyncio (>=0.21.0)**
  - 비동기 테스트 지원
- **pytest-cov (>=4.1.0)**
  - 코드 커버리지 측정
- **httpx (>=0.24.0)**
  - 비동기 HTTP 테스트

### 8. 개발 도구
- **코드 품질**
  - black (>=23.12.1): 코드 포맷팅
  - isort (>=5.13.2): import 문 정렬
  - flake8 (>=7.0.0): 코드 린팅
  - mypy (>=1.8.0): 정적 타입 검사

## 버전 호환성

- 모든 패키지는 서로 호환되는 버전으로 선택되었습니다
- OpenAI 패키지는 1.10.0 이상 2.0.0 미만 버전으로 제한되어 있습니다
- LangChain 관련 패키지들은 최신 버전과 호환됩니다

## 패키지 업데이트

패키지 업데이트가 필요한 경우:

```bash
# 가상환경 활성화
source venv/bin/activate  # Linux/Mac
# or
.\venv\Scripts\activate  # Windows

# pip 업그레이드
pip install --upgrade pip

# 패키지 업데이트
pip install --upgrade -r requirements.txt
```

## 주의사항

1. OpenAI API 키가 필요합니다
2. 일부 도구는 추가 API 키가 필요할 수 있습니다
3. 개발 도구는 개발 환경에서만 필요합니다

# 프로젝트 아키텍처

## 전체 아키텍처 개요

LangGraph Server는 계층화된 아키텍처를 사용하여 관심사를 분리하고 유지보수성을 높였습니다.

```ascii
+------------------+
|     API Layer    |
|  (FastAPI Routes)|
+--------+---------+
         |
+--------+---------+
|  Service Layer   |
| (Business Logic) |
+--------+---------+
         |
+--------+---------+
|   Core Layer     |
| (Infrastructure) |
+--------+---------+
```

## 계층 구조 상세 설명

### 1. API 계층 (app/api/)
프레젠테이션 계층으로 HTTP 요청을 처리합니다.

```tree
app/api/
├── routes.py      # API 엔드포인트 정의
├── schemas.py     # 요청/응답 데이터 모델
└── dependencies.py # 의존성 주입
```

주요 컴포넌트:
- **routes.py**: API 엔드포인트 정의
  - 요청 처리 및 라우팅
  - 입력 유효성 검사
  - 응답 포맷팅
- **schemas.py**: Pydantic 모델
  - API 요청/응답 스키마
  - 데이터 검증 규칙
- **dependencies.py**: 의존성 주입
  - 서비스 인스턴스 제공
  - 미들웨어 설정

### 2. 서비스 계층 (app/services/)
비즈니스 로직을 처리하는 핵심 계층입니다.

```tree
app/services/
├── base.py        # 기본 서비스 클래스
├── chat_service.py # 채팅 처리
├── llm_service.py  # LLM 통합
├── memory_service.py # 대화 기억
└── tools/         # 외부 도구
    ├── search.py  # 검색 도구
    ├── calc.py    # 계산 도구
    └── wiki.py    # 위키피디아 도구
```

주요 서비스:
- **ChatService**: 대화 처리 및 관리
  - 메시지 처리 로직
  - 대화 컨텍스트 관리
  - 응답 생성 조정

- **LLMService**: LLM 통합 및 관리
  - OpenAI API 통합
  - 프롬프트 관리
  - 모델 파라미터 설정

- **MemoryService**: 대화 기억 관리
  - 대화 히스토리 저장
  - 컨텍스트 검색
  - 메모리 최적화

- **ToolService**: 외부 도구 통합
  - 검색 기능
  - 계산 기능
  - 위키피디아 조회

### 3. 코어 계층 (app/core/)
인프라스트럭처 및 공통 기능을 제공합니다.

```tree
app/core/
├── config.py      # 설정 관리
├── logger.py      # 로깅 시스템
├── security.py    # 보안 기능
└── exceptions.py  # 예외 처리
```

주요 기능:
- **설정 관리**
  - 환경 변수 처리
  - 앱 설정 관리
  - 보안 설정

- **로깅 시스템**
  - 구조화된 로깅
  - 로그 레벨 관리
  - 로그 포맷팅

- **보안 기능**
  - 인증/인가
  - API 키 관리
  - 데이터 암호화

## 데이터 흐름

```ascii
Client Request
      ↓
API Routes (FastAPI)
      ↓
Request Validation (Pydantic)
      ↓
Service Layer
      ↓
LLM Processing (LangChain)
      ↓
Response Generation
      ↓
Client Response
```

1. 클라이언트 요청 수신
2. API 계층에서 요청 검증
3. 서비스 계층에서 비즈니스 로직 처리
4. LLM을 통한 응답 생성
5. 결과 포맷팅 및 응답 전송

## 주요 처리 흐름

### 1. 채팅 요청 처리
```ascii
Chat Request → ChatService → LLMService → Response
     ↑            ↓             ↓
     └── Memory ←─┘        Tool Service
```

### 2. 도구 사용 흐름
```ascii
User Query → Intent Analysis → Tool Selection → Tool Execution
     ↑            ↓                ↓               ↓
     └── Response Generation ←─ Result Processing ←┘
```

## 확장성

프로젝트는 다음과 같은 방식으로 확장 가능합니다:

1. **새로운 도구 추가**
   - `app/services/tools/` 디렉토리에 새 도구 추가
   - `ToolService`에 도구 등록

2. **새로운 엔드포인트 추가**
   - `app/api/routes.py`에 새 라우트 추가
   - 필요한 스키마를 `schemas.py`에 정의

3. **새로운 서비스 추가**
   - `app/services/`에 새 서비스 클래스 추가
   - `BaseService` 상속하여 구현

## 테스트 구조

```tree
tests/
├── conftest.py        # 테스트 설정
├── test_api/         # API 테스트
├── test_services/    # 서비스 테스트
└── test_tools/       # 도구 테스트
```

각 계층별 테스트:
- 단위 테스트: 개별 컴포넌트 테스트
- 통합 테스트: 컴포넌트 간 상호작용 테스트
- E2E 테스트: 전체 시스템 테스트

## 모니터링 및 로깅

시스템은 다음 항목을 모니터링합니다:

1. **성능 메트릭**
   - 응답 시간
   - LLM 호출 지연시간
   - 메모리 사용량

2. **에러 추적**
   - 예외 발생 위치
   - 스택 트레이스
   - 컨텍스트 정보

3. **사용량 통계**
   - API 호출 수
   - 도구 사용 빈도
   - 성공/실패 비율
