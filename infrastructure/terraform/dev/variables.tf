variable "aws_region" {
  default = "ap-northeast-2"
}

variable "s3_bucket_name" {
  description = "S3 bucket name"
  type        = string
}

variable "dynamodb_table_name" {
  description = "DynamoDB table name"
  type        = string
}

variable "my_ip" {}
variable "ami_id" {}
variable "key_name" {}
variable "project" { default = "dev" }
variable "github_owner" {}
variable "github_repo_name" {}
variable "github_branch" { default = "main" }
variable "github_token" {}
variable "github_repo" {}
