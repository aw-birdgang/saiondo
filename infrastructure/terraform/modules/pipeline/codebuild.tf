#variable "env_vars" {
#  default = {
#    DOCKER_FILE_PATH = var.codebuild_docker_file_path
#    IMAGE_TAG = var.codebuild_docker_image_tag
#    CONTAINER_NAME = var.codebuild_container_name
#    S3_BUCKET_NAME = var.s3_bucket_name
#    ENV = var.env
#  }
#}

# code build
resource "aws_codebuild_project" "codebuild_project" {
  #(Required) Project's name.
  name = "${var.name}-codebuild"
  #(Optional) Short description of the project.
  description = "description docker build"
  #(Optional) Number of minutes, from 5 to 480 (8 hours), for AWS CodeBuild to wait until timing out any related build that does not get marked as completed. The default is 60 minutes.
  build_timeout = var.codebuild_timeout
  #(Required) Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) role that enables AWS CodeBuild to interact with dependent AWS services on behalf of the AWS account.
  service_role = aws_iam_role.codebuild-role.arn
  #(Optional) AWS Key Management Service (AWS KMS) customer master key (CMK) to be used for encrypting the build project's build output artifacts.
  encryption_key = aws_kms_alias.kms_alias_artifacts.arn

  #(Required) Configuration block.
  artifacts {
    type = "CODEPIPELINE"
  }

  #(Optional) Configuration block.
  #cache {
  #  #(Optional) Type of storage that will be used for the AWS CodeBuild project cache. Valid values: NO_CACHE, LOCAL, S3. Defaults to NO_CACHE.
  #  type = "S3"
  #  #(Required when cache type is S3) Location where the AWS CodeBuild project stores cached resources. For type S3, the value must be a valid S3 bucket name/prefix.
  #  location = aws_s3_bucket.codebuild-cache.bucket
  #}

  #(Required) Configuration block.
  environment {
    #(Required) Information about the compute resources the build project will use.
    #Valid values: BUILD_GENERAL1_SMALL, BUILD_GENERAL1_MEDIUM, BUILD_GENERAL1_LARGE, BUILD_GENERAL1_2XLARGE. BUILD_GENERAL1_SMALL is only valid if type is set to LINUX_CONTAINER.
    #When type is set to LINUX_GPU_CONTAINER, compute_type must be BUILD_GENERAL1_LARGE.
    compute_type = "BUILD_GENERAL1_SMALL"
    #(Required) Docker image to use for this build project.
    #Valid values include Docker images provided by CodeBuild (e.g aws/codebuild/standard:2.0), Docker Hub images (e.g., hashicorp/terraform:latest), and full Docker repository URIs such as those for ECR (e.g., 137112412989.dkr.ecr.us-west-2.amazonaws.com/amazonlinux:latest).
    image = "aws/codebuild/docker:18.09.0"
    #(Required) Type of build environment to use for related builds. Valid values: LINUX_CONTAINER, LINUX_GPU_CONTAINER, WINDOWS_CONTAINER (deprecated), WINDOWS_SERVER_2019_CONTAINER, ARM_CONTAINER.
    type = "LINUX_CONTAINER"
    privileged_mode = true

#    dynamic "environment_variable" {
#      for_each = var.env_vars
#      content {
#        name  = environment_variable.key
#        value = environment_variable.value
#      }
#    }
    #
    environment_variable {
      #(Required) Environment variable's name or key.
      name  = "DOCKER_FILE_PATH"
      #(Required) Environment variable's value.
      value = var.codebuild_docker_file_path
    }
    #
    environment_variable {
      name  = "IMAGE_TAG"
      value = var.codebuild_docker_image_tag
    }
    #
    environment_variable {
      name  = "CONTAINER_NAME"
      value = var.codebuild_container_name
    }
    #
    environment_variable {
      name  = "S3_BUCKET_NAME"
      value = var.s3_bucket_name
    }
    #
    environment_variable {
      name  = "ENV"
      value = var.environment
    }
    #
    environment_variable {
      name  = "AWS_DEFAULT_REGION"
      value = var.aws_region
    }
    #
    environment_variable {
      name  = "AWS_ACCOUNT_ID"
      value = data.aws_caller_identity.current.account_id
    }
    #
    environment_variable {
      name  = "IMAGE_REPO_NAME"
      value = var.ecr_repository_name
    }
  }

  #(Required) Configuration block.
  source {
    #(Required) Type of repository that contains the source code to be built. Valid values: CODECOMMIT, CODEPIPELINE, GITHUB, GITHUB_ENTERPRISE, BITBUCKET, S3, NO_SOURCE.
    type = "CODEPIPELINE"
    #(Optional) Build specification to use for this build project's related builds. This must be set when type is NO_SOURCE.
    buildspec = "buildspec.yml"
  }

  #depends_on      = [aws_s3_bucket.codebuild-cache]
}

