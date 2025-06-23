module "prod_ecs" {
  source         = "../../modules/ecs"
  environment    = var.environment
  aws_region     = var.aws_region
  name           = "${var.environment}-${var.project_name}-ecs"
  instance_type  = var.instance_type
  launch_type    = "EC2"
  keypair        = var.key_name

  vpc_id  = module.prod_vpc.vpc_id
  subnets = module.prod_vpc.private_subnets

  cluster_min_size           = 2
  cluster_max_size           = 5
  cluster_desired_capacity   = 2

  aws_ecs_task_definition_name = "${var.environment}-${var.project_name}-ecs-task-def"
  repository_url               = module.prod_ecr.ecr_repository_url

  lb_listener_front_end   = var.alb_enabled ? module.prod_alb.arn : null
  lb_target_group_blue_id = module.prod_lb.target_group_blue_id
}
