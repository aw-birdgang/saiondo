module "prod_lb" {
  source      = "../../modules/lb"
  name        = "${var.environment}-${var.project_name}-lb"
  vpc_id      = module.prod_vpc.id
  environment = var.environment

  # 필수 인수 'public_subnets' 추가
  public_subnets = module.prod_vpc.public_subnets
}
