# Saiondo

**Saiondo**는 연인/커플의 대화와 성향을 분석하여 맞춤형 조언을 제공하는 AI 기반 커플 케어 서비스입니다.

---

## 🖼️ 프로젝트 전체 구조

<p align="center">
  <img src="docs/images/architecture_component_saiondo.png" alt="SAIONDO 전체 아키텍처" width="700" style="margin: 12px;"/>
</p>

> **설명:**  
> SAIONDO의 전체 시스템 아키텍처.  
> 백엔드, 프론트엔드, 인프라, Web3, LLM 등 모든 주요 컴포넌트와 상호작용 구조를 한눈에 볼 수 있습니다.

---

## 🏗️ 프로젝트 디렉토리 구조

```
saiondo/
├── backend/
│   ├── api/
│   ├── llm/
│   ├── buildspec.yml
│   ├── deploy.sh
│   ├── docker-compose.yml
├── frontend/
│   └── app/
├── infrastructure/
│   └── terraform/
├── web3/
├── docs/
└── README.md
```

---

## 🚀 주요 기능

- **AI 기반 커플 대화 분석 및 맞춤형 조언**
- **1:1 대화방, 성향 분석, 리포트 제공**
- **OpenAI/Claude 등 LLM 연동**
- **Flutter 기반 모바일/웹 앱**
- **REST API, 인증, 결제 등 지원**

---

## 🗃️ 데이터베이스 ERD

<p align="center">
  <img src="docs/images/api/erd.png" alt="SAIONDO ERD" width="800" style="margin: 8px;"/>
</p>

> **설명:**  
> 주요 데이터베이스 테이블(User, Channel, Chat, PersonaProfile, Advice 등) 간의 관계를 시각화한 ERD입니다.  
> 각 엔티티는 커플 관리, 대화 기록, 성향 분석, 리포트 제공 등 핵심 기능을 담당합니다.

<details>
<summary>ERD PlantUML 예시 보기</summary>

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

## 🖼️ 시스템 아키텍처 및 주요 컴포넌트

### API 서버 아키텍처

<p align="center">
  <img src="docs/images/api/architecture.png" alt="API 아키텍처" width="600" style="margin: 8px;"/>
</p>
> NestJS 기반 REST API의 도메인 분리 및 LLM 연동 구조

---

### 도메인 & 인프라 구조

<p align="center">
  <img src="docs/images/api/domain_infra.png" alt="도메인/인프라 구조" width="600" style="margin: 8px;"/>
</p>
> API 서버의 주요 도메인(사용자, 관계, 채팅 등)과 인프라(데이터베이스, 외부 연동 등) 구성

---

### LLM 서버 아키텍처

<p align="center">
  <img src="docs/images/llm/architecture.png" alt="LLM 서버 아키텍처" width="600" style="margin: 8px;"/>
</p>
> FastAPI 기반 LLM 서버와 다양한 LLM Provider(OpenAI, Claude 등) 연동 구조

---

### Web3 구조

<p align="center">
  <img src="docs/images/web3/architecture.png" alt="Web3 아키텍처" width="600" style="margin: 8px;"/>
</p>
> 스마트컨트랙트, 배포, 검증 등 Web3 관련 주요 컴포넌트와 상호작용 구조

---

### 인프라 전체 아키텍처

**개발 환경**
<p align="center">
  <img src="docs/images/infra/dev-architecture-full.png" alt="개발 인프라 아키텍처" width="600" style="margin: 8px;"/>
</p>

**운영 환경**
<p align="center">
  <img src="docs/images/infra/prod-architecture-full.png" alt="운영 인프라 아키텍처" width="600" style="margin: 8px;"/>
</p>
> Terraform으로 관리되는 AWS 인프라의 전체 구조(개발/운영 환경)

---

### 앱 주요 컴포넌트

<p align="center">
  <img src="docs/images/app/architecture_component.png" alt="앱 컴포넌트" width="600" style="margin: 8px;"/>
</p>
> Flutter 기반 앱의 주요 컴포넌트 구조와 데이터 흐름

---

## 📱 메인 화면 스크린샷

<p align="center">
  <img src="docs/images/app/4-6-1.webp" alt="SAIONDO 메인 화면1" width="180" height="360" style="margin: 4px;"/>
  <img src="docs/images/app/4-6-2.webp" alt="SAIONDO 메인 화면2" width="180" height="360" style="margin: 4px;"/>
  <img src="docs/images/app/4-6-3.webp" alt="SAIONDO 메인 화면3" width="180" height="360" style="margin: 4px;"/>
  <img src="docs/images/app/4-6-4.webp" alt="SAIONDO 메인 화면4" width="180" height="360" style="margin: 4px;"/>
  <img src="docs/images/app/4-6-5.webp" alt="SAIONDO 메인 화면5" width="180" height="360" style="margin: 4px;"/>
  <img src="docs/images/app/4-6-6.webp" alt="SAIONDO 메인 화면6" width="180" height="360" style="margin: 4px;"/>
  <img src="docs/images/app/4-6-7.webp" alt="SAIONDO 메인 화면7" width="180" height="360" style="margin: 4px;"/>
</p>

<p align="center">
  <b>SAIONDO 앱의 주요 화면 스크린샷</b><br>
  커플 대화방, 성향 분석, 리포트 등 다양한 기능을 한눈에 볼 수 있습니다.
</p>

---

## 🛠️ 개발/실행

### 백엔드
```sh
cd backend/api && yarn install
cd backend/llm && pip install -r requirements.txt
cd backend && docker compose up -d
```

### 프론트엔드
```sh
cd frontend/app
fvm flutter pub get
fvm flutter run -d chrome   # 웹 실행
fvm flutter run             # 모바일 실행
```

---

## 📚 참고

- 각 디렉토리별 README 및 코드 주석 참고
- 인프라/운영/배포 관련 상세 가이드는 `infrastructure/terraform/README.md` 참고
- 문의/이슈: Github Issues 또는 팀 Slack 채널 활용

---
