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
| 코드 품질 검사      | `yarn check-all`              |
| 타입 체크           | `yarn type-check`             |
| 커밋 (대화형)       | `yarn commit`                 |

---

## 🔧 Git Hooks (Husky)

프로젝트는 **Husky**를 사용하여 Git 작업 시 자동으로 코드 품질을 검사합니다.

### 설정된 Hooks

| Hook | 실행 시점 | 동작 |
|------|-----------|------|
| `pre-commit` | 커밋 전 | `lint-staged`로 스테이징된 파일들의 린트/포맷팅 |
| `prepare-commit-msg` | 커밋 메시지 작성 전 | Commitizen으로 대화형 커밋 메시지 생성 |
| `commit-msg` | 커밋 메시지 작성 후 | Commitlint로 커밋 메시지 형식 검증 |
| `pre-push` | 푸시 전 | 전체 테스트 실행 |

### 사용법

```bash
# 일반적인 개발 워크플로우
git add .
git commit -m "feat: add new feature"  # 자동으로 lint-staged 실행
git push  # 자동으로 테스트 실행

# 대화형 커밋 (권장)
yarn commit  # 또는 git commit (prepare-commit-msg hook이 실행됨)
```

### 커밋 메시지 형식

[Conventional Commits](https://www.conventionalcommits.org/) 형식을 따릅니다:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**타입**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`, `deps`

---

| 코드 포맷팅        | `yarn format`                 |
| 코드 포맷팅 체크   | `yarn format:check`           |
| 린팅               | `yarn lint`                   |
| 린팅 체크          | `yarn lint:check`             |
| 린팅 자동 수정     | `yarn lint:fix`               |

---

## 🔧 코드 품질 관리 (ESLint + Prettier)

### 설정 파일
- **ESLint**: `eslint.config.mjs` - TypeScript 및 NestJS 코드 품질 검사
- **Prettier**: `.prettierrc` - 코드 포맷팅 규칙
- **Prettier Ignore**: `.prettierignore` - 포맷팅 제외 파일
- **VS Code 설정**: `.vscode/settings.json` - 에디터 자동 포맷팅

### 주요 기능
- **자동 포맷팅**: 저장 시 자동으로 코드 포맷팅 적용
- **Git Hooks**: 커밋 전 자동 린팅 및 포맷팅 (Husky + lint-staged)
- **TypeScript 지원**: 타입 안전성 검사 및 최신 문법 지원
- **NestJS 최적화**: NestJS 프레임워크에 특화된 규칙 적용

### 사용법
```bash
# 코드 포맷팅
yarn format

# 린팅 검사
yarn lint

# 린팅 자동 수정
yarn lint:fix

# CI/CD용 엄격 검사 (경고도 에러로 처리)
yarn lint:check
yarn format:check
```

### VS Code 확장 프로그램
- **Prettier**: `esbenp.prettier-vscode`
- **ESLint**: `dbaeumer.vscode-eslint`
- **TypeScript**: `ms-vscode.vscode-typescript-next`
- **Prisma**: `prisma.prisma`

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
