module "prod_instances" {
   source = "../../modules/instances"
   environment = var.environment
   name = "${var.environment}-${var.project_name}-instance"
   vpc_id = module.prod_vpc.id
   vpc_security_group_ids = module.prod_security_group.vpc_ec2_security_group_ids
   public_subnets = [module.prod_vpc.public_1_id]
   key_pair_name = "${var.key_name}-${var.environment}"
   instance_type = var.instance_type
   ami_id = ""
}
