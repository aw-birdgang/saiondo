variable "aws_region" {}
variable "vpc_cidr_block" {}
variable "public_subnet_cidr" {}
variable "availability_zone" {}
variable "instance_type" {}
variable "key_name" {}
variable "github_owner" {}
variable "github_repo" {}
variable "github_oauth_token" {
  sensitive = true
} 