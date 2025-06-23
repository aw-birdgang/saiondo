module "dev_s3" {
  source      = "../../modules/s3"
  environment = var.environment
  name        = "${var.environment}-${var.project_name}-s3"
}

# resource "aws_s3_bucket" "alb_logs" { ... }
