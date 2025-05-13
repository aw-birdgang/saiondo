# Saiondo LLM Server

FastAPI(Python) 기반의 LLM(대형 언어 모델) 연동 서버입니다.

## 📁 프로젝트 폴더 구조**

llm/
├── src/
│ ├── main.py # FastAPI 엔트리포인트
│ ├── routes.py # API 라우터
│ ├── llm.py # LLM 서비스 추상화
│ ├── schemas.py # Pydantic 데이터 모델
│ ├── providers/ # LLM API 연동(OpenAI, Claude 등)
│ ├── mcp/ # 대화 context 등 도메인 로직
│ └── graph/ # 그래프/분석 관련 로직
├── requirements.txt # Python 의존성
├── Dockerfile
├── README.md
└── venv/ # (로컬 가상환경, git 미포함)

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
