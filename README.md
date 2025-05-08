# Saiondo

**Saiondo**는 연인/커플의 대화와 성향을 분석하여 맞춤형 조언을 제공하는 AI 기반 커플 케어 서비스입니다.

---

## 🏗️ 프로젝트 구조

saiondo/
├── backend/         # 백엔드 모노레포 (NestJS API + FastAPI LLM)
│   ├── api/         # 메인 REST API (NestJS, Prisma, PostgreSQL)
│   └── llm/         # LLM 연동 서버 (FastAPI, LangChain, OpenAI/Claude)
├── frontend/        # Flutter 기반 모바일/웹 앱
│   └── app/         # 실제 Flutter 프로젝트
├── infrastructure/  # (비어있음, 인프라 관련 확장 가능)
├── puml/            # ERD, 시퀀스 등 UML 다이어그램
├── docs/            # (비어있음, 문서 확장 가능)
├── README.md        # 프로젝트 최상단 설명
└── 기타 설정 파일

---

## 🚀 주요 기능

- **AI 기반 커플 대화 분석 및 조언**
- **1:1 대화방, 성향 분석, 리포트 제공**
- **OpenAI/Claude 등 LLM 연동**
- **Flutter 기반 모바일/웹 앱**
- **REST API, 인증, 결제 등 지원**

---

## 🔗 시스템 구성도



## 🛠️ 개발/실행

### 백엔드
- `cd backend/api && yarn install`
- `cd backend/llm && pip install -r requirements.txt`
- `cd backend && docker compose up -d`

### 프론트엔드
- `cd frontend/app`
- `fvm flutter pub get`
- `fvm flutter run -d chrome` (웹) 또는 `fvm flutter run` (모바일)

## 🗃️ 데이터베이스 ERD

- User, Relationship, ChatHistory, PersonaProfile, AdviceReport 등 주요 엔티티로 구성
- 상세 ERD 및 시퀀스는 `puml/` 참고

## 📚 참고

- 각 디렉토리별 README 및 코드 주석 참고
- 문의/이슈: 팀 슬랙 또는 깃허브 이슈

---

## 📞 호출 구조 파이프라인

[Flutter App (사용자 프롬프트 입력)]
│
▼
[REST API 호출 (NestJS)]
│
▼
[LLM Proxy API (NestJS 내부)]
│
▼
[LLM 서버 (FastAPI + LangChain)]
│
▼
[외부 LLM (OpenAI, Claude 등)]
│
▼
[LLM 서버 → 분석 결과 반환]
│
▼
[NestJS API → 결과 가공/저장]
│
▼
[Flutter App에 결과 응답]

