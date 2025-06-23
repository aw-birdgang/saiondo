output "dev_vpc_id" {
  value = module.dev_vpc.id
}

output "dev_vpc_public_subnets" {
  value = module.dev_vpc.public_subnets
}

output "dev_vpc_private_subnets" {
  value = module.dev_vpc.private_subnets
}
#
output "dev_vpc_subnet_ids" {
  value = [module.dev_vpc.private_1_id, module.dev_vpc.private_2_id]
}
