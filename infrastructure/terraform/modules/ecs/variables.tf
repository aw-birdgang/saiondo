############################## BASE ####################

variable "project_name" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment (dev, prod, etc)"
  type        = string
}

variable "name" {
  description = "name"
}

variable "aws_region" {
  description = "AWS region"
  type = string
  default = "ap-northeast-2"
}

variable "allowed_cidrs" {
  description = "Allowed CIDR blocks for ECS service"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

############################## VPC ####################

variable "vpc_id" {
  description = "VPC id"
  type        = string
}

variable "public_subnets" {
  type    = list(string)
  default = []
}

############################## CLUSTER ####################

variable "aws_ecs_task_definition_name" {
  description = "aws ecs task definition name"
  default = ""
}

variable "repository_url" {
  description = "repository url"
  default = ""
}

variable "keypair" {
  description = "The keypair name to use for instances of the ECS cluster"
  default = ""
}

variable "security_groups" {
  description = "The security groups into which the instances should be applied."
  type        = list(string)
  default     = []
}

variable "subnets" {
  description = "The subnets which the cluster in."
  type        = list(string)
  default     = []
}

variable "cluster_min_size" {
  description = "The minimum size for instance of the cluster."
  default = 1
}

variable "cluster_max_size" {
  description = "The maximum size for instance of the cluster."
  default = 5
}

variable "cluster_desired_capacity" {
  description = "The desired capacity for instance of the cluster."
  type        = number
  default     = 1
}

variable "instance_type" {
  description = "The instance type of the cluster."
  default = ""
}

variable "launch_type" {
  description = "The launch type for the ECS services, e.g., EC2 or FARGATE"
  type        = string
  default     = "EC2"
}


############################## FARGATE ####################

variable "lb_listener_front_end" {
  description = "ALB/LB Listener ARN"
  type        = string
  default     = null
}

variable "lb_target_group_blue_id" {
  description = "ALB/LB Target Group Blue ID"
  type        = string
  default     = null
}

variable "ami_id" {
  description = "AMI ID for EC2 instance"
  type        = string
}

variable "key_name" {
  description = "EC2 Key Pair name"
  type        = string
}

variable "security_group_id" {
  description = "Security Group ID for EC2 instance"
  type        = string
}
