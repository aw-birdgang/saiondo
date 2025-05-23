# Terraform PRD: 개발/테스트용 AWS 인프라 + CI/CD 구성

## 📌 목적

이 프로젝트는 **1인 개발자가 최소 비용으로 테스트 환경을 구성**하고,  
**GitHub → CodePipeline → CodeBuild → EC2** 구조로 자동 배포까지 포함하는 개발 인프라를 **Terraform**으로 관리하기 위해 작성되었습니다.

---

## ✅ 구성 요소 요약

| 항목 | 설명 |
|------|------|
| **VPC** | 퍼블릭 서브넷 1개 + IGW, NAT 없음 |
| **EC2** | 1대 (t3.micro), 퍼블릭 IP 할당, PostgreSQL + 앱 서버 실행 |
| **Docker Compose** | EC2에 PostgreSQL 및 앱 컨테이너 배포 |
| **S3** | CodePipeline 아티팩트 저장용 |
| **CodePipeline** | GitHub 푸시 시 자동 빌드 및 배포 트리거 |
| **CodeBuild** | EC2에 SSH 접속 후 Docker Compose 실행 |
| **IAM** | 최소 권한의 IAM Role (EC2, Build, Pipeline) |
| **보안그룹** | 포트 22, 80, 443만 허용 (SSH는 본인 IP만)

---

## 🗂️ 디렉토리 구조

```

terraform/
├── dev/
│   ├── main.tf
│   ├── vpc.tf
│   ├── ec2.tf
│   ├── securitygroup.tf
│   ├── s3.tf
│   ├── pipeline.tf
│   ├── variables.tf
│   ├── outputs.tf
│   ├── buildspec.yml
│   └── user\_data.sh
└── modules/
└── (선택사항: 모듈화 시 사용)

````

---

## 💻 주요 기능

### EC2 인스턴스
- `t3.micro` (프리티어 가능)
- 퍼블릭 서브넷에 배치
- Docker + Docker Compose 자동 설치 (user_data 사용)
- PostgreSQL 및 앱 컨테이너 실행

### Docker Compose (`docker-compose.yml`)
```yaml
version: "3"
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: devpass
      POSTGRES_DB: app_db
    ports:
      - "5432:5432"
    volumes:
      - ./db_data:/var/lib/postgresql/data
````

---

### CodePipeline + CodeBuild

#### `buildspec.yml` 예시

```yaml
version: 0.2
phases:
  build:
    commands:
      - echo "Deploying to EC2"
      - chmod 400 private-key.pem
      - scp -o StrictHostKeyChecking=no -i private-key.pem docker-compose.yml ec2-user@$EC2_HOST:/home/ec2-user/
      - ssh -o StrictHostKeyChecking=no -i private-key.pem ec2-user@$EC2_HOST 'docker-compose up -d'
```

> 🔐 SSH 키 및 호스트 정보는 SSM Parameter Store 또는 환경 변수로 관리 가능

---

## 🔐 보안

* EC2 SSH 접속 허용 IP는 변수로 제한 (`var.my_ip`)
* 포트 제한: `22`, `5432`, `80`, `443`만 허용
* EC2 Role 없음 (보안 단순화)

---
