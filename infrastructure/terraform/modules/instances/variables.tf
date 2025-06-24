variable "environment" {
}

variable "name" {
  description = "name"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

variable "public_subnets" {
  type = list
}

variable "vpc_id" {
}

variable "key_pair_name" {
  description = "key-pair"
}

variable "vpc_security_group_ids" {
  description = "vpc_security_group_ids"
}

variable "ami_id" {
  description = "AMI ID for EC2 instance"
  type        = string
}
