#Manages a revision of an ECS task definition to be used in aws_ecs_service.
resource "aws_ecs_task_definition" "ecs_task_definition" {
  count = var.launch_type == "FARGATE" ? 1 : 0

  #(Required) A unique name for your task definition.
  family = var.aws_ecs_task_definition_name
  #(Optional) ARN of the task execution role that the Amazon ECS container agent and the Docker daemon can assume.
  execution_role_arn = aws_iam_role.ecs_task_execution_role.arn
  #(Optional) ARN of IAM role that allows your Amazon ECS container task to make calls to other AWS services.
  task_role_arn = aws_iam_role.ecs_task_role.arn
  #(Optional) Number of cpu units used by the task. If the requires_compatibilities is FARGATE this field is required.
  cpu = 256
  #(Optional) Amount (in MiB) of memory used by the task. If the requires_compatibilities is FARGATE this field is required.
  memory = 512
  # (Optional) Docker networking mode to use for the containers in the task. Valid values are none, bridge, awsvpc, and host.
  network_mode = "awsvpc"
  #(Optional) Set of launch types required by the task. The valid values are EC2 and FARGATE.
  requires_compatibilities = [
    "FARGATE"
  ]
  #(Required) A list of valid container definitions provided as a single valid JSON document. Please note that you should only provide values that are part of the container definition document. For a detailed description of what parameters are available, see the Task Definition Parameters section from the official Developer Guide.
  container_definitions = <<DEFINITION
[
  {
    "essential": true,
    "image": "${var.repository_url}",
    "name": "${var.aws_ecs_task_definition_name}",
    "logConfiguration": {
            "logDriver": "awslogs",
            "options": {
               "awslogs-group" : "${var.aws_ecs_task_definition_name}",
               "awslogs-region": "${var.aws_region}",
               "awslogs-stream-prefix": "ecs"
            }
     },
     "secrets": [],
     "environment": [],
     "healthCheck": {
       "command": [ "CMD-SHELL", "curl -f http://localhost:3000/ || exit 1" ],
       "interval": 30,
       "retries": 3,
       "timeout": 5
     },
     "portMappings": [
        {
           "containerPort": 3000,
           "hostPort": 3000,
           "protocol": "tcp"
        }
     ]
  }
]
DEFINITION

}

#Provides an ECS service - effectively a task that is expected to run until an error occurs or a user terminates it (typically a webserver or a database).
resource "aws_ecs_service" "ecs_service" {
  count = var.launch_type == "FARGATE" ? 1 : 0

  #(Required) Name of the service (up to 255 letters, numbers, hyphens, and underscores)
  name = "ecs-service-${var.name}"
  #(Optional) ARN of an ECS cluster.
  cluster = aws_ecs_cluster.ecs_cluster.id
  #(Optional) Number of instances of the task definition to place and keep running. Defaults to 0. Do not specify if using the DAEMON scheduling strategy.
  desired_count = 1
  #(Optional) Family and revision (family:revision) or full ARN of the task definition that you want to run in your service. Required unless using the EXTERNAL deployment controller. If a revision is not specified, the latest ACTIVE revision is used.
  task_definition = aws_ecs_task_definition.ecs_task_definition[count.index].arn
  #(Optional) Launch type on which to run your service. The valid values are EC2, FARGATE, and EXTERNAL. Defaults to EC2.
  launch_type = "FARGATE"
  depends_on = [var.lb_listener_front_end]

  #(Optional) Configuration block for deployment controller configuration.
  deployment_controller {
    type = "CODE_DEPLOY"
  }

  #(Optional) Network configuration for the service. This parameter is required for task definitions that use the awsvpc network mode to receive their own Elastic Network Interface, and it is not supported for other network modes.
  network_configuration {
    #(Required) Subnets associated with the task or service.
    subnets = var.subnets
    #(Optional) Security groups associated with the task or service. If you do not specify a security group, the default security group for the VPC is used.
    security_groups = var.security_groups
    #(Optional) Assign a public IP address to the ENI (Fargate launch type only). Valid values are true or false. Default false.
    assign_public_ip = true
  }

  #(Optional) Configuration block for load balancers.
  load_balancer {
    #(Required for ALB/NLB) ARN of the Load Balancer target group to associate with the service.
    target_group_arn = var.lb_target_group_blue_id
    #(Required) Name of the container to associate with the load balancer (as it appears in a container definition).
    container_name = var.aws_ecs_task_definition_name
    #(Required) Port on the container to associate with the load balancer.
    container_port = "3000"
  }

  lifecycle {
    ignore_changes = [
      task_definition,
      load_balancer
    ]
  }
}

#Terraform currently provides a Security Group resource with ingress and egress rules defined in-line and a Security Group Rule resource which manages one or more ingress or egress rules.
resource "aws_security_group" "ecs_security_group" {
  name        = "${var.project_name}-${var.environment}-ecs-sg"
  vpc_id      = var.vpc_id
  description = "ECS security group for ${var.environment}"

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = var.allowed_cidrs
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

#Provides a CloudWatch Log Group resource.
resource "aws_cloudwatch_log_group" "cloudwatch_log" {
  #(Optional, Forces new resource) The name of the log group. If omitted, Terraform will assign a random, unique name.
  name = "log-${var.name}"
}
