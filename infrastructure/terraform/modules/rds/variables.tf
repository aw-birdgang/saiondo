############################## BASE ####################

variable "environment" {
  description = "environment"
}

variable "name" {
  description = "name"
}

variable "aws_region" {
  default = "ap-northeast-2"
}

variable "rds_name" {
  default = "rds"
  description = "rds name"
}

variable "allocated_storage" {
  description = "RDS storage (GB)"
  type        = number
  default     = 20
}

variable "max_allocated_storage" {
  default = 100
  description = "Storage size in GB"
}

variable "engine" {
  description = "RDS engine"
  type        = string
  default     = "mysql"
}

variable "engine_version" {
  description = "Engine version"
  default     = "10.11"
}

variable "port" {
  description = "The port on which the DB instance is listening."
  type        = number
  default     = null
}

variable "instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "identifier" {
  default     = "mariadb"
  description = "Identifier for your DB"
}

variable "db_name" {
  default     = "sample"
  description = "db name"
}

variable "username" {
  default     = "admin"
  description = "User name"
}

variable "ca_cert_identifier" {
  default     = "rds-ca-rsa2048-g1"
  description = "ca cert identifier"
}

variable "publicly_accessible" {
  default     = false
  description = "publicly accessible"
}

variable "multi_az" {
  default     = "false"
  description = "multi_az"
}

variable "vpc_security_group_ids" {
  type = list(string)
  description = "vpc_security_group_ids"
}

variable "storage_type" {
  description = "RDS storage type"
  type        = string
  default     = "gp2"
}

variable "backup_retention_period" {
  default     = 7
  description = "backup_retention_period"
}

variable "availability_zone" {
  description = "availability_zone"
}

variable "skip_final_snapshot" {
  default     = true
  description = "availability_zone"
}

variable "password" {
  description = "password, provide through your ENV variables"
}

variable "subnet_ids" {
  description = "subnets"
}

variable "subnet_group_name" {
  default = "subnet group name"
  description = "db subnet group name"
}

variable "storage_encrypted" {
  default = false
  description = "storage encrypted"
}
