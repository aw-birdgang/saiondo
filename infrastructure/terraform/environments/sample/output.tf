output "sample_vpc_id" {
  value = module.sample_vpc.id
}

output "sample_vpc_public_subnets" {
  value = module.sample_vpc.public_subnets
}

output "sample_instance_public_ip" {
  value = module.sample_instance.public_ip
}
