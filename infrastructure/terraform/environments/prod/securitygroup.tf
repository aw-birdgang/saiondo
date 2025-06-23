module "prod_security_group" {
  source      = "../../modules/security-group"
  vpc_id      = module.prod_vpc.id
  environment = var.environment
}
