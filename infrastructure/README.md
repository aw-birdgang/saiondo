# Saiondo Infrastructure - Terraform IaC

**Saiondo 프로젝트의 AWS 인프라를 코드로 관리하는 Terraform 기반 인프라스트럭처**  
VPC, RDS, EC2, 보안그룹, CI/CD 파이프라인 등 주요 리소스를 모듈화하여  
dev/production 등 환경별로 손쉽게 배포/운영할 수 있도록 설계되었습니다.

---

## 📁 디렉토리 구조
```
infrastructure/
└── terraform/
├── dev/ # 개발 환경 인프라 정의
│ ├── main.tf
│ ├── vpc.tf
│ ├── rds.tf
│ ├── securitygroup.tf
│ ├── variables.tf
│ ├── output.tf
│ ├── pipeline_app_api.tf
│ ├── instances.tf
│ └── codestar_connection.tf
└── modules/ # 재사용 가능한 모듈
├── vpc/
├── security-group/
├── rds/
├── instances/
├── codestar_connection/
├── pipeline/
├── load-balancers/
├── ecs-cluster/
├── ecs-service/
└── alb/
```

```bash
# AWS SSO 로그인
aws configure sso
aws sso login --profile your-profile-name

# 키페어 생성
ssh-keygen -t rsa -b 2048 -f mykey

# Terraform 기본 명령어
terraform init
terraform plan -var-file=environments/dev/terraform.tfvars
terraform apply -var-file=environments/dev/terraform.tfvars
terraform destroy -var-file=environments/dev/terraform.tfvars
terraform destroy

# 예시: 인프라 배포
terraform apply -var-file="secret.tfvars" -var-file="production.tfvars"


terraform plan -var-file=../../global/terraform.tfvars
terraform apply -var-file=../../global/terraform.tfvars
terraform destroy -var-file=../../global/terraform.tfvars
```

---

## 🏗️ 주요 계층 및 역할

### 1. `dev/` (환경별 인프라 정의)
- **main.tf**: AWS Provider, 공통 리소스 설정
- **variables.tf**: 환경 변수 정의
- **output.tf**: 주요 리소스의 ID, subnet 등 외부 노출
- **vpc.tf**: VPC 모듈 인스턴스화
- **securitygroup.tf**: 보안그룹 모듈 인스턴스화
- **rds.tf**: RDS 모듈 인스턴스화
- **instances.tf**: EC2 인스턴스 모듈 인스턴스화
- **pipeline_app_api.tf**: (예시/주석) 파이프라인 모듈
- **codestar_connection.tf**: (예시/주석) CodeStar Connection 모듈

### 2. `modules/` (재사용 가능한 모듈)
- **vpc/**: 네트워크 인프라(VPC, 서브넷 등)
- **security-group/**: 보안그룹
- **rds/**: RDS 인프라
- **instances/**: EC2 인스턴스
- **codestar_connection/**: CodeStar Connection
- **pipeline/**: CodePipeline, CodeBuild, CodeDeploy, ECR, ECS 등 CI/CD 전체 파이프라인
- **load-balancers/**, **alb/**: 로드밸런서
- **ecs-cluster/**, **ecs-service/**: ECS 클러스터 및 서비스

---

## 🖼️ 전체 아키텍처

- **VPC**: 퍼블릭/프라이빗 서브넷 분리, 네트워크 계층화
- **보안그룹**: 리소스별 역할에 맞는 보안그룹 분리
- **RDS**: MariaDB, 멀티 AZ, 백업, 암호화 등 지원
- **EC2**: 바스천 등 접근용 인스턴스
- **ECS/ALB**: 컨테이너 오케스트레이션, 로드밸런싱
- **CI/CD**: CodePipeline, CodeBuild, CodeDeploy, ECR, ECS 등 자동화 배포
- **모듈화**: 모든 인프라 리소스를 모듈화하여 재사용성 및 유지보수성 강화

---

## ✅ 장점

- **모듈화**: 모든 리소스를 모듈로 분리, 재사용 및 유지보수 용이
- **환경 분리**: dev/production 등 환경별 인프라 정의 가능
- **확장성**: 새로운 리소스 추가 시 모듈만 추가/수정
- **가독성**: 각 리소스별로 파일 분리, 구조 명확
- **AWS Best Practice**: VPC, 보안그룹, 서브넷, IAM 등 분리 설계

---

## 🛠️ 개선/운영 팁

- **변수 관리**: 민감 정보(비밀번호 등)는 secret manager 또는 암호화된 tfvars로 분리
- **코드 중복**: 환경별 중복 코드는 workspace, for_each 등으로 DRY하게 개선
- **주석/문서화**: 각 모듈별 README, 변수 설명 등 문서화 강화 필요
- **CI/CD 파이프라인 활성화**: pipeline 관련 모듈 실제 적용 및 테스트 필요
- **테스트/검증**: `terraform validate`, `plan`, `apply` 자동화 및 테스트 코드 추가 권장
- **output 정리**: 실제 필요한 output만 노출

---

## 🏗️ 유사 프로젝트 설계 시 참고 포인트

- 네트워크, DB, 보안, 배포 등 각 도메인별로 모듈화
- dev, prod 등 환경별로 진입점 분리
- 변수와 output을 명확히 정의
- pipeline 모듈을 적극 활용해 자동화
- README, 각 모듈별 사용법 문서화

---

## 🧩 실전 운영/배포 명령어

```bash
# AWS SSO 로그인
aws configure sso
aws sso login --profile your-profile-name

# 키페어 생성
ssh-keygen -t rsa -b 2048 -f mykey

# Terraform 기본 명령어
terraform init
terraform plan -var-file=environments/dev/terraform.tfvars
terraform apply -var-file=environments/dev/terraform.tfvars
terraform destroy -var-file=environments/dev/terraform.tfvars

# 예시: 인프라 배포
terraform apply -var-file="secret.tfvars" -var-file="production.tfvars"

# 글로벌/공통 변수 적용
terraform plan -var-file=../../global/terraform.tfvars
terraform apply -var-file=../../global/terraform.tfvars
terraform destroy -var-file=../../global/terraform.tfvars
```

---

## 🔒 보안/운영 주의사항

- **민감 정보**: 비밀번호, 키 등은 절대 코드에 직접 노출하지 말고, 암호화된 tfvars/Secret Manager 사용
- **.gitignore**: `.tfstate`, `.tfvars`, 키 파일 등 민감 파일은 반드시 Git에 제외
- **IAM 권한 최소화**: Terraform 실행 계정은 최소 권한 원칙 적용
- **백업/복구**: `terraform state` 파일은 안전하게 백업/관리

---

## 📚 참고 링크

- [Terraform AWS Provider Docs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Terraform 공식 문서](https://developer.hashicorp.com/terraform/cli/run)
- [AWS CodePipeline IAM Guide](https://docs.aws.amazon.com/codepipeline/latest/userguide/security-iam.html#how-to-update-role-new-services)

---
