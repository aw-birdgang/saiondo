output "vpc_rds_security_group_ids" {
  description = "Security group ID"
  value       = [aws_security_group.allow-mariadb.id]
}

output "vpc_rds_security_group_ids_everyone" {
  description = "Security group ID"
  value       = [aws_security_group.allow-mariadb-everyone.id]
}

output "vpc_ec2_security_group_ids" {
  description = "Security group ID"
  value       = [aws_security_group.allow-ssh.id, aws_security_group.allow-http.id]
}

output "alb_sg_id" {
  description = "The ID of the security group for the ALB"
  value       = aws_security_group.alb.id
}
