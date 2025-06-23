output "prod_vpc_id" {
  value = module.prod_vpc.id
}

output "prod_vpc_public_subnets" {
  value = module.prod_vpc.public_subnets
}

output "prod_vpc_private_subnets" {
  value = module.prod_vpc.private_subnets
}
#
output "prod_vpc_subnet_ids" {
  value = [module.prod_vpc.private_1_id, module.prod_vpc.private_2_id]
}
