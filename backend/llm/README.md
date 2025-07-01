# Saiondo LLM Server

**FastAPI(Python) 기반의 LLM(대형 언어 모델) 연동 서버**  
Saiondo의 LLM 서버는 OpenAI, Claude 등 다양한 LLM Provider와 연동하여  
커플 대화 분석, 프롬프트 응답, 성향 리포트 등 핵심 AI 기능을 제공합니다.

## 📁 프로젝트 폴더 구조

```
llm/
├── src/
│ ├── main.py # FastAPI 앱 진입점
│ ├── api/ # 엔드포인트(라우터) 모듈
│ │ ├── chat.py
│ │ ├── feedback.py
│ │ ├── couple_analysis.py
│ │ └── health.py
│ ├── services/ # 비즈니스 로직(서비스) 모듈
│ │ ├── chat_service.py
│ │ ├── feedback_service.py
│ │ ├── couple_analysis_service.py
│ │ └── llm_provider.py # LLM 추상화/Provider
│ ├── schemas/ # Pydantic 데이터 모델
│ │ ├── chat.py
│ │ ├── feedback.py
│ │ ├── couple_analysis.py
│ │ └── init.py
│ ├── config.py # 환경설정/DI
│ └── init.py
├── requirements.txt
├── Dockerfile
├── .env.example # 환경변수 예시 파일
└── README.md
```

## 🏗️ 아키텍처 및 개발 패턴

- **FastAPI 기반 REST API 서버**
- **서비스 계층 분리**:  
  - `api/`에서 엔드포인트 정의 → `services/`에서 실제 비즈니스 로직 처리
- **LLM Provider 추상화**:  
  - `services/llm_provider.py`에서 다양한 LLM(OpenAI, Claude 등) 연동
- **Pydantic 기반 데이터 검증/직렬화**
- **확장성 고려**:  
  - 새로운 LLM, 분석 그래프, context 관리 등 손쉽게 추가 가능
- **LangSmith 연동**:  
  - LangChain 기반 LLM 호출의 실시간 트레이싱/디버깅/평가 지원

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
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
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

- 환경변수는 `.env` 파일로 주입하거나, `-e` 옵션으로 직접 전달할 수 있습니다.

### 3. **docker-compose 사용 예시**

```sh
docker compose up -d llm
```
- `docker-compose.yml` 파일에서 환경변수, 볼륨, 포트 등을 관리할 수 있습니다.

## �� API 테스트 예시

### 1. **헬스체크**

```sh
curl http://localhost:8000/health
```

### 2. **채팅 LLM 응답**

```sh
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "안녕!", "model": "openai"}'
```

- Swagger UI([http://localhost:8000/docs](http://localhost:8000/docs))에서도 직접 테스트 가능

## 🛠️ Trouble Shooting

- **환경변수 누락**:  
  - `.env` 파일에 OPENAI_API_KEY 등 필수 값이 있는지 확인
- **포트 충돌**:  
  - 8000 포트가 이미 사용 중이면 다른 포트로 변경
- **외부 LLM API Key 오류**:  
  - 올바른 키/권한인지 확인
- **패키지 설치 오류**:  
  - python, pip, venv 버전 확인

## 🏗️ 확장/기여 가이드

- **새로운 LLM Provider 추가**:  
  - `src/services/llm_provider.py`에 구현 후, 서비스에 등록
- **새로운 분석/그래프 기능 추가**:  
  - `src/graph/`, `src/mcp/`에 모듈 추가
- **FastAPI 라우터 확장**:  
  - `src/api/`에 엔드포인트 추가
- **테스트 코드 작성**:  
  - `test/` 폴더에 단위/통합 테스트 추가

## 🧑‍🔬 LangSmith 실험/트레이싱 연동

1. **LangSmith 계정 및 API Key 준비**  
   - [LangSmith 가입](https://smith.langchain.com/) 후 API Key 발급

2. **의존성 설치**  
   ```sh
   pip install langsmith
   ```

3. **환경변수 설정**  
   - `.env`에 아래 값 추가:
     ```
     LANGCHAIN_TRACING_V2=true
     LANGCHAIN_API_KEY=your-langsmith-api-key
     LANGCHAIN_PROJECT=saiondo-llm
     ```

4. **코드에 LangSmith 트레이서 적용**  
   - LLM 객체 생성 시 `callbacks=[tracer]` 추가

5. **LangSmith 대시보드에서 실험 결과 확인**  
   - [LangSmith 대시보드](https://smith.langchain.com/)에서 확인

> **운영/보안 팁**:  
> - API Key 등 민감 정보는 환경변수(.env)로 관리  
> - 개인정보/민감정보는 트레이스에 포함되지 않도록 주의

## 📚 기타 참고

- API 서버(`api/`)에서 HTTP로 호출하여 통합 사용
- 환경 변수, API Key 등은 `.env` 또는 docker-compose로 관리
- 예시 curl 명령어 및 샘플 요청/응답은 README 상단 참고
- [LangSmith 활용 가이드](./docs/README-SMITH.md) 참고
