############################## BASE ####################

variable "environment" {
  description = "environment"
}

variable "name" {
  description = "name"
}


############################## CODE PIPELINE ####################

variable "s3_artifacts_bucket" {
  description = "s3 artifacts bucket"
}

variable "s3_artifacts_arn" {
  description = "s3 artifacts arn"
}

variable "codebuild_cache_arn" {
  description = "codebuild cache arn"
}




############################## CODEBUILD ####################


variable "codebuild_timeout" {
  description = "codebuild timeout"
}

variable "codebuild_docker_file_path" {
  description = "docker file path"
}

variable "codebuild_docker_image_tag" {
  description = "docker image tag"
}

variable "codebuild_container_name" {
  description = "container name"
}

variable "s3_bucket_name" {
  description = "s3 bucket name"
}

variable "aws_region" {
}

variable "public_subnets" {
  type = list
}

variable "private_subnets" {
  type = list
}

variable "vpc_id" {
}

variable "repository_in" {
}

variable "codestar_connection_arn" {
}

variable "branch" {
}

variable "aws_ecs_task_definition_name" {
  description = "aws ecs task definition name"
}



################ DEPLOY #####
variable "ecs_cluster_name" {
  description = "ecs cluster name"
}

variable "ecs_service_name" {
  description = "ecs service name"
}

variable "front_end_arn" {
  description = "front end arn"
}

variable "target_group_blue_name" {
  description = "target group blue name"
}

variable "target_group_green_name" {
  description = "target group green name"
}


################ ECR #####
variable "ecr_repository_name" {
  description = "repo name"
}

variable "ecr_repository_url" {
  description = "repo url"
}


################ IAM CODE DEPLOY #####
variable "ecs_task_execution_role_arn" {
  description = "ecs task execution role arn"
}

variable "ecs_task_role_arn" {
  description = "ecs task role arn"
}
