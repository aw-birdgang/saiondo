module "dev_rds" {
    environment             = var.environment
    name                    = "${var.environment}-${var.project_name}-rds"
    source                  = "../../modules/rds"
    rds_name                = "${var.environment}-${var.project_name}-rds"
    engine                  = "postgres"
    engine_version          = "14.5"
    port                    = 5432
    instance_class          = "db.t3.micro"
    multi_az                = "false"
    identifier              = var.rds_identifier
    username                = var.rds_username
    password                = var.rds_password
    db_name                 = var.rds_db_name
    storage_type            = "gp2"
    allocated_storage       = 20
    max_allocated_storage   = 100
    subnet_group_name       = "${var.environment}-${var.project_name}-rds-subnet"
    backup_retention_period = 7
    skip_final_snapshot     = true
    publicly_accessible     = true
    storage_encrypted       = true
    aws_region              = var.aws_region
    vpc_id                  = module.dev_vpc.id
    vpc_security_group_ids = module.dev_security_group.vpc_rds_security_group_ids_everyone
    subnet_ids             = [module.dev_vpc.public_1_id, module.dev_vpc.public_2_id, module.dev_vpc.public_3_id]
    availability_zone      = module.dev_vpc.public_1_availability_zone
}