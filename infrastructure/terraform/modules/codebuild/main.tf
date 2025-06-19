resource "aws_codebuild_project" "main" {
  name          = var.project_name
  service_role  = aws_iam_role.codebuild_role.arn
  artifacts {
    type = "CODEPIPELINE"
  }
  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "aws/codebuild/standard:6.0"
    type                        = "LINUX_CONTAINER"
    privileged_mode             = true
    environment_variable {
      name  = "EC2_HOST"
      value = var.ec2_host
    }
    environment_variable {
      name  = "EC2_USER"
      value = var.ec2_user
    }
    environment_variable {
      name  = "EC2_SSH_KEY"
      value = var.ec2_ssh_key
      type  = "SECRETS_MANAGER"
    }
  }
  source {
    type      = "CODEPIPELINE"
    buildspec = "buildspec.yml"
  }
}
