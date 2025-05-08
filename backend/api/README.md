# Saiondo API Server

NestJS(Typescript)와 Prisma ORM 기반의 메인 백엔드 API 서버입니다.

## 📁 주요 구조

## 🧩 주요 도메인 및 구조

- **User**: 사용자 정보
- **Relationship**: 1:1 관계(초대→수락→room 생성)
- **Room**: 관계별 대화 공간(1:1)
- **ChatHistory**: roomId 기반 대화 기록
- **PersonaProfile, AdviceReport**: 프로필/리포트 등 확장 도메인

## 🚀 개발/실행

1. 의존성 설치  
   ```sh
   yarn install
   ```
2. 개발 서버 실행  
   ```sh
   yarn dev
   ```
3. 빌드  
   ```sh
   yarn build
   ```
4. Prisma 마이그레이션/시드  
   ```sh
   yarn prisma:migrate
   yarn prisma:seed
   ```

## 🗃️ 데이터베이스/Prisma

- `prisma/schema.prisma`에서 모델/enum 정의
- 마이그레이션/시드/Prisma Client 재생성 필수
- 컬럼/테이블 불일치 시 DB 볼륨 삭제 후 재마이그레이션

## 🧩 도메인

- User, Relationship, Room, ChatHistory, PersonaProfile, AdviceReport 등
- roomId 기반 1:1 대화/분석 구조

## 📝 개발 팁

- tsconfig의 target은 ES2015 이상
- Prisma enum import 에러 발생 시 schema, generate, 의존성/캐시 초기화
- seed.ts 빌드 시 tsc --project tsconfig.json 사용

## 🛠️ 개발/운영 명령어

- **API 서버 개발 모드**  
  ```sh
  cd backend/api
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

## 🐳 Docker 관련

- **DB 볼륨까지 완전 초기화(개발환경에서만!)**
  ```sh
  docker compose down --volumes
  docker compose up -d
  ```

## 📝 Prisma 마이그레이션/시드 주의사항

- **schema.prisma** 변경 시 반드시
  1. `yarn prisma:migrate`
  2. `yarn prisma:generate`
  3. `yarn prisma:seed`
- 컬럼/테이블 불일치, drift 발생 시 DB 볼륨을 완전히 삭제 후 재마이그레이션 필요

## 🧑‍💻 주요 개발 팁

- **tsconfig.json의 target은 반드시 ES2015 이상**  
- Prisma enum import 에러 발생 시,  
  - schema.prisma에 enum 정의 확인  
  - prisma:generate, 의존성/캐시 초기화
- seed.ts 빌드 시 `tsc --project tsconfig.json` 사용,  
  `"lib": ["es2023"]` 등 최신 JS 지원

## 📚 기타

- **src/database/** 하위 코드는 현재 직접적으로 사용되지 않음(향후 확장/리팩토링용)
- 각 도메인별 API, DTO, 서비스, 컨트롤러, Swagger 문서화 예시 포함
- LLM 서버는 FastAPI + OpenAI 연동, API 서버에서 HTTP로 호출

## 🏗️ 기여/확장

- 새로운 도메인 추가 시, `src/modules/` 하위에 service/controller/dto 등 생성
- Prisma schema 변경 후 반드시 마이그레이션/시드 동기화
- LLM 연동/확장, 실시간 기능, 인증/인가, 트랜잭션 등은 추가 설계 필요

## 🛡️ Trouble Shooting

- **Prisma enum import 에러**: schema.prisma enum 정의, prisma:generate, tsconfig target 확인
- **DB 컬럼 불일치/seed 실패**: DB 볼륨 삭제 후 마이그레이션/시드 재실행
- **seed OOM**: 대량 데이터/무한 루프 없는지 확인, 의존성/캐시 초기화


## 📞 문의
````
- 추가 문의/이슈는 팀 슬랙 또는 깃허브 이슈로 남겨주세요.

rm -rf node_modules
rm -rf api/node_modules
rm -rf api/node_modules/.prisma
rm -rf api/node_modules/@prisma
rm -rf api/prisma/migrations
yarn cache clean
yarn install
cd api
yarn prisma:generate

sudo chown -R $(whoami) ./node_modules
sudo chown -R $(whoami) ./prisma

ls -al api/node_modules/@prisma/client/.prisma/client
  
yarn prisma:generate     # 타입 & 클라이언트 생성
yarn prisma:migrate      # 마이그레이션 적용
yarn prisma:studio       # 웹 GUI (localhost:5555)
yarn prisma:reset        # 전체 리셋 (개발용)


yarn prisma migrate dev --name add-room-model
yarn prisma migrate deploy
yarn prisma generate
or
docker compose exec api yarn prisma:generate
docker compose exec api yarn prisma:migrate
docker compose exec api yarn prisma:seed
````



# docker container exec
````
docker compose exec api sh
````


# 테이블 생성 확인
````
-- 1. 유저 생성 (필요 시)
CREATE USER saiondo WITH PASSWORD 'password';

-- 2. DB 생성 및 소유자 지정
CREATE DATABASE saiondo OWNER saiondo;

-- 3. 권한 부여 (옵션)
GRANT ALL PRIVILEGES ON DATABASE saiondo TO saiondo;

-- 4. 접속 종료
\q

psql -U saiondo -d saiondo
saiondo=> \dt
````



# 데이타 추가
````
{
  "name": "김철수",
  "gender": "MALE"
}
{
  "name": "이영희",
  "gender": "FEMALE"
}
{
  "user1Id": "userId_김철수",
  "user2Id": "userId_이영희",
  "status": "ACTIVE",
  "startedAt": "2024-05-01T00:00:00.000Z"
}
{
  "userId": "userId_김철수",
  "message": "오늘 영화 볼래?",
  "sender": "USER",
  "isQuestionResponse": false,
  "isUserInitiated": true,
  "analyzedByLlm": false,
  "timestamp": "2024-05-10T12:00:00.000Z"
}
{
  "userId": "userId_이영희",
  "message": "좋아! 어떤 영화 볼까?",
  "sender": "USER",
  "isQuestionResponse": true,
  "isUserInitiated": false,
  "analyzedByLlm": false,
  "timestamp": "2024-05-10T12:01:00.000Z"
}
{
  "userId": "userId_김철수",
  "message": "로맨틱 코미디를 추천해드릴게요.",
  "sender": "AI",
  "isQuestionResponse": false,
  "isUserInitiated": false,
  "analyzedByLlm": true,
  "timestamp": "2024-05-10T12:02:00.000Z"
}
{
  "userId": "userId_김철수",
  "categoryCode": "MBTI",
  "content": "ISTJ, 신중하고 계획적인 성격",
  "isStatic": true,
  "source": "USER_INPUT",
  "confidenceScore": 0.9
}
{
  "userId": "userId_이영희",
  "categoryCode": "MBTI",
  "content": "ENFP, 감정 표현이 풍부하고 대화를 좋아함",
  "isStatic": false,
  "source": "AI_ANALYSIS",
  "confidenceScore": 0.95
}
{
  "relationshipId": "relationshipId_커플1",
  "generatedById": "userId_김철수",
  "reportDate": "2024-05-10T12:00:00.000Z",
  "summary": "두 사람은 서로의 차이를 이해하며 잘 지내고 있습니다.",
  "adviceForUser1": "상대방의 감정 표현을 존중해 주세요.",
  "adviceForUser2": "상대방이 말이 적어도 기다려 주세요."
}

```




#
```
npx prisma db pull --schema=prisma/schema.prisma
```



###
```
api/
├── src/
│ ├── modules/ # 도메인별 서비스(relationship, chat-history, user 등)
│ └── database/ # (확장/리팩토링용) 도메인/엔티티/퍼시스턴스 코드
├── prisma/ # Prisma schema, 마이그레이션, seed
├── Dockerfile
├── package.json
└── tsconfig.json

```
