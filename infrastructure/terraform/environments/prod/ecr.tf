module "prod_ecr" {
  source      = "../../modules/ecr"
  name        = "${var.environment}-${var.project_name}-ecr"
  environment = var.environment
}
