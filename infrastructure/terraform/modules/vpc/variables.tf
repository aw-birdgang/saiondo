variable "name" {
  description = "The name for the VPC"
}

variable "environment" {
  description = "Environment tag, e.g prod"
}

variable "vpc_cidr_block" {
  description = "VPC CIDR BLOCK"
}

variable "public_subnets" {
  description = "CIDR list of public subnets"
  type        = list(string)
}

variable "public_subnets_name" {
  description = "CIDR list of public subnets"
  type        = list(string)
}

variable "private_subnets" {
  description = "CIDR list of private subnets"
  type        = list(string)
}

variable "private_subnets_name" {
  description = "CIDR list of private subnets"
  type        = list(string)
}

variable "nat_gateway_enabled" {
  type        = bool
  description = "Flag to control NAT Gateway creation. Set to false for cost-saving dev environments."
  default     = true
}

#variable "keypair" {
#  description = "The keypair name to use for bastion host"
#}

