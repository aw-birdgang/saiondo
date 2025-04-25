# LangGraph Chat Server

LangGraph를 활용한 대화형 AI 서버입니다. 텍스트 분석, 요약, 번역, 감정 분석 등의 기능을 제공합니다.

## 목차
1. [개요](#개요)
2. [시작하기](#시작하기)
3. [프로젝트 구조](#프로젝트-구조)
4. [기능 설명](#기능-설명)
5. [API 문서](#api-문서)
6. [개발 가이드](#개발-가이드)
7. [배포 가이드](#배포-가이드)
8. [테스트](#테스트)
9. [문제 해결](#문제-해결)
10. [모니터링](#모니터링)
11. [보안](#보안)
12. [성능 최적화](#성능-최적화)
13. [유지보수](#유지보수)
14. [라이선스](#라이선스)

## 개요

### 주요 기능
- 텍스트 감정 분석
- 텍스트 요약
- 다국어 번역
- 컨텍스트 기반 응답 생성
- 대화 기록 관리

### 기술 스택
- FastAPI
- LangChain
- LangGraph
- OpenAI GPT
- Python 3.9+

## 시작하기

### 사전 요구사항
- Python 3.9 이상
- pip (Python 패키지 관리자)
- Git
- OpenAI API 키

### 빠른 설치
```bash
# 저장소 클론
git clone <repository-url>
cd langgraph-server

# 환경 설정
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
.\venv\Scripts\activate  # Windows

# 의존성 설치
pip install --upgrade pip
pip install -r requirements.txt

# 환경 변수 설정
cp .env.example .env
# .env 파일 편집
```

### 실행 방법
```bash
# 개발 모드
python main.py

# 또는
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 프로젝트 구조
```
langgraph-server/
├── app/
│   ├── api/          # API 엔드포인트
│   ├── core/         # 핵심 기능
│   ├── services/     # 비즈니스 로직
│   └── utils/        # 유틸리티
├── tests/            # 테스트 코드
├── docs/             # 문서
└── scripts/          # 유틸리티 스크립트
```

## 기능 설명

### 1. 채팅 기능
- 컨텍스트 기반 대화
- 감정 분석
- 의도 파악

### 2. 도구 통합
- 웹 검색
- 계산기
- 날씨 정보

### 3. 메모리 관리
- 대화 기록 저장
- 컨텍스트 관리
- 세션 관리

## API 문서

### REST API 엔드포인트
- POST /api/v1/chat: 채팅 메시지 처리
- GET /health: 서버 상태 확인

### API 스키마

#### 요청 형식
채팅 메시지를 전송하기 위한 JSON 구조 입니다.

```json
{
    "message": "사용자 메시지",
    "history": [
        {"role": "user", "content": "이전 대화"},
        {"role": "assistant", "content": "이전 응답"}
    ]
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| message | string | 사용자가 전송하는 메시지 |
| history | array | 이전 대화 기록 배열 |
| history[].role | string | 메시지 작성자 역할 ("user" 또는 "assistant") |
| history[].content | string | 메시지 내용 |

#### 응답 형식
서버가 반환하는 응답의 JSON 구조입니다.

```json
{
    "response": "AI 응답",
    "sentiment": "감정 분석 결과",
    "intent": "의도 분석 결과",
    "tool_used": "사용된 도구"
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| response | string | AI가 생성한 응답 메시지 |
| sentiment | string | 감정 분석 결과 (긍정/부정/중립) |
| intent | string | 사용자 의도 분석 결과 |
| tool_used | string | 응답 생성에 사용된 도구 이름 |

## 개발 가이드

### 환경 설정
```ini
# .env 파일 설정
OPENAI_API_KEY=your-api-key
ENVIRONMENT=development
LOG_LEVEL=INFO
MODEL_NAME=gpt-4
MODEL_TEMPERATURE=0.7
```

### 로깅 설정
```python
from app.core.logger import logger

logger.debug("디버그 정보")
logger.info("일반 정보")
logger.warning("경고")
logger.error("오류")
```

### 개발 도구
- VS Code 설정
- 디버깅 설정
- 코드 포맷팅

## 배포 가이드

### Docker 배포
```bash
# 이미지 빌드
docker build -t langgraph-server .

# 컨테이너 실행
docker run -d -p 8000:8000 \
  --env-file .env \
  --name langgraph-server \
  langgraph-server
```

### 프로덕션 설정
```bash
# Gunicorn으로 실행
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

## 테스트

자세한 테스트 가이드는 [tests/README.md](tests/README.md)를 참조하세요.

### 테스트 실행
```bash
# 모든 테스트 실행
pytest tests/ -v

# 커버리지 리포트 생성
pytest --cov=app tests/
```

## 문제 해결

### 일반적인 문제
1. OpenAI API 오류
2. 메모리 문제
3. 성능 문제

### 로그 분석
- 로그 파일 위치
- 로그 레벨 설정
- 로그 포맷

## 모니터링

### 시스템 모니터링
- CPU 사용량
- 메모리 사용량
- 디스크 I/O

### 애플리케이션 모니터링
- API 응답 시간
- 오류율
- 동시 접속자 수

## 보안

### API 키 관리
- 환경 변수 사용
- 키 순환 정책
- 접근 제한

### 데이터 보안
- 개인정보 처리
- 데이터 암호화
- 접근 로그 관리

## 성능 최적화

### 캐싱 전략
- 응답 캐싱
- 세션 캐싱
- 메모리 관리

### 성능 튜닝
- 동시성 설정
- 메모리 최적화
- 데이터베이스 최적화

## 유지보수

### 버전 관리
- 시맨틱 버저닝
- 변경 로그
- 마이그레이션 가이드

### 문서화
- API 문서 업데이트
- 코드 주석
- 아키텍처 문서

## 라이선스

MIT License
