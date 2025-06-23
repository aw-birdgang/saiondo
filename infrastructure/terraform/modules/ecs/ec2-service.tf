# EC2-compatible Task Definition
resource "aws_ecs_task_definition" "ec2_task_definition" {
  count = var.launch_type == "EC2" ? 1 : 0

  family                   = "${var.aws_ecs_task_definition_name}-ec2"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn
  network_mode             = "bridge"
  requires_compatibilities = ["EC2"]

  container_definitions = jsonencode([
    {
      name      = var.aws_ecs_task_definition_name
      image     = var.repository_url
      essential = true
      memory    = 512
      cpu       = 256
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "${var.aws_ecs_task_definition_name}-ec2-logs"
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }
      portMappings = [
        {
          containerPort = 3000
          # hostPort = 0 for dynamic port mapping
          hostPort = 0
          protocol = "tcp"
        }
      ]
    }
  ])
}

# CloudWatch Log Group for EC2 Task Definition
resource "aws_cloudwatch_log_group" "ec2_service_logs" {
  count = var.launch_type == "EC2" ? 1 : 0
  name  = "${var.aws_ecs_task_definition_name}-ec2-logs"
}


# EC2-based ECS Service
resource "aws_ecs_service" "ec2_service" {
  count = var.launch_type == "EC2" ? 1 : 0

  name            = "ec2-service-${var.name}"
  cluster         = aws_ecs_cluster.ecs_cluster.id
  task_definition = aws_ecs_task_definition.ec2_task_definition[0].arn
  desired_count   = var.cluster_desired_capacity
  launch_type     = "EC2"
  
  dynamic "load_balancer" {
    for_each = var.lb_listener_front_end != null && var.lb_target_group_blue_id != null ? [1] : []
    content {
      target_group_arn = var.lb_target_group_blue_id
      container_name   = var.aws_ecs_task_definition_name
      container_port   = 3000
    }
  }

  depends_on = [var.lb_listener_front_end]
}
