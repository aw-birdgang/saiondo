TERRAFORM PRD (운영 환경: prd)
1. 목적
   운영(Production) 환경의 AWS 인프라를 최소 비용으로 구축한다.
   필수 리소스만 배포하고, 고가용성/확장성/자동화는 "최소한"만 적용한다.
   IaC(Terraform)로 재현 가능하고, 변경 이력을 추적할 수 있다.


2. 요구사항(Requirements)
   2.1. 네트워크(VPC)
   VPC: 운영 전용 CIDR(예: 10.1.0.0/16)
   서브넷: 퍼블릭 1개, 프라이빗 1개 (AZ 분산 최소화)
   인터넷 게이트웨이: 1개
   NAT Gateway: 생성하지 않음 (비용 절감, 프라이빗 리소스가 외부 접근 필요시 EC2 NAT 인스턴스 사용 고려)
   라우팅 테이블: 퍼블릭/프라이빗 별도 관리
   2.2. 보안(Security)
   보안그룹: EC2, RDS 등 리소스별 최소 권한 원칙 적용
   키페어: 운영용 별도 키페어
   2.3. 컴퓨팅(EC2)
   EC2: 바스천(접근용), t3.micro(프리티어/최저사양), 1대만 운영
   ECS/컨테이너: 필요시만 사용, 가능하면 EC2 단독 운영
   2.4. 데이터베이스(RDS)
   RDS: MariaDB/MySQL, Single-AZ(Multi-AZ 미사용), 자동 백업(7일), 암호화, 프라이빗 서브넷 배치
   스토리지: 20GB(gp2, 프리티어/최저사양)
   DB 암호: 변수 파일 또는 SSM Parameter Store 사용
   2.5. CI/CD
   CodePipeline/CodeBuild/CodeDeploy: 1개만 운영, 빌드/배포 최소화(수동 트리거 권장)
   ECR: 운영용 1개만 생성
   2.6. 스토리지/로깅
   S3: 로그, 아티팩트 저장용, 1개만 생성, 저장량 최소화
   CloudWatch: 기본 로그만 활성화
   2.7. IAM
   역할/정책: 최소 권한 원칙, 운영/개발 분리
   2.8. 기타
   Output: 주요 리소스 ID, 엔드포인트 등만 출력
   변수 관리: 운영/개발 환경 분리, 민감 정보는 별도 파일 또는 SSM 사용
   태깅: 환경, 서비스명, 소유자 등 공통 태그 적용

3. 구현 시 필요한 정보(Variables)
   AWS 리전(예: ap-northeast-2)
   운영용 AWS 프로필/자격증명
   VPC CIDR, 서브넷 CIDR
   EC2 인스턴스 타입, 수량
   RDS 엔진/버전/스토리지/백업/암호화 옵션
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
  instance_class = "db.t3.micro"
  multi_az = false
  username = "admin"
  password = var.db_password
  db_name = "payments"
  storage_type = "gp2"
  allocated_storage = 20
  max_allocated_storage = 50
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

# prd/instances.tf
````
module "prd-bastion" {
  source = "../modules/instances"
  name = "prd-bastion"
  env = "prd"
  vpc_id = module.prd-vpc.id
  vpc_security_group_ids = module.security-group.vpc_ec2_security_group_ids
  public_subnets = [module.prd-vpc.public_1_id]
  key_pair_name = "prd-key"
  instance_type = "t3.micro"
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

6. 비용 절감 체크리스트
   [x] EC2, RDS 모두 t3.micro(프리티어/최저사양) 사용
   [x] RDS Single-AZ, 스토리지 최소(20GB)
   [x] NAT Gateway 미생성
   [x] ALB, ECS 등 고비용 리소스 미사용(필요시만 생성)
   [x] S3, ECR, CodePipeline 등 최소 개수만 생성
   [x] CloudWatch, 백업 등 기본 옵션만 활성화
   [x] 불필요한 리소스, output, 변수 제거

7. 참고
   dev 환경과 최대한 코드/모듈 재사용
   운영 환경이라도 비용이 최우선이면 고가용성, 확장성, 자동화는 "최소한"만 적용
   실제 배포 전 AWS 요금 계산기로 견적 필수
   트래픽, 데이터, 사용량 증가 시 비용이 급증할 수 있으니 모니터링 필수
