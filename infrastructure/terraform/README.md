# Terraform 프로젝트 구조

```
terraform/
├── environments/
│   └── dev/
│       ├── backend.tf
│       ├── main.tf
│       └── variables.tf
├── modules/
│   ├── network/
│   │   ├── main.tf
│   │   ├── outputs.tf
│   │   └── variables.tf
│   └── ec2/
│       ├── main.tf
│       ├── outputs.tf
│       └── variables.tf
└── global/
    ├── provider.tf
    └── terraform.tfvars
```

- `environments/dev`: 개발 환경별 인프라 정의
- `modules/network`: VPC, Subnet, IGW, Route Table 등 네트워크 리소스 모듈
- `modules/ec2`: EC2 인스턴스 리소스 모듈
- `global`: provider, 변수 값 등 공통 설정 

---

# AWS 배포 가이드 (Terraform)

이 프로젝트는 모듈화된 구조로 AWS 인프라를 손쉽게 배포할 수 있도록 설계되었습니다.  
아래의 절차에 따라 실제로 AWS에 인프라를 배포할 수 있습니다.

## 1. 사전 준비

### 1.1. Terraform 원격 상태(Remote State) 설정 (최초 1회 필수)

Terraform은 생성된 인프라의 상태를 `.tfstate` 파일에 저장합니다. 여러 명의 개발자가 협업하고, 상태 파일의 유실 및 충돌을 방지하기 위해 **S3**와 **DynamoDB**를 사용한 원격 상태 관리가 **필수**입니다.

프로젝트에 포함된 `setup_backend.sh` 스크립트를 실행하여 원격 상태 저장을 위한 S3 버킷과 DynamoDB 테이블을 자동으로 생성할 수 있습니다. **이 작업은 프로젝트 시작 시 단 한 번만 실행하면 됩니다.**

**1. 스크립트 실행 권한 부여**
```sh
chmod +x scripts/setup_backend.sh
```

**2. 백엔드 설정 스크립트 실행**
```sh
./scripts/setup_backend.sh
```
> **참고**: 스크립트는 리소스가 이미 존재하는지 확인하므로 여러 번 실행해도 안전합니다. 만약 S3 버킷 이름 충돌 오류가 발생하면, `scripts/setup_backend.sh` 파일 상단의 `BUCKET_NAME` 변수를 수정한 후 다시 실행하세요.

### 1.2. 기존 준비 사항

1. **AWS 계정 및 권한**
   - AWS 계정이 있어야 하며, EC2/VPC 등 리소스 생성 권한이 필요합니다.
2. **AWS CLI 설치 및 인증**
   - [AWS CLI 설치 가이드](https://docs.aws.amazon.com/ko_kr/cli/latest/userguide/getting-started-install.html)
   - 터미널에서 다음 명령어로 인증 정보를 입력합니다.
     ```sh
     aws configure
     ```
   - Access Key, Secret Key, Region, Output format 입력
3. **Terraform 설치**
   - [Terraform 설치 가이드](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli)
   - 설치 후 버전 확인:
     ```sh
     terraform -version
     ```

## 2. 배포 절차

### 2.1. 디렉토리 이동

배포하려는 환경의 디렉토리로 이동합니다.

**개발 환경**
```sh
cd infrastructure/terraform/environments/dev
```

**운영 환경**
```sh
cd infrastructure/terraform/environments/prod
```

### 2.2. 초기화

Terraform 작업 환경을 초기화합니다. 이 작업은 해당 디렉토리에서 처음 명령을 실행하거나 모듈이 추가/변경되었을 때 필요합니다.

```sh
terraform init
```

### 2.3. 실행 계획 확인 (Plan)

Terraform이 어떤 리소스를 생성/변경/삭제할지 미리 확인합니다.
명령어는 **공통 변수 파일**과 **환경별 변수 파일**을 모두 로드하여 실행합니다.

**개발 환경 (`dev`)**
```sh
terraform plan -var-file="../../global/terraform.tfvars" -var-file="terraform.tfvars"
```

**운영 환경 (`prod`)**
```sh
terraform plan -var-file="../../global/terraform.tfvars" -var-file="terraform.tfvars"
```

### 2.4. 인프라 배포 (Apply)

실행 계획이 문제없다면, 실제 인프라를 배포합니다.

**개발 환경 (`dev`)**
```sh
terraform apply -var-file="../../global/terraform.tfvars" -var-file="terraform.tfvars"
```

**운영 환경 (`prod`)**
```sh
terraform apply -var-file="../../global/terraform.tfvars" -var-file="terraform.tfvars"
```
> `yes`를 입력하여 최종 적용을 확인합니다.

## 3. 인프라 삭제(정리)

Terraform으로 생성된 모든 리소스를 삭제하려면 각 환경에 맞는 변수 파일을 사용하여 `destroy` 명령을 실행합니다.

**개발 환경 (`dev`)**
```sh
terraform destroy -var-file="../../global/global.tfvars" -var-file="dev.tfvars"
```

**운영 환경 (`prod`)**
```sh
terraform destroy -var-file="../../global/global.tfvars" -var-file="prod.tfvars"
```
> `yes`를 입력하여 삭제를 확인합니다.

## 4. 프로젝트 완전 삭제 (백엔드 리소스 정리)

`terraform destroy` 명령은 Terraform 코드로 관리되는 인프라만 삭제할 뿐, **원격 상태(Remote State)를 저장하기 위해 생성했던 S3 버킷과 DynamoDB 테이블은 자동으로 삭제하지 않습니다.**

프로젝트를 완전히 종료하고 관련 AWS 리소스를 모두 정리하려면, `cleanup_backend.sh` 스크립트를 실행하여 백엔드 리소스를 **수동으로 삭제**해야 합니다.

> **경고**: 이 스크립트를 실행하면 Terraform 상태 파일(`tfstate`)이 영구적으로 삭제되어, 더 이상 해당 인프라의 상태를 추적하거나 관리할 수 없게 됩니다. 스크립트의 경고 메시지를 잘 읽고 신중하게 결정하세요.

**1. 스크립트 실행 권한 부여** (최초 1회)
```sh
chmod +x scripts/cleanup_backend.sh
```

**2. 백엔드 삭제 스크립트 실행**
```sh
./scripts/cleanup_backend.sh
```
- 스크립트가 실행되면 삭제될 리소스를 다시 한번 보여주고, 정말로 삭제할 것인지 묻습니다.
- 안내에 따라 `yes`를 입력해야 최종적으로 삭제가 진행됩니다. `no` 또는 다른 값을 입력하면 안전하게 취소됩니다.

## 5. 참고 사항

- **변수 파일 구조**:
  - `global/global.tfvars`: 모든 환경에 적용되는 공통 변수(프로젝트 이름, 리전 등)를 정의합니다.
  - `environments/dev/dev.tfvars`: 개발 환경에만 적용되는 변수를 정의합니다.
  - `environments/prod/prod.tfvars`: 운영 환경에만 적용되는 변수를 정의합니다.
  - `plan` 또는 `apply` 시, `-var-file` 인수를 중첩하여 사용하며, 나중에 선언된 파일의 변수가 우선적으로 적용(override)됩니다.

- **민감 정보 관리**:
  - `prod.tfvars`와 같은 파일에 DB 비밀번호 등 민감한 정보를 직접 저장하는 것은 권장되지 않습니다.
  - 실제 운영 시에는 AWS Secrets Manager를 사용하거나, `TF_VAR_db_password="mysecret"`와 같이 환경 변수를 통해 주입하는 것이 훨씬 안전합니다.
  - `*.tfvars` 파일은 `.gitignore`에 등록하여 Git 저장소에 포함되지 않도록 관리해야 합니다.

- **키페어**: 각 환경의 `.tfvars` 파일(`key_name` 변수)에 명시된 이름과 동일한 키페어가 AWS에 미리 생성되어 있어야 합니다.
- **비용**: EC2, VPC 등 리소스는 실제 과금이 발생하니, 사용 후 반드시 `terraform destroy`로 삭제하세요.
- **환경 확장**: `environments/` 하위에 `prod` 등 다른 환경을 추가해 확장할 수 있습니다.
- **모듈 확장**: 필요에 따라 S3, RDS, Security Group 등 모듈을 추가해 인프라를 확장할 수 있습니다.

## 6. 문제 해결

- **권한 오류**: AWS IAM 권한을 확인하세요.
- **키페어 오류**: AWS 콘솔에서 EC2 > 키페어 메뉴에서 키를 생성하세요.
- **리소스 충돌**: CIDR, 이름 등 중복되지 않게 설정하세요.

## 7. 참고 링크

- [Terraform 공식 문서](https://developer.hashicorp.com/terraform/docs)
- [AWS Provider 문서](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [AWS Free Tier](https://aws.amazon.com/ko/free/) 
