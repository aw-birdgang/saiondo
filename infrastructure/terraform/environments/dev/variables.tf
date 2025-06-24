########################
# 1. AWS 기본 환경/프로젝트 변수
########################
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-northeast-2"
}

variable "aws_profile" {
  description = "for running terraform aws profile"
  type        = string
}

variable "environment" {
  description = "for running terraform aws environment"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "for running terraform aws name"
  type        = string
  default     = "api"
}

########################
# 2. 글로벌/공통 변수 (global/terraform.tfvars에서 주입)
########################
variable "project" {}
variable "github_owner" {}
variable "github_repo" {}
variable "codecommit_repo_name" {}
variable "branch_name" {}
variable "codedeploy_app_name" {}
variable "codedeploy_group_name" {}
variable "artifact_bucket_name" {}
variable "load_test_image" {}
variable "codebuild_project1_name" {}
variable "codebuild_project2_name" {}
variable "sfn_arn" {}
variable "ecs_task_execution_role_arn" {}

########################
# 3. 네트워크/인프라 변수
########################
variable "vpc_cidr_block" {}
variable "public_subnet_cidr" {}
variable "availability_zone" {}
variable "instance_type" {}
variable "ami_id" {
  description = "AMI ID for EC2"
  type        = string
}
variable "security_group_id" {
  description = "Security Group ID for EC2 instance"
  type        = string
}
variable "key_name" {
  description = "EC2 Key Pair name for SSH access"
  type        = string
}

########################
# 4. ECS/클러스터 변수
########################
variable "cluster_min_size" {
  description = "ECS cluster min size"
  type        = number
  default     = 1
}
variable "cluster_max_size" {
  description = "ECS cluster max size"
  type        = number
  default     = 1
}

########################
# 5. RDS 관련 변수
########################
variable "rds_username" {
  description = "RDS master username"
  type        = string
}
variable "rds_password" {
  description = "RDS master password"
  type        = string
  sensitive   = true
}
variable "rds_db_name" {
  description = "RDS database name"
  type        = string
}
variable "rds_identifier" {
  description = "RDS instance identifier"
  type        = string
}

########################
# 6. 파이프라인/빌드 관련 변수
########################
variable "repository_in" {
  description = "GitHub repository (예: aw-birdgang/saiondo)"
  type        = string
}
variable "codebuild_docker_file_path" {
  description = "빌드에 사용할 Dockerfile 경로"
  type        = string
}
variable "codebuild_container_name" {
  description = "빌드에 사용할 컨테이너 이름"
  type        = string
}

########################
# 7. 기타 민감 정보
########################
variable "github_oauth_token" {
  sensitive = true
}
variable "region" {}
