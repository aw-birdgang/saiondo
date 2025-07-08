# 🌱 Saiondo

> ⚠️ **이 프로젝트는 개인 프로젝트이며, 현재 진행중입니다.**
>
> 기능, 구조, 문서 등은 개발 상황에 따라 언제든 변경될 수 있습니다.

---

**Saiondo**는 연인/커플의 대화와 성향을 분석하여 맞춤형 조언을 제공하는  
**AI 기반 커플 케어 서비스**입니다.

---

## 📑 목차

- [🚀 빠른 시작](#-빠른-시작)
- [🖼️ 시스템 아키텍처](#️-시스템-아키텍처-전체-구조)
- [📁 프로젝트 구조](#️-프로젝트-디렉토리-구조)
- [🛠️ 기술 스택](#️-기술-스택)
- [✨ 주요 기능](#-주요-기능)
- [🗃️ 데이터베이스](#️-데이터베이스-erd)
- [⚙️ 개발 환경 설정](#-개발-환경-설정)
- [🧪 테스트](#-테스트)
- [🚀 배포](#-배포)
- [🔒 보안](#-보안)
- [📱 앱 스크린샷](#-메인-화면-스크린샷)
- [📚 문서](#-문서)
- [🤝 기여하기](#-기여하기)
- [📄 라이선스](#-라이선스)

---

## 🚀 빠른 시작

### 필수 요구사항

- **Node.js** >= 16.0.0
- **Flutter** >= 3.0.0
- **Docker** >= 20.0.0
- **Terraform** >= 1.0.0
- **PostgreSQL** >= 14.0
- **Redis** >= 6.0

### 로컬 개발 환경 실행

#### 방법 1: Docker Compose (권장)

```bash
# 1. 저장소 클론
git clone https://github.com/aw-birdgang/saiondo.git
cd saiondo

# 2. 환경 변수 설정
cd backend
cp .env.example .env  # 환경 변수 파일 복사 및 설정

# 3. 전체 서비스 실행 (API, LLM, PostgreSQL, Redis)
docker-compose up -d

# 4. 데이터베이스 마이그레이션 (필요시)
docker-compose exec api yarn prisma migrate dev
docker-compose exec api yarn prisma generate

# 5. 프론트엔드 실행
cd ../frontend/app
flutter pub get
flutter run  # Flutter 앱 실행
```

#### 방법 2: 개별 실행 (개발용)

```bash
# 1. 저장소 클론
git clone https://github.com/aw-birdgang/saiondo.git
cd saiondo

# 2. 데이터베이스 및 Redis 실행
cd backend
docker-compose up -d postgres redis

# 3. API 서버 실행 (개발 모드)
cd api
npm install
npm run dev  # API 서버 실행 (포트: 3000)

# 4. LLM 서버 실행 (개발 모드)
cd ../llm
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000  # LLM 서버 실행

# 5. 프론트엔드 실행
cd ../../frontend/app
flutter pub get
flutter run  # Flutter 앱 실행
```

---

## 🖼️ 시스템 아키텍처 전체 구조

<p align="center">
  <img src="assets/images/architecture_full_component_saiondo.png" alt="SAIONDO 전체 아키텍처" width="1200"/>
</p>

> **설명:** SAIONDO의 전체 시스템 아키텍처.  
> 백엔드, 프론트엔드, 인프라, Web3, LLM 등 모든 주요 컴포넌트와 상호작용 구조를 한눈에 볼 수 있습니다.

---

## 📁 프로젝트 디렉토리 구조

```plaintext
saiondo/
├── assets/                    # 이미지, 아이콘 등 정적 리소스
├── backend/                   # 백엔드 서비스
│   ├── api/                  # NestJS API 서버
│   │   ├── src/
│   │   ├── prisma/           # 데이터베이스 스키마
│   │   ├── test/             # 테스트 파일
│   │   └── package.json
│   ├── llm/                  # FastAPI LLM 서버
│   │   ├── src/
│   │   ├── tests/
│   │   └── requirements.txt
│   ├── docker-compose.yml    # 로컬 개발 환경
│   ├── buildspec.yml         # AWS CodeBuild 설정
│   └── deploy.sh             # 배포 스크립트
├── frontend/                 # 프론트엔드 앱
│   └── app/                 # Flutter 앱
│       ├── lib/
│       ├── test/
│       ├── android/
│       ├── ios/
│       └── pubspec.yaml
├── infrastructure/           # 인프라 관리
│   ├── terraform/           # Terraform 설정
│   │   ├── modules/
│   │   └── environments/
│   └── puml/                # 아키텍처 다이어그램
├── web3/                    # 블록체인 관련
│   ├── contracts/           # 스마트 컨트랙트
│   ├── scripts/             # 배포 스크립트
│   └── hardhat.config.js
├── docs/                    # 프로젝트 문서
├── puml/                    # PlantUML 다이어그램
├── LICENSE                  # MIT 라이선스
├── CHANGELOG.md             # 변경 이력
├── CONTRIBUTING.md          # 기여 가이드
└── README.md                # 프로젝트 개요
```

---

## 🛠️ 기술 스택

### Backend
- **API Server**: NestJS 10.4.1, TypeScript 5.7.3
- **Database**: PostgreSQL 14+, Prisma ORM 6.7.0
- **Cache**: Redis 6.0+, ioredis 5.4.1
- **Authentication**: JWT, bcrypt 5.1.1
- **Documentation**: Swagger/OpenAPI 7.4.0

### LLM Server
- **Framework**: FastAPI, Python 3.9+
- **AI/ML**: LangChain, OpenAI/Claude API
- **Testing**: pytest

### Frontend
- **Framework**: Flutter 3.0+, Dart 3.0+
- **State Management**: MobX 2.3.3, Riverpod
- **Networking**: Dio 5.7.0, Socket.IO
- **Local Storage**: SharedPreferences, Sembast
- **UI**: Material Design 3, Custom Widgets

### Infrastructure
- **Cloud**: AWS (ECS, RDS, S3, CloudFront)
- **IaC**: Terraform 1.0+
- **CI/CD**: AWS CodePipeline, CodeBuild
- **Container**: Docker, ECR

### Web3
- **Blockchain**: Ethereum, Polygon
- **Framework**: Hardhat 2.24.1, Ethers.js 5.7.1
- **Contracts**: Solidity, OpenZeppelin 4.7.3

---

## ✨ 주요 기능

- <kbd>AI 기반 커플 대화 분석 및 맞춤형 조언</kbd>
- <kbd>1:1 대화방, 성향 분석, 리포트 제공</kbd>
- <kbd>OpenAI/Claude 등 LLM 연동</kbd>
- <kbd>Flutter 기반 모바일/웹 앱</kbd>
- <kbd>REST API, 인증, 결제 등 지원</kbd>
- <kbd>실시간 채팅 및 푸시 알림</kbd>
- <kbd>블록체인 기반 커플 토큰/NFT</kbd>
- <kbd>포인트 시스템 및 결제 연동</kbd>

---

## 🗃️ 데이터베이스 ERD

<p align="center">
  <img src="assets/images/api/erd.png" alt="SAIONDO ERD" width="800"/>
</p>

> **설명:** 주요 데이터베이스 테이블(User, Channel, Chat, PersonaProfile, Advice 등) 간의 관계를 시각화한 ERD입니다.

<details>
<summary><b>ERD PlantUML 예시 보기</b></summary>

```puml
@startuml
entity "User" as User {
  *id : String
  name : String
  email : String
  ...
}
entity "Channel" as Channel {
  *id : String
  ...
}
entity "Chat" as Chat {
  *id : String
  ...
}
User ||--o{ Chat : ""
Channel ||--o{ Chat : ""
...
@enduml
```
</details>

---

## ⚙️ 개발 환경 설정

### 환경 변수 설정

#### Backend API (.env)
```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/saiondo"

# Authentication
AUTH_JWT_SECRET="your-jwt-secret"
AUTH_JWT_TOKEN_EXPIRES_IN="1d"
AUTH_REFRESH_SECRET="your-refresh-secret"
AUTH_REFRESH_TOKEN_EXPIRES_IN="7d"

# Redis
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_PASSWORD=""

# External APIs
LLM_API_URL="http://localhost:8000"
OPENAI_API_KEY="your-openai-key"
CLAUDE_API_KEY="your-claude-key"

# Web3
WALLET_SECRET_KEY="your-wallet-private-key"
INFURA_KEY="your-infura-key"
```

#### Frontend (.env)
```bash
# API Configuration
API_BASE_URL="http://localhost:3000"
LLM_API_URL="http://localhost:8000"

# Firebase
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
```

#### LLM 서버 (.env)
```bash
OPENAI_API_KEY="your-openai-key"
CLAUDE_API_KEY="your-claude-key"
DEFAULT_MODEL="openai"
LANGCHAIN_API_KEY="your-langsmith-key"
LANGCHAIN_PROJECT="saiondo-llm"
```

### 데이터베이스 설정

```bash
# PostgreSQL 실행
docker run --name saiondo-postgres \
  -e POSTGRES_DB=saiondo \
  -e POSTGRES_USER=saiondo \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:14

# Prisma 마이그레이션
cd backend/api
npx prisma migrate dev
npx prisma generate
```

---

## 🧪 테스트

### Backend 테스트

```bash
# API 서버 테스트
cd backend/api
npm run test              # 단위 테스트
npm run test:e2e          # E2E 테스트
npm run test:cov          # 커버리지 포함 테스트

# LLM 서버 테스트
cd backend/llm
pytest                    # Python 테스트
pytest --cov=src          # 커버리지 포함
```

### Frontend 테스트

```bash
# Flutter 테스트
cd frontend/app
flutter test              # 단위 테스트
flutter test --coverage   # 커버리지 포함
flutter drive             # 통합 테스트
```

### Web3 테스트

```bash
# 스마트 컨트랙트 테스트
cd web3
npm test                  # Hardhat 테스트
npx hardhat coverage      # 커버리지 포함
```

---

## 🚀 배포

### 개발 환경 배포

```bash
# 1. 인프라 배포
cd infrastructure/terraform/environments/dev
terraform init
terraform plan
terraform apply

# 2. 백엔드 배포
cd backend
./deploy.sh dev

# 3. 프론트엔드 배포
cd frontend/app
flutter build web
# S3에 업로드
```

### 운영 환경 배포

```bash
# 1. 인프라 배포
cd infrastructure/terraform/environments/prod
terraform init
terraform plan
terraform apply

# 2. CI/CD 파이프라인을 통한 자동 배포
# GitHub에 push하면 자동으로 배포됩니다
```

---

## 🔒 보안

### 인증 및 권한 관리

- **JWT 기반 인증**: Access Token + Refresh Token
- **비밀번호 암호화**: bcrypt (salt rounds: 10)
- **API 보안**: Helmet.js, CORS 설정
- **환경 변수**: AWS Secrets Manager, SSM Parameter Store

### 데이터 보호

- **데이터베이스 암호화**: RDS 암호화 활성화
- **전송 암호화**: HTTPS/TLS 강제
- **개인정보**: GDPR 준수, 데이터 최소화 원칙

### 네트워크 보안

- **VPC 구성**: Public/Private 서브넷 분리
- **보안 그룹**: 최소 권한 원칙 적용
- **WAF**: AWS WAF로 DDoS 방어
- **모니터링**: CloudWatch, CloudTrail

### 보안 체크리스트

- [ ] 환경 변수에 민감 정보 노출 금지
- [ ] 정기적인 의존성 업데이트
- [ ] 보안 스캔 및 취약점 점검
- [ ] 로그 모니터링 및 알림 설정
- [ ] 백업 및 재해 복구 계획

자세한 보안 정책은 [보안 가이드](./docs/security.md)를 참고하세요.

---

## 📱 앱 스크린샷

<p align="center">
  <img src="assets/images/app/4-6-1.webp" alt="SAIONDO 메인 화면1" width="180" height="360"/>
  <img src="assets/images/app/4-6-2.webp" alt="SAIONDO 메인 화면2" width="180" height="360"/>
  <img src="assets/images/app/4-6-3.webp" alt="SAIONDO 메인 화면3" width="180" height="360"/>
  <img src="assets/images/app/4-6-4.webp" alt="SAIONDO 메인 화면4" width="180" height="360"/>
  <img src="assets/images/app/4-6-5.webp" alt="SAIONDO 메인 화면5" width="180" height="360"/>
  <img src="assets/images/app/4-6-6.webp" alt="SAIONDO 메인 화면6" width="180" height="360"/>
  <img src="assets/images/app/4-6-7.webp" alt="SAIONDO 메인 화면7" width="180" height="360"/>
</p>

<p align="center">
  <b>SAIONDO 앱의 주요 화면 스크린샷</b><br>
  커플 대화방, 성향 분석, 리포트 등 다양한 기능을 한눈에 볼 수 있습니다.
</p>

---

## 📚 문서

### 📖 상세 문서

- <kbd><a href="./docs/readme_web3.md">Web3 설계/운영 참고</a></kbd>
  &nbsp;
  <kbd><a href="./docs/readme_business.md">비즈니스/기획 참고</a></kbd>
  &nbsp;
  <kbd><a href="./docs/readme_dev.md">개발 환경/팁</a></kbd>

### 🔧 모듈별 문서

- <kbd><a href="./backend/api/README.md">API 서버 문서</a></kbd>
- <kbd><a href="./backend/llm/README.md">LLM 서버 문서</a></kbd>
- <kbd><a href="./frontend/app/README.md">Flutter 앱 문서</a></kbd>
- <kbd><a href="./infrastructure/README.md">인프라 문서</a></kbd>
- <kbd><a href="./web3/README.md">Web3 문서</a></kbd>

### 📋 추가 문서

- <kbd><a href="./docs/security.md">보안 가이드</a></kbd>
- <kbd><a href="./docs/api-reference.md">API 레퍼런스</a></kbd>
- <kbd><a href="./docs/deployment-guide.md">배포 가이드</a></kbd>
- <kbd><a href="./backend/llm/docs/langsmith-guide.md">LangSmith 활용 가이드</a></kbd>

---

## 🤝 기여하기

SAIONDO 프로젝트에 기여하고 싶으시다면 [기여 가이드](./CONTRIBUTING.md)를 참고해주세요.

### 기여 방법

1. **이슈 등록**: 버그 리포트, 기능 제안
2. **Fork & Branch**: 기능별 브랜치 생성
3. **개발**: 코딩 및 테스트 작성
4. **Pull Request**: 코드 리뷰 요청

### 개발 가이드라인

- **코드 스타일**: 각 언어별 컨벤션 준수
- **테스트**: 새로운 기능에 대한 테스트 작성
- **문서화**: API 문서, README 업데이트
- **커밋 메시지**: Conventional Commits 형식 사용

---

## 📄 라이선스

이 프로젝트는 [MIT 라이선스](./LICENSE) 하에 배포됩니다.

---

<p align="center">
  <img src="assets/images/architecture_full_component_saiondo.png" alt="SAIONDO 전체 아키텍처" width="600"/>
  <br>
  <b>SAIONDO - 커플을 위한 AI 기반 케어 플랫폼</b>
</p>

---

**이 파일을 프로젝트 루트(최상위)에 `README.md`로 저장하면,  
구조, 실행법, 문서, 보안, 기여 등 모든 정보를 한눈에 볼 수 있습니다!**
