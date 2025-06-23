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
variable "key_name" {}
variable "github_oauth_token" {
  sensitive = true
}
variable "region" {}

variable "alb_enabled" {
  description = "Flag to control the creation of the ALB"
  type        = bool
  default     = false
}

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

variable "db_password" {
  description = "Password for the RDS database. Should be passed via .tfvars or environment variables."
  type        = string
  sensitive   = true
}