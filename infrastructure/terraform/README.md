# ☁️ SAIONDO Terraform 인프라 프로젝트

**SAIONDO의 AWS 인프라를 코드로 관리하는 Terraform 프로젝트입니다.**  
모듈화, 환경 분리, 원격 상태 관리, 자동화 스크립트 등 실전 운영 경험을 반영하여  
안전하고 확장성 있게 AWS 리소스를 배포/운영할 수 있도록 설계되었습니다.

---

## 📁 프로젝트 폴더 구조

```plaintext
terraform/
├── environments/
│   ├── dev/
│   │   ├── backend.tf
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── terraform.tfvars
│   └── prod/
│       ├── backend.tf
│       ├── main.tf
│       ├── variables.tf
│       └── terraform.tfvars
├── modules/
│   ├── network/
│   │   ├── main.tf
│   │   ├── outputs.tf
│   │   └── variables.tf
│   ├── ec2/
│   │   ├── main.tf
│   │   ├── outputs.tf
│   │   └── variables.tf
│   └── ... (S3, RDS, SG 등 확장 가능)
├── global/
│   ├── provider.tf
│   └── terraform.tfvars
├── scripts/
│   ├── setup_backend.sh      # 원격 상태(S3/DynamoDB) 자동 생성
│   └── cleanup_backend.sh    # 원격 상태 리소스 삭제
└── README.md
```

- `environments/dev`, `environments/prod`: 환경별 인프라 정의(코드/변수/상태)
- `modules/`: 네트워크, EC2 등 재사용 가능한 리소스 모듈
- `global/`: provider, 공통 변수 등 전체 환경에 적용되는 설정
- `scripts/`: 원격 상태 관리 자동화 스크립트

---

## 🏗️ 구조적 특징 및 Best Practice

- **모듈화**: 모든 리소스는 `modules/` 하위 모듈로 관리, 재사용/확장 용이
- **환경 분리**: dev, prod 등 환경별 디렉토리로 IaC 관리(코드/변수/상태 완전 분리)
- **원격 상태 관리**: S3 + DynamoDB로 tfstate 파일 충돌/유실 방지
- **자동화 스크립트**: `setup_backend.sh`, `cleanup_backend.sh`로 상태 리소스 자동 생성/삭제
- **변수/출력**: `variables.tf`, `output.tf`로 파라미터화 및 결과값 관리
- **보안**: 민감 정보는 환경변수/Secrets Manager로 관리, tfvars는 git에 포함 금지
- **확장성**: S3, RDS, Security Group 등 모듈 추가로 인프라 확장 가능

---

## 🚀 배포/운영 절차

### 1. 원격 상태(Remote State) 설정 (최초 1회)

Terraform 상태 파일(tfstate)을 S3/DynamoDB로 관리해야 협업/충돌 방지에 안전합니다.

```sh
chmod +x scripts/setup_backend.sh
./scripts/setup_backend.sh
```
- S3 버킷, DynamoDB 테이블 자동 생성
- 여러 번 실행해도 안전(존재 시 skip)
- 버킷 이름 충돌 시 `setup_backend.sh` 내 변수 수정

### 2. AWS 인증/CLI/Terraform 설치

- [AWS CLI 설치](https://docs.aws.amazon.com/ko_kr/cli/latest/userguide/getting-started-install.html)
- `aws configure`로 Access Key, Secret Key, Region, Output format 입력
- [Terraform 설치](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli)
- `terraform -version`으로 설치 확인

### 3. 환경별 디렉토리 이동

```sh
cd infrastructure/terraform/environments/dev   # 개발 환경
cd infrastructure/terraform/environments/prod  # 운영 환경
```

### 4. 초기화

```sh
terraform init
```

### 5. 실행 계획 확인 (Plan)

```sh
terraform plan -var-file="../../global/terraform.tfvars" -var-file="terraform.tfvars"
```

### 6. 인프라 배포 (Apply)

```sh
terraform apply -var-file="../../global/terraform.tfvars" -var-file="terraform.tfvars"
# yes 입력
```

### 7. 인프라 삭제 (Destroy)

```sh
terraform destroy -var-file="../../global/terraform.tfvars" -var-file="terraform.tfvars"
# yes 입력
```

### 8. 프로젝트 완전 삭제 (백엔드 리소스 정리)

```sh
chmod +x scripts/cleanup_backend.sh
./scripts/cleanup_backend.sh
```
- S3/DynamoDB 상태 리소스까지 완전 삭제(주의!)

---

## 🔒 보안/운영 유의사항

- **tfvars, 키, 비밀번호 등 민감 정보는 git에 포함 금지** (`.gitignore` 필수)
- 운영 환경은 AWS Secrets Manager, 환경변수 등으로 민감 정보 주입 권장
- 키페어는 AWS 콘솔에서 미리 생성, 변수와 이름 일치 확인
- Free Tier 초과/불필요 리소스는 즉시 삭제(비용 주의)
- 환경별로 VPC, SG, EC2 등 리소스 네이밍/태깅 일관성 유지
- Terraform backend(상태 저장)는 S3/DynamoDB 등 원격으로 구성 권장

---

## 🛠️ 확장/모듈 관리

- `modules/` 하위에 S3, RDS, Security Group 등 모듈을 추가해 인프라 확장 가능
- 환경 추가 시 `environments/` 하위에 prod, staging 등 디렉토리 복제
- 모듈/환경별 변수는 `variables.tf`, `terraform.tfvars`로 관리

---

## 🧑‍💻 문제 해결 & 운영 팁

| 문제/이슈 | 해결 방법 |
|-----------|-----------|
| 권한 오류 | AWS IAM 권한 확인(EC2, VPC, S3 등) |
| 키페어 오류 | AWS 콘솔에서 EC2 > 키페어 메뉴에서 키 생성, 변수와 이름 일치 확인 |
| 리소스 충돌 | CIDR, 이름 등 중복되지 않게 설정 |
| 상태 파일 충돌 | 원격 상태(S3/DynamoDB)로 관리, 단일 환경에서만 apply |
| 비용 이슈 | 사용 후 `terraform destroy`로 리소스 삭제, Free Tier 내 사용 권장 |

---

## 📚 참고/문서

- [Terraform 공식 문서](https://developer.hashicorp.com/terraform/docs)
- [AWS Provider 문서](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [AWS Free Tier](https://aws.amazon.com/ko/free/) 

---

> **실제 운영/확장/문제해결 경험은 [dev 환경 가이드](./docs/dev-guide.md)도 참고하세요!**
>  
> 추가로 buildspec.yml, ECS Task Definition 등 샘플은 docs/에 별도 추가해 활용하세요.
