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

```sh
cd infrastructure/terraform/environments/dev
```

### 2.2. 초기화

```sh
terraform init
```

### 2.3. 실행 계획 확인

```sh
terraform plan -var-file=../../global/terraform.tfvars
```

### 2.4. 인프라 배포

```sh
terraform apply -var-file=../../global/terraform.tfvars
```
- `yes` 입력하여 적용

## 3. 인프라 삭제(정리)

```sh
terraform destroy -var-file=../../global/terraform.tfvars
```
- `yes` 입력하여 삭제

## 4. 참고 사항

- **키페어**: `global/terraform.tfvars`의 `key_name` 값과 동일한 이름의 키페어가 AWS에 미리 생성되어 있어야 합니다.
- **비용**: EC2, VPC 등 리소스는 실제 과금이 발생하니, 사용 후 반드시 `terraform destroy`로 삭제하세요.
- **환경 확장**: `environments/` 하위에 `prod` 등 다른 환경을 추가해 확장할 수 있습니다.
- **모듈 확장**: 필요에 따라 S3, RDS, Security Group 등 모듈을 추가해 인프라를 확장할 수 있습니다.

## 5. 문제 해결

- **권한 오류**: AWS IAM 권한을 확인하세요.
- **키페어 오류**: AWS 콘솔에서 EC2 > 키페어 메뉴에서 키를 생성하세요.
- **리소스 충돌**: CIDR, 이름 등 중복되지 않게 설정하세요.

## 6. 참고 링크

- [Terraform 공식 문서](https://developer.hashicorp.com/terraform/docs)
- [AWS Provider 문서](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [AWS Free Tier](https://aws.amazon.com/ko/free/) 