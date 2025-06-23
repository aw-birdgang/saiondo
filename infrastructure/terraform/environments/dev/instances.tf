module "dev_instances" {
   source = "../../modules/instances"
   environment = var.environment
   name = "${var.environment}-${var.project_name}-instance"
   vpc_id = module.dev_vpc.id
   vpc_security_group_ids = module.dev_security_group.vpc_ec2_security_group_ids
   public_subnets = [module.dev_vpc.public_1_id]
   key_pair_name = var.key_name
   instance_type = var.instance_type
}