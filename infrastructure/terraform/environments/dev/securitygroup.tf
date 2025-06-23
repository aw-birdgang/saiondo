module "dev_security_group" {
  source      = "../../modules/security-group"
  vpc_id      = module.dev_vpc.id
  environment = var.environment
}
