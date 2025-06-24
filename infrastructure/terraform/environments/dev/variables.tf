# aws region
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-northeast-2"
}

# aws config
variable "aws_profile" {
  description = "for running terraform aws profile"
  type        = string
}

# aws environment
variable "environment" {
  description = "for running terraform aws environment"
  type        = string
  default     = "dev"
}

# aws name
variable "project_name" {
  description = "for running terraform aws name"
  type        = string
  default     = "pay-api"
}

# from global/terraform.tfvars
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
variable "vpc_cidr_block" {}
variable "public_subnet_cidr" {}
variable "availability_zone" {}
variable "instance_type" {}
variable "key_name" {
  description = "EC2 Key Pair name for SSH access"
  type        = string
}
variable "github_oauth_token" {
  sensitive = true
}
variable "region" {}

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

variable "ami_id" {
  description = "AMI ID for EC2"
  type        = string
}

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

variable "security_group_id" {
  description = "Security Group ID for EC2 instance"
  type        = string
}