module "prod_vpc" {
  source = "../../modules/vpc"
  name = "${var.environment}-${var.project_name}-vpc"
  environment = var.environment
  
  # --- 고가용성을 위한 prod 환경 설정 ---
  vpc_cidr_block = "10.1.0.0/16" # prod 환경용 CIDR
  public_subnets  = ["10.1.1.0/24", "10.1.2.0/24", "10.1.3.0/24"]
  private_subnets = ["10.1.4.0/24", "10.1.5.0/24", "10.1.6.0/24"]
  public_subnets_name = ["prod-saiondo-public-subnet-1", "prod-saiondo-public-subnet-2", "prod-saiondo-public-subnet-3"]
  private_subnets_name = ["prod-saiondo-private-subnet-1", "prod-saiondo-private-subnet-2", "prod-saiondo-private-subnet-3"]
  
  nat_gateway_enabled = true # 고가용성을 위해 NAT Gateway 활성화
}
