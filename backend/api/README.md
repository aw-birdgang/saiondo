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
  "user_prompt": "나는 감정을 잘 표현하지 않아.",
  "partner_prompt": "나는 대화를 통해 감정을 공유하길 원해.",
  "user_gender": "male",
  "partner_gender": "female",
  "model": "openai"
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
