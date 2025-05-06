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
docker compose up --build
docker compose -f docker-compose.yml up --build
````

#
````
backend/
├── api/                  # NestJS(Typescript) 백엔드 API 서버
│   ├── src/              # NestJS 소스코드 (컨트롤러, 서비스, 모듈 등)
│   ├── prisma/           # Prisma 스키마, 마이그레이션, 시드 등
│   ├── Dockerfile        # api 서비스용 Dockerfile
│   ├── package.json      # Node.js 의존성 및 스크립트
│   ├── tsconfig.json     # TypeScript 컴파일 설정
│   └── ...               # 기타 설정/테스트 파일
│
├── llm/                  # FastAPI(Python) 기반 LLM 프록시 서버
│   ├── src/              # FastAPI 소스코드 (main.py, 라우터 등)
│   ├── requirements.txt  # Python 의존성 목록
│   ├── Dockerfile        # llm 서비스용 Dockerfile
│   └── ...               # 기타 설정/가상환경 등
│
├── docker-compose.yml    # 전체 서비스(backend, llm, db) 오케스트레이션
├── .env                  # 공통 환경변수 파일 (포트, DB, LLM 등)
└── ...                   # (필요시) README, 기타 문서
````
