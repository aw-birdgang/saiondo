module "sample_security_group" {
  source      = "../../modules/security-group"
  vpc_id      = module.sample_vpc.id
  environment = var.environment
}
