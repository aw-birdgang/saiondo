# Saiondo Backend Monorepo

이 저장소는 NestJS(Typescript, Prisma) 기반의 API 서버(`api/`)와  
FastAPI(Python) 기반의 LLM 서버(`llm/`)를 통합 관리하는 백엔드 모노레포입니다.  
PostgreSQL 데이터베이스와 함께 Docker Compose로 전체 서비스를 오케스트레이션합니다.

## 📦 프로젝트 구조

## 🚀 빠른 시작

1. `.env` 파일 작성 (DB, API, LLM 등 환경변수)
2. 의존성 설치:  
   ```sh
   cd api && yarn install
   ```
3. 전체 서비스 실행:  
   ```sh
   cd .. # backend 루트
   docker compose up -d
   ```
4. DB 마이그레이션/시드:  
   ```sh
   docker compose exec api yarn prisma:migrate
   docker compose exec api yarn prisma:seed
   ```

## 🛠️ 주요 서비스

- **api/**: NestJS + Prisma 기반 REST API
- **llm/**: FastAPI 기반 LLM 연동 서버
- **Postgres**: 관계형 데이터베이스

## 📝 개발/운영 팁

- 각 서비스별 README 참고
- Prisma 마이그레이션/시드, DB 볼륨 초기화 등은 개발환경에서만 안전하게 실행
- 트러블슈팅, 도메인 구조, 확장 방법 등은 하위 README 및 코드 주석 참고

---


#
````
docker rm -f $(docker ps -aq)
docker rmi -f $(docker images -aq)
docker volume rm $(docker volume ls -q)
docker network rm $(docker network ls -q)
docker compose down -v

docker compose build --no-cache
docker compose up
docker compose up --build
docker compose -f docker-compose.yml up --build
````

#
````
backend/
├── api/ # NestJS + Prisma 기반 메인 API 서버
├── llm/ # FastAPI 기반 LLM 서버
├── docker-compose.yml # 전체 서비스 오케스트레이션
└── .env # 공통 환경변수
````
