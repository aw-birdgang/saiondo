module "prod_alb" {
  source      = "../../modules/alb"
  name        = "${var.environment}-${var.project_name}-alb"
  environment = var.environment
  vpc_id      = module.prod_vpc.id
  subnet_ids  = module.prod_vpc.public_subnets
  security_groups = [module.prod_security_group.alb_sg_id]
  log_bucket = aws_s3_bucket.alb_logs.id
}