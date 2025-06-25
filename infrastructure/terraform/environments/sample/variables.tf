########################
# 1. AWS 기본 환경/프로젝트 변수
########################
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-northeast-2"
}

variable "environment" {
  description = "for running terraform aws environment"
  type        = string
  default     = "sample"
}

variable "project_name" {
  description = "for running terraform aws name"
  type        = string
  default     = "saiondo"
}

variable "key_name" {
  description = "EC2 Key Pair name for SSH access"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "ami_id" {
  description = "AMI ID for EC2"
  type        = string
}
