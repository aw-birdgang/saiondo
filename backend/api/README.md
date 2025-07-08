# 🛡️ Saiondo API Server

**Saiondo**의 메인 백엔드 API 서버는 **NestJS(Typescript)**와 **Prisma ORM** 기반으로  
커플 대화/분석/리포트 등 핵심 비즈니스 로직을 제공합니다.

---

<p align="center">
  <img src="../../assets/images/api/architecture.png" alt="API 아키텍처" width="600"/>
</p>

---

## 📁 프로젝트 폴더 구조

```plaintext
api/
├── src/
│   ├── modules/      # 도메인별 controller, service, dto, prisma repository
│   ├── common/       # 공통 유틸리티, enum, 타입, 예외처리 등
│   ├── config/       # 환경설정 (env, config service 등)
│   └── database/     # DB 커넥션, 확장/리팩토링용
├── prisma/           # Prisma schema, 마이그레이션, seed, client
├── test/             # 단위/통합 테스트 코드
├── Dockerfile
├── docker-compose.yml
├── package.json
└── tsconfig.json
```

---

## 🏗️ 아키텍처 및 개발 패턴

- **NestJS 모듈러 구조**: 도메인별 service/controller/dto 분리, DI 기반 확장성
- **Prisma ORM + PostgreSQL**: `schema.prisma`에서 모델/enum 관리, 타입 안전성
- **Swagger**: API 문서 자동화 (`/api-docs`)
- **Jest**: 단위/통합 테스트
- **CQRS, EventEmitter, WebSocket 등**: 확장성 높은 NestJS 기능 적극 활용
- **환경변수/설정**: `.env`, `src/config/`에서 통합 관리

---

## 🧩 주요 도메인

- **User**: 사용자 정보, 인증/인가(JWT)
- **Relationship**: 1:1 관계(초대→수락→room 생성)
- **Room**: 1:1 대화 공간
- **Chat**: 대화 기록, 메시지/이벤트 관리
- **PersonaProfile, Advice**: 성향 분석, 리포트
- **CategoryCode, QuestionTemplate, PushSchedule, UserAnswer**: 카테고리/질문/푸시/답변 관리

---

## ⚙️ 기술 스택 및 주요 의존성

- **Typescript, NestJS, Prisma, PostgreSQL**
- **테스트**: Jest, Supertest
- **API 문서**: Swagger (OpenAPI)
- **기타**: Redis, WebSocket, bcrypt, class-validator, eslint/prettier 등

---

## 🚀 개발/실행/배포

### 1. 의존성 설치
```sh
yarn install
```
### 2. 개발 서버 실행
```sh
yarn dev
```
### 3. 빌드
```sh
yarn build
```
### 4. Prisma 마이그레이션/시드
```sh
yarn prisma:migrate
yarn prisma:seed
```

### Docker로 실행

```sh
docker compose up -d
```
- DB, 앱 컨테이너, 환경변수, 볼륨 관리
- 환경변수 예시는 `.env.example` 참고

---

## 🛠️ 주요 명령어

| 목적                | 명령어                        |
|---------------------|-------------------------------|
| 개발 서버 실행      | `yarn dev`                    |
| Prisma 마이그레이션 | `yarn prisma:migrate`         |
| Prisma Client 생성  | `yarn prisma:generate`        |
| DB 시드             | `yarn prisma:seed`            |
| Prisma Studio (GUI) | `yarn prisma:studio`          |
| 테스트              | `yarn test`, `yarn test:watch`, `yarn test:cov` |

---

## 🛡️ Trouble Shooting

- **Prisma enum import 에러**: `schema.prisma`, `yarn prisma:generate`, `tsconfig` target 확인
- **DB 컬럼 불일치/seed 실패**: DB 볼륨 삭제 후 마이그레이션/시드 재실행
- **seed OOM**: 대량 데이터/무한 루프 없는지 확인
- **포트 충돌/접속 거부**: `docker-compose.yml`, `.env`의 포트/DB 설정 확인

---

## 🏗️ 기여/확장 가이드

- **새 도메인 추가**: `src/modules/` 하위에 service/controller/dto 생성, Prisma schema 확장
- **Prisma schema 변경**: 반드시 마이그레이션/시드 동기화
- **API 문서화**: Swagger 데코레이터 적극 활용, 예시/설명 추가
- **테스트 코드**: `test/` 하위에 단위/통합 테스트 작성 권장

---

## 📚 참고/운영 팁

- **환경변수**: `.env`, `.env.example` 참고 (DB, JWT, Redis 등)
- **DB 관리**: [PostgreSQL 실무 명령어 가이드](../README-POSTGRES.md) 참고
- **API 문서**: `/api-docs` (Swagger UI)
- **LLM 서버 연동**: FastAPI + OpenAI, API 서버에서 HTTP로 호출
- **코드 스타일**: eslint/prettier, 커밋 컨벤션 준수

---

## 🔗 관련 문서

- [CONTRIBUTING.md](../../CONTRIBUTING.md) - 기여 가이드
- [PostgreSQL 명령어 가이드](../README-POSTGRES.md)
- [FCM 푸시 연동 가이드](../README-MESSAGES.md)
- [기타 인프라/운영 문서](../../docs/)

---
