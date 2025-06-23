resource "aws_lb" "this" {
  count = var.enabled ? 1 : 0
  name     = var.name
  internal = false

  security_groups = var.security_groups
  subnets         = var.subnet_ids

  enable_deletion_protection = false

  access_logs {
    bucket = var.log_bucket
    prefix = "alb"
  }

  tags = {
    Name             = "${var.environment}-${var.name}-alb"
    Service          = var.name
    Environment      = var.environment
    TerraformManaged = "true"
  }
}

resource "aws_lb_target_group" "main" {
  count = var.enabled ? 1 : 0

  name     = "${var.name}-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = var.vpc_id

  health_check {
    path                = "/"
    protocol            = "HTTP"
    matcher             = "200"
    interval            = 15
    timeout             = 3
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }

  tags = {
    Name        = "${var.environment}-${var.name}-tg"
    Environment = var.environment
  }
}

resource "aws_lb_listener" "http" {
  count = var.enabled ? 1 : 0

  load_balancer_arn = aws_lb.this[0].arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.main[0].arn
  }
}

