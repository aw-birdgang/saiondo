# Saiondo LLM Server

FastAPI(Python) 기반의 LLM(대형 언어 모델) 연동 서버입니다.

## 📁 프로젝트 폴더 구조**

llm/
├── src/
│   ├── main.py                # FastAPI 앱 진입점
│   ├── api/                   # 모든 라우터(엔드포인트) 모듈
│   │   ├── chat.py
│   │   ├── feedback.py
│   │   ├── couple_analysis.py
│   │   └── health.py
│   ├── services/              # 비즈니스 로직(서비스) 모듈
│   │   ├── chat_service.py
│   │   ├── feedback_service.py
│   │   ├── couple_analysis_service.py
│   │   └── llm_provider.py    # LLM 추상화/Provider
│   ├── schemas/               # Pydantic 데이터 모델
│   │   ├── chat.py
│   │   ├── feedback.py
│   │   ├── couple_analysis.py
│   │   └── __init__.py
│   ├── config.py              # 환경설정/DI
│   └── __init__.py
├── requirements.txt
├── Dockerfile
└── README.md


## 🏗️ 아키텍처 및 개발 패턴

- **FastAPI 기반 REST API 서버**
- **서비스 계층 분리**:  
  - `routes.py`에서 엔드포인트 정의 → `llm.py`/`providers/`에서 실제 LLM 호출
- **LLM Provider 추상화**:  
  - `src/providers/`에 OpenAI, Claude 등 다양한 LLM 연동 구현
- **Pydantic 기반 데이터 검증/직렬화**
- **확장성 고려**:  
  - 새로운 LLM, 분석 그래프, context 관리 등 손쉽게 추가 가능

## 🧩 주요 도메인

- **/chat**: 프롬프트 기반 LLM 응답 API (OpenAI, Claude 등 선택)
- **/analyze**: 사용자/파트너 프롬프트, 메타데이터 기반 관계 분석
- **/health**: 헬스체크
- **providers/**: LLM API 연동(OpenAI, Claude 등)
- **graph/**: 관계 분석 그래프, 노드 등
- **mcp/**: 대화 context 등 도메인별 유틸리티

## ⚙️ 기술 스택 및 주요 의존성

- **Python 3.11+**
- **FastAPI**: 웹 프레임워크
- **Uvicorn**: ASGI 서버
- **Pydantic**: 데이터 모델/검증
- **langchain, langgraph**: LLM 워크플로우/그래프
- **openai, requests**: 외부 LLM API 연동
- **python-dotenv**: 환경변수 관리

> 주요 의존성은 `requirements.txt` 참고

## 🚀 개발/실행/배포

1. **가상환경 생성 및 의존성 설치**
   ```sh
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
2. **개발 서버 실행**
   ```sh
   uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
   ```
3. **Docker 빌드/실행**
   ```sh
   docker build -t saiondo-llm .
   docker run -p 8000:8000 saiondo-llm
   ```

### Docker로 실행

- **docker-compose 연동 예시**
  ```sh
  docker compose up -d llm
  ```

## 🧪 테스트

- (별도 테스트 프레임워크/코드 미포함, FastAPI 엔드포인트 테스트 권장)
- 예시:
  ```sh
  curl http://localhost:8000/health
  curl -X POST http://localhost:8000/chat -H "Content-Type: application/json" -d '{"prompt": "안녕!", "model": "openai"}'
  ```

## 🛠️ 주요 명령어

- **가상환경 생성**
  ```sh
  python3 -m venv venv
  source venv/bin/activate
  ```
- **의존성 설치**
  ```sh
  pip install -r requirements.txt
  ```
- **개발 서버 실행**
  ```sh
  uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
  ```
- **Docker 빌드/실행**
  ```sh
  docker build -t saiondo-llm .
  docker run -p 8000:8000 saiondo-llm
  ```

## 🛡️ Trouble Shooting

- **환경변수 누락**: OPENAI_API_KEY 등은 .env 또는 docker-compose로 주입 필요
- **포트 충돌**: 8000 포트 사용 중인지 확인
- **외부 LLM API Key 오류**: 올바른 키/권한 확인
- **패키지 설치 오류**: python, pip, venv 버전 확인

## 🏗️ 기여/확장

- 새로운 LLM Provider 추가: `src/providers/`에 구현 후, `llm.py`에 등록
- 새로운 분석/그래프 기능 추가: `src/graph/`, `src/mcp/`에 모듈 추가
- FastAPI 라우터 확장: `src/routes.py`에 엔드포인트 추가

## 📚 기타

- API 서버(`api/`)에서 HTTP로 호출하여 통합 사용
- 환경변수, API Key 등은 .env 또는 docker-compose로 관리
- 예시 curl 명령어 및 샘플 요청/응답은 README 상단 참고

## 🧑‍🔬 LangSmith 실험/트레이싱 연동 가이드

LLM 호출 및 체인 실행 과정을 [LangSmith](https://smith.langchain.com/)로 추적/시각화할 수 있습니다.

### 1. LangSmith 계정 및 API Key 준비

- [LangSmith 가입](https://smith.langchain.com/)
- 프로젝트 생성 후, **API Key** 발급

### 2. 의존성 설치

```sh
pip install langsmith
```

> `requirements.txt`에 `langsmith` 추가 권장

### 3. 환경변수 설정

`.env` 파일 또는 환경에 아래 값 추가:
```
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=your-langsmith-api-key
LANGCHAIN_PROJECT=your-project-name
```

### 4. 코드에 LangSmith 트레이서 적용

`src/providers/openai_client.py` 등 LLM 객체 생성부에 아래 코드 추가:

```python
from langchain.callbacks.tracers.langchain import LangChainTracer
import os

os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = os.getenv("LANGCHAIN_API_KEY", "")
os.environ["LANGCHAIN_PROJECT"] = os.getenv("LANGCHAIN_PROJECT", "default")

tracer = LangChainTracer()

openai_llm = ChatOpenAI(
    temperature=0.7,
    model_name="gpt-3.5-turbo",
    openai_api_key=os.getenv("OPENAI_API_KEY"),
    callbacks=[tracer],  # LangSmith 트레이서 콜백 추가
)
```

> **다른 LLM/체인/에이전트에도 `callbacks=[tracer]` 추가 시 자동 추적**

### 5. LangSmith 대시보드에서 실험 결과 확인

- [LangSmith 대시보드](https://smith.langchain.com/)에서 실험/트레이스 결과를 시각적으로 확인

---

**참고:**  
- API Key 등 민감 정보는 안전하게 관리하세요.
- 자세한 사용법은 [LangSmith 공식문서](https://docs.smith.langchain.com/) 참고
