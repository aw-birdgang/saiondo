module "dev_ecs" {
  source         = "../../modules/ecs"
  environment    = var.environment
  aws_region     = var.aws_region
  name           = "${var.environment}-${var.project_name}-ecs"
  instance_type  = var.instance_type
  launch_type    = "EC2"
  keypair        = var.key_name

  vpc_id  = module.dev_vpc.vpc_id
  subnets = module.dev_vpc.public_subnets

  cluster_min_size           = 1
  cluster_max_size           = 1
  cluster_desired_capacity   = 1

  aws_ecs_task_definition_name = "${var.environment}-${var.project_name}-ecs-task-def"
  repository_url               = module.dev_ecr.ecr_repository_url

  lb_listener_front_end   = var.alb_enabled ? module.dev_alb.arn : null
  lb_target_group_blue_id = module.dev_lb.target_group_blue_id
}
