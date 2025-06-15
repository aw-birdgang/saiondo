# Saiondo API Server

NestJS(Typescript)와 Prisma ORM 기반의 메인 백엔드 API 서버입니다.


## 📁 프로젝트 폴더 구조**

api/
├── src/
│ ├── modules/ # 도메인별 controller, service, dto, prisma repository
│ ├── common/ # 공통 유틸리티, enum, 타입 등
│ ├── config/ # 환경설정
│ └── database/ # (확장/리팩토링용)
├── prisma/ # Prisma schema, 마이그레이션, seed
├── test/ # 테스트 코드
├── Dockerfile
├── docker-compose.yml
├── package.json
└── tsconfig.json



## 🏗️ 아키텍처 및 개발 패턴

- **NestJS 모듈러 구조**: 도메인별 service/controller/dto 분리
- **Prisma ORM + PostgreSQL**: schema.prisma에서 모델/enum 관리
- **Swagger**: API 문서 자동화
- **Jest**: 단위/통합 테스트
- **CQRS, EventEmitter, WebSocket 등 NestJS 확장 활용**

## 🧩 주요 도메인

- **User**: 사용자 정보, 인증/인가
- **Relationship**: 1:1 관계(초대→수락→room 생성)
- **Room**: 1:1 대화 공간
- **Chat**: 대화 기록
- **PersonaProfile, Advice**: 프로필/리포트
- **CategoryCode, QuestionTemplate, PushSchedule, UserAnswer**: 카테고리/질문/푸시/답변 관리

## ⚙️ 기술 스택 및 주요 의존성

- **Typescript, NestJS, Prisma, PostgreSQL**
- **테스트**: Jest
- **기타**: Swagger, Redis, WebSocket, bcrypt, class-validator, eslint/prettier 등

## 🚀 개발/실행/배포

1. **의존성 설치**
   ```sh
   yarn install
   ```
2. **개발 서버 실행**
   ```sh
   yarn dev
   ```
3. **빌드**
   ```sh
   yarn build
   ```
4. **Prisma 마이그레이션/시드**
   ```sh
   yarn prisma:migrate
   yarn prisma:seed
   ```

### Docker로 실행

```sh
docker compose up -d
```
- DB, 앱 컨테이너, 환경변수, 볼륨 관리


## 🛠️ 개발/운영 명령어

- **API 서버 개발 모드**
  ```sh
  yarn dev
  ```
- **Prisma 마이그레이션**
  ```sh
  yarn prisma:migrate
  ```
- **Prisma Client 재생성**
  ```sh
  yarn prisma:generate
  ```
- **DB 시드**
  ```sh
  yarn prisma:seed
  ```
- **Prisma Studio (DB GUI)**
  ```sh
  yarn prisma:studio
  ```
  
## 🧪 테스트

- **Jest 기반**
  ```sh
  yarn test
  yarn test:watch
  yarn test:cov
  ```

## 🛠️ 주요 명령어

- **개발 서버**: `yarn dev`
- **Prisma 마이그레이션**: `yarn prisma:migrate`
- **Prisma Client 재생성**: `yarn prisma:generate`
- **DB 시드**: `yarn prisma:seed`
- **Prisma Studio (DB GUI)**: `yarn prisma:studio`

## 🛡️ Trouble Shooting

- Prisma enum import 에러: schema.prisma, prisma:generate, tsconfig target 확인
- DB 컬럼 불일치/seed 실패: DB 볼륨 삭제 후 마이그레이션/시드
- seed OOM: 대량 데이터/무한 루프 없는지 확인

## 🏗️ 기여/확장

- 새로운 도메인 추가: `src/modules/` 하위에 service/controller/dto 생성
- Prisma schema 변경 후 반드시 마이그레이션/시드 동기화

## 📚 기타

- LLM 서버는 FastAPI + OpenAI 연동, API 서버에서 HTTP로 호출
- `src/database/`는 확장/리팩토링용
- 각 도메인별 API, DTO, 서비스, 컨트롤러, Swagger 문서화 예시 포함
