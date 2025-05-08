##
````
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

````




#
````
npx prisma db pull --schema=prisma/schema.prisma
````



###
````
api/
├── prisma/
│   ├── schema.prisma         # ✅ Prisma 스키마
│   └── seed.ts               # ✅ DB 시드
│
├── src/
│   ├── common/
│   │   └── prisma/
│   │       ├── prisma.module.ts
│   │       └── prisma.service.ts
│   │
│   ├── modules/
│   │   ├── user/
│   │   │   ├── application/
│   │   │   │   └── user.service.ts
│   │   │   ├── domain/
│   │   │   │   ├── user.entity.ts
│   │   │   │   └── user.repository.ts
│   │   │   ├── infrastructure/
│   │   │   │   └── persistence/
│   │   │   │       ├── user.prisma.repository.ts
│   │   │   │       └── user.mapper.ts
│   │   │   └── presentation/
│   │   │       └── user.controller.ts
│   │   └── chat/
│   │       └── ...
│
│   ├── app.module.ts
│   └── main.ts
│
├── package.json
├── tsconfig.json
└── .env

````




##
````
curl -X POST http://localhost:3000/llm/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "요즘 날씨 어때?", "model": "claude"}'

curl -X POST http://localhost:3000/llm/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "GPT야 안녕?", "model": "openai"}'
````


##
````

{
  "user_prompt": "나는 감정 표현이 서툴고 대화를 많이 하는 걸 좋아하지 않아.",
  "partner_prompt": "나는 대화를 통해 감정을 확인하는 걸 중요하게 생각해.",
  "user_gender": "male",
  "partner_gender": "female",
  "model": "openai",
  "metadata": {
    "sessionId": "b7e23ec2-8d5a-4c2a-9e3b-1e2f3a4b5c6d",
    "user_mbti": "ISTJ",
    "partner_mbti": "ENFP",
    "user_age": 44,
    "relationship_duration_months": 6
  }
}

````


#
````
docker compose down -v
docker compose build --no-cache
docker compose up
docker compose -f docker-compose.yml up --build

docker compose logs llm
````


