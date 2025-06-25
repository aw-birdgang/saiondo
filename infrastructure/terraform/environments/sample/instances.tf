module "sample_instance" {
   source = "../../modules/instances"
   environment = var.environment
   name = "${var.environment}-${var.project_name}-instance"
   vpc_id = module.sample_vpc.id
   vpc_security_group_ids = module.sample_security_group.allow_backend_sg_ids
   public_subnets = [module.sample_vpc.public_1_id]
   key_pair_name = "${var.key_name}-${var.environment}"
   ami_id        = var.ami_id
   instance_type = var.instance_type
}
