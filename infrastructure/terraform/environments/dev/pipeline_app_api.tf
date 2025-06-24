module "dev_codepipeline_app_api" {
   source = "../../modules/pipeline"
   environment = var.environment
   name = "${var.environment}-${var.project_name}-pip"
   aws_region = var.aws_region
   vpc_id = module.dev_vpc.id
   public_subnets = module.dev_vpc.public_subnets
   private_subnets = module.dev_vpc.private_subnets
   repository_in = var.repository_in
   codestar_connection_arn = module.dev_codestar_connection.codestar_arn
   branch = var.environment
   codebuild_timeout = "30"
   codebuild_docker_file_path = var.codebuild_docker_file_path
   codebuild_docker_image_tag = "latest"
   codebuild_container_name = var.codebuild_container_name
   s3_bucket_name = "${var.environment}-${var.project_name}=bucket"
   aws_ecs_task_definition_name = "${var.environment}-${var.project_name}-ecs-task-def"
   ecr_repository_name = module.dev_ecr.ecr_repository_name
   ecr_repository_url = module.dev_ecr.ecr_repository_url

   ecs_cluster_name = module.dev_ecs.ecs_cluster_name
   ecs_service_name = module.dev_ecs.service_name
   ecs_task_execution_role_arn = module.dev_ecs.ecs_task_execution_role_arn
   ecs_task_role_arn = module.dev_ecs.ecs_task_role_arn

   s3_artifacts_bucket = module.dev_s3.s3_artifacts_bucket
   s3_artifacts_arn = module.dev_s3.s3_artifacts_arn
   codebuild_cache_arn = module.dev_s3.codebuild_cache_arn
}
