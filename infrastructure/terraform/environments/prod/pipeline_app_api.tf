module "prod_codepipeline_app_api" {
   source = "../../modules/pipeline"
   environment = var.environment
   name = "${var.environment}-${var.project_name}-pip"
   aws_region = var.aws_region
   vpc_id = module.prod_vpc.id
   public_subnets = module.prod_vpc.public_subnets
   private_subnets = module.prod_vpc.private_subnets
   repository_in = var.repository_in
   codestar_connection_arn = module.prod_codestar_connection.codestar_arn
   branch = var.environment
   codebuild_timeout = "30"
   codebuild_docker_file_path = var.codebuild_docker_file_path
   codebuild_docker_image_tag = "latest"
   codebuild_container_name = var.codebuild_container_name
   s3_bucket_name = "${var.environment}-${var.project_name}=bucket"
   aws_ecs_task_definition_name = "${var.environment}-${var.project_name}-ecs-task-def"
   ecr_repository_name = module.prod_ecr.ecr_repository_name
   ecr_repository_url = module.prod_ecr.ecr_repository_url

   ecs_cluster_name = module.prod_ecs.ecs_cluster_name
   ecs_service_name = module.prod_ecs.service_name
   ecs_task_execution_role_arn = module.prod_ecs.ecs_task_execution_role_arn
   ecs_task_role_arn = module.prod_ecs.ecs_task_role_arn

   front_end_arn = module.prod_lb.front_end_arn
   target_group_blue_name = module.prod_lb.target_group_blue_name
   target_group_green_name = module.prod_lb.target_group_green_name

   s3_artifacts_bucket = module.prod_s3.s3_artifacts_bucket
   s3_artifacts_arn = module.prod_s3.s3_artifacts_arn
   codebuild_cache_arn = module.prod_s3.codebuild_cache_arn
}
