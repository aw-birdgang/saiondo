################################################################################
# ECS Cluster Outputs
################################################################################

output "ecs_cluster_id" {
  description = "The ID of the ECS cluster"
  value       = aws_ecs_cluster.ecs_cluster.id
}

output "ecs_cluster_name" {
  description = "The name of the ECS cluster"
  value       = aws_ecs_cluster.ecs_cluster.name
}

output "ecs_cluster_arn" {
  description = "The ARN of the ECS cluster"
  value       = aws_ecs_cluster.ecs_cluster.arn
}

################################################################################
# Auto Scaling & Launch Config Outputs (for EC2 Launch Type)
################################################################################

output "autoscaling_group_id" {
  description = "The ID of the Auto Scaling Group"
  value       = one(aws_autoscaling_group.autoscaling_group[*].id)
}

output "autoscaling_group_name" {
  description = "The name of the Auto Scaling Group"
  value       = one(aws_autoscaling_group.autoscaling_group[*].name)
}

output "autoscaling_group_arn" {
  description = "The ARN of the Auto Scaling Group"
  value       = one(aws_autoscaling_group.autoscaling_group[*].arn)
}

output "autoscaling_group_min_size" {
  description = "The minimum size of the autoscale group"
  value       = one(aws_autoscaling_group.autoscaling_group[*].min_size)
}

output "autoscaling_group_max_size" {
  description = "The maximum size of the autoscale group"
  value       = one(aws_autoscaling_group.autoscaling_group[*].max_size)
}

output "autoscaling_group_desired_capacity" {
  description = "The desired capacity of the autoscale group"
  value       = one(aws_autoscaling_group.autoscaling_group[*].desired_capacity)
}

output "launch_configuration_id" {
  description = "The ID of the launch configuration"
  value       = one(aws_launch_configuration.launch_configuration[*].id)
}

output "launch_configuration_name" {
  description = "The name of the launch configuration"
  value       = one(aws_launch_configuration.launch_configuration[*].name)
}

################################################################################
# ECS Service Outputs (Conditional)
################################################################################

output "service_id" {
  description = "The ID of the ECS service"
  value       = var.launch_type == "FARGATE" ? one(aws_ecs_service.ecs_service[*].id) : one(aws_ecs_service.ec2_service[*].id)
}

output "service_name" {
  description = "The name of the ECS service"
  value       = var.launch_type == "FARGATE" ? one(aws_ecs_service.ecs_service[*].name) : one(aws_ecs_service.ec2_service[*].name)
}

output "task_definition_family" {
  description = "The family of the task definition (only for Fargate)"
  value       = one(aws_ecs_task_definition.ecs_task_definition[*].family)
}

################################################################################
# IAM Role Outputs
################################################################################

output "ecs_task_execution_role_arn" {
  description = "The ARN of the ECS task execution role"
  value       = aws_iam_role.ecs_task_execution_role.arn
}

output "ecs_task_role_arn" {
  description = "The ARN of the ECS task role for application access"
  value       = aws_iam_role.ecs_task_role.arn
}
