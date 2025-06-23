output "name" {
  description = "The name of the ALB"
  value       = one(aws_lb.this[*].name)
}

# The ALB ID.
output "id" {
  description = "The id of the ALB"
  value       = one(aws_lb.this[*].id)
}

# The ALB ARN.
output "arn" {
  description = "The arn of the ALB"
  value       = one(aws_lb.this[*].arn)
}

# The ALB dns_name.
output "dns" {
  description = "The dns of the ALB"
  value       = one(aws_lb.this[*].dns_name)
}

# The zone id of the ALB
output "zone_id" {
  description = "The zone_id of the ALB"
  value       = one(aws_lb.this[*].zone_id)
}


# The ARN of the Target Group
output "target_group_arn" {
  description = "The arn of the target group"
  value       = one(aws_lb_target_group.main[*].arn)
}

#  The ARN suffix of the Target Group for use with CloudWatch Metrics.
output "target_group_arn_suffix" {
  description = "The arn_suffix of the target group"
  value       = one(aws_lb_target_group.main[*].arn_suffix)
}
