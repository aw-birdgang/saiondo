output "subnet_group" {
  value = aws_db_subnet_group.rds-subnet.name
}

output "db_instance_id" {
  description = "The instance identifier of the RDS instance"
  value       = aws_db_instance.this.identifier
}

output "db_instance_address" {
  description = "The address of the RDS instance"
  value       = aws_db_instance.this.address
}

output "endpoint" {
  description = "The connection endpoint of the RDS instance"
  value       = aws_db_instance.this.endpoint
}