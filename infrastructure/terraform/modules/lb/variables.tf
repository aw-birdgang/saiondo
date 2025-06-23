############################## BASE ####################

variable "environment" {
  description = "environment"
}

variable "name" {
  description = "name"
}


############################## VPC ####################

variable "vpc_id" {
  description = "VPC id"
}

variable "public_subnets" {
  type = list
}
