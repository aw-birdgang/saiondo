# 📦 Saiondo Deployment Guide

> **이 문서는 Saiondo 프로젝트의 실제 배포/운영 환경 세팅, CI/CD, 인프라 관리 방법을 안내합니다.**
>  
> 각 환경(개발/운영)별 배포 전략, 자동화, 인프라 관리, 실전 운영 팁을 포함합니다.

---

## 1. 전체 배포 아키텍처

- **AWS 기반 IaC**: Terraform으로 VPC, RDS, EC2, ECS, ALB, S3, IAM 등 인프라를 코드로 관리
- **CI/CD**: GitHub Actions, AWS CodePipeline, CodeBuild, DockerHub/ECR 등 연동
- **서비스 구성**:  
  - <kbd>Backend</kbd>: NestJS API, FastAPI LLM 서버 (Docker 컨테이너)
  - <kbd>Frontend</kbd>: Flutter Web (Firebase Hosting 또는 S3+CloudFront)
  - <kbd>Web3</kbd>: 스마트 컨트랙트 배포/검증 (Hardhat)
  - <kbd>DB</kbd>: PostgreSQL (RDS)
  - <kbd>기타</kbd>: Redis, S3, Secrets Manager 등

---

## 2. 환경별 배포 전략

### 2.1. 개발 환경(dev)

- **인프라**: `infrastructure/terraform/dev/`에서 dev용 리소스 배포
- **도커**: 로컬/EC2에서 `docker-compose`로 서비스 실행
- **DB**: RDS(dev) 또는 로컬 PostgreSQL
- **Frontend**: Flutter Web을 S3+CloudFront 또는 Firebase Hosting에 배포

### 2.2. 운영 환경(prod)

- **인프라**: `infrastructure/terraform/prod/`에서 prod용 리소스 배포
- **서비스**: ECS(EC2/Fargate) 기반 컨테이너 오케스트레이션
- **DB**: RDS(prod), 멀티 AZ, 백업, 암호화 적용
- **Frontend**: S3+CloudFront, Firebase Hosting 등으로 정적 배포

---

## 3. 인프라 관리 (Terraform)

```bash
# 환경별 변수 파일 준비
cd infrastructure/terraform/dev
terraform init
terraform plan -var-file=dev.tfvars
terraform apply -var-file=dev.tfvars

# 운영 환경도 prod.tfvars로 동일하게 적용
cd ../prod
terraform init
terraform plan -var-file=prod.tfvars
terraform apply -var-file=prod.tfvars
```

- **상태 관리**: S3 backend, DynamoDB lock 권장 (운영 환경)
- **민감 정보**: secret.tfvars, AWS Secrets Manager 등으로 분리
- **모듈화**: 환경별로 dev/prod 디렉토리 및 변수/리소스 분리

---

## 4. CI/CD 파이프라인

### 4.1. GitHub Actions 예시

- **백엔드**
  - PR/merge 시 Docker 이미지 빌드 → ECR/DockerHub 푸시 → ECS 배포 트리거
- **프론트엔드**
  - main 브랜치 push 시 Flutter build → S3/Firebase Hosting 배포

```yaml
# .github/workflows/backend-deploy.yml (예시)
name: Backend Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      - name: Login to Amazon ECR
        uses: aws-actions/amazon-ecr-login@v1
      - name: Build and push Docker image
        run: |
          docker build -t $ECR_REPO:latest .
          docker push $ECR_REPO:latest
      - name: Deploy to ECS
        run: |
          aws ecs update-service --cluster $ECS_CLUSTER --service $ECS_SERVICE --force-new-deployment
```

### 4.2. AWS CodePipeline/CodeBuild

- **CodePipeline**: GitHub/ECR → CodeBuild → ECS/S3 배포 자동화
- **CodeBuild**: Docker build, 테스트, 마이그레이션, 배포 스크립트 실행

---

## 5. 배포/운영 실전 팁

- **Zero-downtime 배포**: ECS rolling update, ALB health check 활용
- **DB 마이그레이션**: 배포 전/후 자동화 스크립트로 실행 (ex: Prisma, Alembic 등)
- **환경변수/비밀 관리**: AWS Secrets Manager, SSM Parameter Store, .env 파일
- **모니터링/로깅**: CloudWatch, Sentry, Datadog 등 연동
- **백업/복구**: RDS 자동 백업, S3 버전 관리, 주기적 스냅샷
- **비용 관리**: 태그, AWS Budgets, 비용 알림 설정
- **프론트엔드 정적 배포**: S3 버킷 + CloudFront, Firebase Hosting 등 활용

---

## 6. 롤백/장애 대응

- **ECS 서비스 롤백**: 이전 태스크 정의로 롤백
- **DB 복구**: RDS 스냅샷에서 복원
- **프론트엔드**: S3 버전 관리, Firebase Hosting rollback
- **컨테이너 이미지**: 이전 태그로 재배포

---

## 7. 참고 명령어/스크립트

```bash
# ECS 서비스 강제 재배포
aws ecs update-service --cluster [CLUSTER] --service [SERVICE] --force-new-deployment

# S3 정적 배포
aws s3 sync build/web s3://[bucket-name] --delete

# Firebase Hosting 배포
firebase deploy --only hosting

# Terraform 배포/삭제
terraform apply -var-file=prod.tfvars
terraform destroy -var-file=prod.tfvars
```

---

## 8. 운영/보안 추가 팁

- **IAM 최소 권한 원칙**: 배포/CI/CD에 필요한 권한만 부여
- **리소스 태깅**: 비용/운영/보안 추적을 위해 태그 일관성 유지
- **알림/모니터링**: CloudWatch Alarm, Slack/SNS 연동 등으로 장애 즉시 감지
- **자동화**: 배포, 롤백, 마이그레이션, 테스트 등 최대한 자동화

---

## 9. 참고 자료

- [Terraform AWS Provider Docs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [AWS ECS 공식 문서](https://docs.aws.amazon.com/ecs/latest/developerguide/what-is-ecs.html)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [AWS CodePipeline Docs](https://docs.aws.amazon.com/codepipeline/latest/userguide/welcome.html)

---