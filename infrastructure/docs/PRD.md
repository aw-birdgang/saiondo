TERRAFORM PRD (운영 환경: prd)
1. 목적
   운영(Production) 환경의 AWS 인프라를 코드로 안전하게 관리한다.
   dev 환경과 분리된 리소스, 보안, 고가용성, 확장성, 자동화 배포를 보장한다.
   IaC(Terraform)로 재현 가능하고, 변경 이력을 추적할 수 있다.

2. 요구사항(Requirements)
   2.1. 네트워크(VPC)
   VPC: 운영 전용 CIDR(예: 10.1.0.0/16)
   서브넷: 퍼블릭/프라이빗 각 3개 이상, AZ 분산
   인터넷 게이트웨이, NAT Gateway: 퍼블릭/프라이빗 분리, NAT Gateway는 최소 2개(고가용성)
   라우팅 테이블: 퍼블릭/프라이빗 별도 관리
   2.2. 보안(Security)
   보안그룹: EC2, RDS, ALB 등 리소스별 최소 권한 원칙 적용
   네트워크 ACL: 필요시 적용
   키페어: 운영용 별도 키페어
   2.3. 컴퓨팅(EC2, ECS)
   EC2: 바스천(접근용), 최소 t3.small 이상, 필요시 오토스케일링
   ECS: 컨테이너 기반 서비스 운영, Fargate 권장
   ALB: ECS 서비스 앞단에 배치, HTTPS 지원(ACM 인증서)
   2.4. 데이터베이스(RDS)
   RDS: MariaDB/MySQL, Multi-AZ, 자동 백업(7일 이상), 암호화, 프라이빗 서브넷 배치
   스토리지: 50GB 이상, gp3 권장
   DB 암호: SSM Parameter Store 또는 Secrets Manager로 관리
   2.5. CI/CD
   CodePipeline: 운영용 별도 파이프라인
   CodeBuild/CodeDeploy: 운영용 IAM 역할, 환경 변수 분리
   ECR: 운영용 별도 리포지토리
   2.6. 스토리지/로깅
   S3: 로그, 아티팩트 저장용, 버전 관리, 암호화
   CloudWatch: 로그, 모니터링, 알람
   2.7. IAM
   역할/정책: 최소 권한 원칙, 운영/개발 분리
   2.8. 기타
   Output: 주요 리소스 ID, 엔드포인트 등 출력
   변수 관리: 운영/개발 환경 분리, 민감 정보는 별도 파일 또는 SSM/Secrets Manager 사용
   태깅: 환경, 서비스명, 소유자 등 공통 태그 적용

3. 구현 시 필요한 정보(Variables)
   AWS 리전(예: ap-northeast-2)
   운영용 AWS 프로필/자격증명
   VPC CIDR, 서브넷 CIDR, AZ 목록
   EC2/ECS 인스턴스 타입, 수량
   RDS 엔진/버전/스토리지/백업/암호화 옵션
   ALB 도메인, 인증서(ACM) ARN
   S3/ECR 버킷/리포지토리명
   CodePipeline/CodeBuild/CodeDeploy 설정
   IAM 역할/정책 명칭
   태그(환경, 서비스명, 소유자 등)
   민감 정보(비밀번호, 키 등) 저장 위치

4. 디렉토리/파일 구조 예시
   terraform/
   ├── prd/
   │   ├── main.tf
   │   ├── vpc.tf
   │   ├── rds.tf
   │   ├── securitygroup.tf
   │   ├── variables.tf
   │   ├── output.tf
   │   ├── pipeline_app_api.tf
   │   ├── instances.tf
   │   ├── alb.tf
   │   └── ecs.tf
   └── modules/
   ├── vpc/
   ├── security-group/
   ├── rds/
   ├── instances/
   ├── pipeline/
   ├── alb/
   ├── ecs-cluster/
   ├── ecs-service/
   └── ...

5. 구현 예시(샘플 코드)
# prd/main.tf
````
provider "aws" {
   profile = var.aws_profile
   region  = var.aws_region
}
````

# prd/variables.tf
````
variable "aws_region" {
  default = "ap-northeast-2"
}
variable "aws_profile" {
  description = "운영 환경용 AWS 프로필"
}
# 기타 VPC, RDS, ECS, ALB 등 변수 정의
````

# prd/vpc.tf
````
module "prd-vpc" {
  source = "../modules/vpc"
  name = "prd-lotto-vpc"
  environment = "prd"
  vpc_cidr_block = "10.1.0.0/16"
  public_subnets  = ["10.1.1.0/24", "10.1.2.0/24", "10.1.3.0/24"]
  private_subnets = ["10.1.4.0/24", "10.1.5.0/24", "10.1.6.0/24"]
  # NAT Gateway, IGW 등 옵션 추가
}
````

# prd/rds.tf
````
module "prd-database" {
  source = "../modules/rds"
  rds_name = "rds-payment-prd"
  engine = "mariadb"
  engine_version = "10.11"
  instance_class = "db.t3.medium"
  multi_az = true
  username = "admin"
  password = var.db_password
  db_name = "payments"
  storage_type = "gp3"
  allocated_storage = 50
  max_allocated_storage = 200
  backup_retention_period = 7
  skip_final_snapshot = false
  publicly_accessible = false
  storage_encrypted = true
  vpc_id = module.prd-vpc.id
  vpc_security_group_ids = module.security-group.vpc_rds_security_group_ids
  subnet_ids  = module.prd-vpc.private_subnets
  availability_zone = module.prd-vpc.private_1_availability_zone
}
````

# prd/alb.tf
````
module "prd-alb" {
  source = "../modules/alb"
  name = "prd-lotto-alb"
  vpc_id = module.prd-vpc.id
  subnets = module.prd-vpc.public_subnets
  # ACM 인증서, HTTPS 리스너 등 추가
}
````

# prd/ecs.tf
````
module "prd-ecs-cluster" {
  source = "../modules/ecs-cluster"
  name = "prd-lotto-ecs-cluster"
  vpc_id = module.prd-vpc.id
  subnets = module.prd-vpc.private_subnets
}
module "prd-ecs-service" {
  source = "../modules/ecs-service"
  cluster_id = module.prd-ecs-cluster.id
  # 서비스, 태스크 정의 등 추가
}
````

# prd/pipeline_app_api.tf
````
module "prd-codepipeline-app-api" {
  source = "../modules/pipeline"
  env = "prd"
  pipeline_name = "prd_lotto_app_api_pipeline"
  # 기타 파이프라인 변수
}
````

6. 구현 체크리스트
   [ ] 운영용 AWS 계정/프로필 준비
   [ ] 운영용 VPC, 서브넷, NAT Gateway, IGW 설계
   [ ] 운영용 보안그룹, 키페어, IAM 역할 설계
   [ ] RDS Multi-AZ, 암호화, 백업 등 옵션 적용
   [ ] ECS/EC2/ALB 등 고가용성, 오토스케일링 적용
   [ ] S3, ECR, CloudWatch 등 로깅/모니터링 설계
   [ ] CodePipeline 등 CI/CD 운영 환경 분리
   [ ] 변수/민감정보 관리(SSM, Secrets Manager)
   [ ] 태깅 정책 적용
   [ ] output, 문서화, README 작성

7. 참고
   dev 환경과 최대한 코드/모듈 재사용
   운영 환경은 고가용성, 보안, 확장성, 장애 복구를 최우선
   비용은 dev 대비 2~5배 이상 발생할 수 있음(특히 NAT, ALB, Multi-AZ 등)
   실제 배포 전 AWS 요금 계산기로 견적 필수
