module "network" {
  source              = "../../modules/network"
  vpc_cidr_block      = var.vpc_cidr_block
  public_subnet_cidr  = var.public_subnet_cidr
  availability_zone   = var.availability_zone
}

module "ec2" {
  source             = "../../modules/ec2"
  instance_type      = var.instance_type
  subnet_id          = module.network.public_subnet_id
  key_name           = var.key_name
}

module "codebuild" {
  source           = "../../modules/codebuild"
  project_name     = "saiondo-build"
  artifact_bucket  = module.artifact_bucket.bucket
  ec2_instance_id  = module.ec2.instance_id
  ec2_ssh_key      = "arn:aws:secretsmanager:ap-northeast-2:123456789012:secret:saiondo-ec2-key"
  ec2_user         = "ec2-user"
  ec2_host         = module.ec2.public_ip
}

module "codepipeline" {
  source                 = "../../modules/codepipeline"
  github_owner           = var.github_owner
  github_repo            = var.github_repo
  github_oauth_token     = var.github_oauth_token
  codebuild_project_name = module.codebuild.project_name
  artifact_bucket        = module.artifact_bucket.bucket
}

module "artifact_bucket" {
  source = "../../modules/artifact_bucket"
}
