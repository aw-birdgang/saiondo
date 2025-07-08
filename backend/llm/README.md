# SAIONDO LLM Server

**FastAPI(Python) 기반의 LLM(대형 언어 모델) 연동 서버**  
SAIONDO의 LLM 서버는 OpenAI, Claude 등 다양한 LLM Provider와 연동하여  
커플 대화 분석, AI 챗봇, 성향 분석, 피드백 수집 등 핵심 AI 기능을 제공합니다.

## 📁 프로젝트 폴더 구조

```
llm/
├── src/
│ ├── main.py # FastAPI 앱 진입점
│ ├── config.py # 환경설정/DI
│ ├── api/ # 엔드포인트(라우터) 모듈
│ │ ├── chat.py # 기본 채팅 API
│ │ ├── chat_relationship_coach.py # 관계 코치 채팅
│ │ ├── couple_analysis.py # 기본 커플 분석
│ │ ├── enhanced_couple_analysis.py # 향상된 커플 분석
│ │ ├── batch_analysis.py # 배치 분석
│ │ ├── feedback.py # 피드백 수집
│ │ ├── health.py # 헬스체크
│ │ ├── labeling.py # 라벨링
│ │ ├── labeling_trait_vector.py # 특성 벡터 라벨링
│ │ └── prompt.py # 프롬프트 관리
│ ├── services/ # 비즈니스 로직(서비스) 모듈
│ │ ├── llm_provider.py # LLM 추상화/Provider
│ │ ├── chat_service.py # 채팅 서비스
│ │ ├── chat_relationship_coach_service.py # 관계 코치 서비스
│ │ ├── couple_analysis_service.py # 기본 커플 분석
│ │ ├── enhanced_couple_analysis_service.py # 향상된 커플 분석
│ │ ├── analysis_validator.py # 데이터 검증
│ │ ├── analysis_cache.py # 캐싱 서비스
│ │ ├── feedback_service.py # 피드백 서비스
│ │ ├── labeling_service.py # 라벨링 서비스
│ │ ├── labeling_trait_vector_service.py # 특성 벡터 서비스
│ │ └── prompt_service.py # 프롬프트 서비스
│ ├── schemas/ # Pydantic 데이터 모델
│ │ ├── chat.py
│ │ ├── chat_relationship_coach.py
│ │ ├── couple_analysis.py
│ │ ├── enhanced_couple_analysis.py
│ │ ├── feedback.py
│ │ ├── labeling.py
│ │ ├── labeling_trait_vector.py
│ │ └── prompt.py
│ ├── providers/ # LLM Provider 구현
│ │ ├── openai_client.py # OpenAI API 클라이언트
│ │ └── claude_client.py # Claude API 클라이언트
│ ├── core/ # 핵심 유틸리티
│ │ └── labeling/ # 라벨링 관련 유틸리티
│ ├── graph/ # LangGraph 워크플로우
│ │ ├── nodes.py # 그래프 노드 정의
│ │ └── love_analysis_graph.py # 사랑 분석 그래프
│ ├── mcp/ # Model Context Protocol
│ │ └── context.py # 대화 컨텍스트 관리
│ └── tests/ # 테스트 코드
│ ├── test_enhanced_couple_analysis.py
│ └── labeling/
├── docs/ # 문서
│ └── langsmith-guide.md # LangSmith 가이드
├── puml/ # PlantUML 다이어그램
├── requirements.txt # Python 의존성
├── Dockerfile # Docker 이미지
├── Dockerfile.dev # 개발용 Docker 이미지
├── run_server.sh # 서버 실행 스크립트
├── .env.example # 환경변수 예시
└── README.md # 프로젝트 문서
```

## 🏗️ 아키텍처 및 개발 패턴

### **계층 구조**

```
┌─────────────────────────────────────┐
│           API Layer                 │
│  (FastAPI Routers)                 │
├─────────────────────────────────────┤
│         Service Layer              │
│  (Business Logic)                  │
├─────────────────────────────────────┤
│        Provider Layer              │
│  (LLM Integration)                 │
├─────────────────────────────────────┤
│         Core Layer                 │
│  (Utilities & Helpers)             │
└─────────────────────────────────────┘
```

## 🧩 주요 도메인

- **/chat**: 프롬프트 기반 LLM 응답 API (OpenAI, Claude 등 선택)
- **/analyze**: 사용자/파트너 프롬프트, 메타데이터 기반 관계 분석
- **/feedback**: 사용자 피드백 수집/저장
- **/health**: 헬스체크
- **providers/**: LLM API 연동(OpenAI, Claude 등)
- **graph/**: 관계 분석 그래프, 노드 등
- **mcp/**: 대화 context 등 도메인별 유틸리티

## ⚙️ 주요 기술 스택

- **Python 3.11+**
- **FastAPI**: 웹 프레임워크
- **Uvicorn**: ASGI 서버
- **Pydantic**: 데이터 모델/검증
- **langchain, langgraph**: LLM 워크플로우/그래프
- **openai, requests**: 외부 LLM API 연동
- **python-dotenv**: 환경변수 관리
- **langsmith**: LLM 트레이싱/실험/평가 (옵션)

> 주요 의존성은 `requirements.txt` 참고

## 🚀 실행 방법 (로컬 개발 환경)

### 1. **가상환경 생성 및 의존성 설치**

```sh
cd llm
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. **환경변수(.env) 설정**

- `.env.example` 파일을 참고하여 `.env` 파일을 생성하고, 필요한 API Key 및 환경변수를 입력하세요.
  ```
  cp .env.example .env
  # .env 파일을 열어 OPENAI_API_KEY 등 값 입력
  ```

### 3. **개발 서버 실행**

```sh
cd backend/llm
PYTHONPATH=src uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```
- 서버가 정상적으로 실행되면, [http://localhost:8000/docs](http://localhost:8000/docs)에서 Swagger UI로 API를 테스트할 수 있습니다.

## 🐳 Docker로 실행

### 1. **Docker 이미지 빌드**

```sh
docker build -t saiondo-llm .
```

### 2. **컨테이너 실행**

```sh
docker run --env-file .env -p 8000:8000 saiondo-llm
```

## 🔄 **주요 개선사항**

### **1. 구조 업데이트**
- 현재 프로젝트 구조에 맞게 폴더 구조 완전 업데이트
- 새로 추가된 모듈들 반영 (enhanced_couple_analysis, batch_analysis 등)

### **2. API 문서화 강화**
- 실제 API 엔드포인트와 사용 예시 추가
- curl 명령어로 실제 테스트 가능한 예시 제공

### **3. 개발 가이드 확장**
- 새로운 기능 추가 방법 상세 가이드
- LangGraph 워크플로우 추가 방법
- LLM Provider 확장 방법

### **4. 테스트 섹션 추가**
- pytest 기반 테스트 실행 방법
- 테스트 구조 및 커버리지 정보

### **5. 모니터링 및 로깅**
- LangSmith 트레이싱 설정
- 구조화된 로깅 설정
- 디버깅 방법

### **6. 배포 가이드**
- Production 환경 설정
- Docker 배포 방법
- Gunicorn 사용법

### **7. 문제 해결 섹션**
- 일반적인 문제와 해결 방법 테이블
- 디버깅 명령어

### **8. 기여 가이드**
- Pull Request 프로세스
- 코드 스타일 가이드
- 개발 환경 설정

이제 README.md가 현재 프로젝트 구조와 완전히 일치하며, 개발자들이 쉽게 프로젝트를 이해하고 기여할 수 있도록 최적화되었습니다!

## 🔧 개발 가이드

### **새로운 API 엔드포인트 추가**

1. **스키마 정의** (`src/schemas/`)
```python
from pydantic import BaseModel

class NewRequest(BaseModel):
    field: str

class NewResponse(BaseModel):
    result: str
```

2. **서비스 로직** (`src/services/`)
```python
class NewService:
    def process(self, data: str) -> str:
        return f"Processed: {data}"

new_service = NewService()
```

3. **API 엔드포인트** (`src/api/`)
```python
from fastapi import APIRouter
from schemas.new import NewRequest, NewResponse
from services.new_service import new_service

router = APIRouter()

@router.post("/new", response_model=NewResponse)
def new_endpoint(request: NewRequest):
    result = new_service.process(request.field)
    return NewResponse(result=result)
```

4. **메인 앱에 등록** (`src/main.py`)
```python
from api.new import router as new_router
app.include_router(new_router)
```

### **새로운 LLM Provider 추가**

1. **Provider 클라이언트** (`src/providers/`)
```python
def ask_new_llm(prompt: str) -> str:
    # 새로운 LLM API 호출 로직
    return response
```

2. **LLM Provider에 등록** (`src/services/llm_provider.py`)
```python
from providers.new_client import ask_new_llm

class LLMProvider:
    def ask(self, prompt: str, model: str = None) -> str:
        if model == "new_llm":
            return ask_new_llm(prompt)
        # ... 기존 로직
```

### **LangGraph 워크플로우 추가**

1. **노드 정의** (`src/graph/nodes.py`)
```python
def new_analysis_node(state):
    # 분석 로직
    return {"result": "analysis_result"}
```

2. **그래프 구성** (`src/graph/new_graph.py`)
```python
from langgraph.graph import StateGraph

def create_new_graph():
    workflow = StateGraph(StateType)
    workflow.add_node("analyze", new_analysis_node)
    return workflow.compile()
```

## 🤝 문제 해결

### **일반적인 문제**

| 문제 | 해결 방법 |
|------|-----------|
| 환경변수 누락 | `.env` 파일에 필수 API 키 확인 |
| 포트 충돌 | 다른 포트 사용: `--port 8001 |
| LLM API 오류 | API 키 유효성 및 할당량 확인 |
| 패키지 설치 오류 | Python 버전 확인 (3.11+) |
| Redis 연결 오류 | Redis 서버 실행 또는 캐싱 비활성화 |

### **디버깅**

```bash
# 상세 로그와 함께 실행
uvicorn src.main:app --reload --log-level debug

# 특정 모듈 로그 확인
export PYTHONPATH=src
python -c "from services.llm_provider import llm_provider; print(llm_provider.ask('test'))"
```

## 📊 모니터링 및 로깅

### **LangSmith 트레이싱**

```bash
# 환경변수 설정
export LANGCHAIN_TRACING_V2=true
export LANGCHAIN_API_KEY=your-key
export LANGCHAIN_PROJECT=saiondo-llm

# 서버 실행
uvicorn src.main:app --reload
```

### **로깅 설정**

```python
import structlog

structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)
```

## 🚀 배포

### **Production 환경**

```bash
# 프로덕션 서버 실행
uvicorn src.main:app --host 0.0.0.0 --port 8000 --workers 4

# Gunicorn 사용 (권장)
gunicorn src.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### **Docker Production**

```dockerfile
# Dockerfile.prod
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY src/ ./src/
EXPOSE 8000

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 📚 추가 문서

- **[LangSmith 가이드](./docs/langsmith-guide.md)**: LLM 실험 및 트레이싱
- **[API 문서](http://localhost:8000/docs)**: Swagger UI
- **[ReDoc 문서](http://localhost:8000/redoc)**: 대안 API 문서

## 🤝 기여 가이드

1. **Fork & Clone** 저장소
2. **Feature Branch** 생성: `git checkout -b feature/new-feature`
3. **코드 작성** 및 **테스트 추가**
4. **커밋**: `git commit -m "feat: add new feature"`
5. **Push**: `git push origin feature/new-feature`
6. **Pull Request** 생성

### **코딩 스타일**

- **Black**: 코드 포맷팅
- **isort**: import 정렬
- **flake8**: 린팅
- **mypy**: 타입 체크

```bash
# 코드 포맷팅
black src/
isort src/
flake8 src/
mypy src/
```

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 지원

- **이슈 리포트**: GitHub Issues
- **문서**: [API 문서](http://localhost:8000/docs)
- **개발팀**: dev@saiondo.com

---

**SAIONDO LLM Server** - 커플을 위한 AI 분석 플랫폼