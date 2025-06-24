module "dev_ecs" {
  source         = "../../modules/ecs"
  environment    = var.environment
  aws_region     = var.aws_region
  project_name   = var.project_name
  name           = "${var.environment}-${var.project_name}-ecs"
  instance_type  = var.instance_type
  launch_type    = "EC2"
  keypair        = "${var.key_name}-${var.environment}"
  ami_id           = var.ami_id
  security_group_id = module.dev_security_group.vpc_ec2_security_group_ids[0]
  key_name         = "${var.key_name}-${var.environment}"

  vpc_id  = module.dev_vpc.vpc_id
  subnets = module.dev_vpc.public_subnets

  cluster_min_size           = 1
  cluster_max_size           = 1
  cluster_desired_capacity   = 1

  aws_ecs_task_definition_name = "${var.environment}-${var.project_name}-ecs-task-def"
  repository_url               = module.dev_ecr.ecr_repository_url
}
