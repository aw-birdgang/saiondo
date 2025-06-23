module "dev_vpc" {
  source = "../../modules/vpc"
  name = "${var.environment}-${var.project_name}-vpc"
  environment = var.environment
  vpc_cidr_block = "10.0.0.0/16"
  public_subnets  = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  private_subnets = ["10.0.4.0/24", "10.0.5.0/24", "10.0.6.0/24"]
  public_subnets_name = ["dev-saiondo-public-subnet-1", "dev-saiondo-public-subnet-2", "dev-saiondo-public-subnet-3"]
  private_subnets_name = ["dev-saiondo-private-subnet-1", "dev-saiondo-private-subnet-2", "dev-saiondo-private-subnet-3"]
  nat_gateway_enabled = false
}
