resource "aws_db_subnet_group" "rds-subnet" {
  name = var.subnet_group_name
  description = "RDS subnet group"
  subnet_ids  = var.subnet_ids
#  subnet_ids  = [aws_subnet.main-private-1.id, aws_subnet.main-private-2.id]
  tags = {
    Name = "RDS subnet group"
  }
}

# This defines a parameter group for the database instance.
# The group allows for customization of the database engine configuration.
resource "aws_db_parameter_group" "rds-parameters" {
  name   = "rds-parameters-group"
  family = "postgres14"
  description = "PostgreSQL parameter group"

  # PostgreSQL에 맞는 파라미터가 필요할 경우 여기에 추가합니다.
  # 예:
  # parameter {
  #   name  = "log_connections"
  #   value = "1"
  # }
}

# This defines an option group for the database instance.
# Option groups provide additional features and settings for specific database engines.
resource "aws_db_option_group" "example" {
  name                   = "option-group"
  engine_name            = "postgres"
  major_engine_version   = "14"
  option_group_description = "Example option group for PostgreSQL"
}

resource "random_password" "password" {
  length  = 16
  special = true
  override_special = "/@\" "
}

resource "aws_db_instance" "this" {
  instance_class      = var.instance_class
  engine              = var.engine
  port                = var.port
  allocated_storage   = var.allocated_storage
  storage_type        = var.storage_type
  username            = var.username
  password            = var.password
  skip_final_snapshot = var.skip_final_snapshot
  final_snapshot_identifier = "mydb-final-snapshot-${var.environment}-${formatdate("YYYYMMDDhhmmss", timestamp())}"
}
