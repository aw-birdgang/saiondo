resource "aws_iam_role" "codebuild" {
  name = "${var.project}-codebuild-role"
  assume_role_policy = data.aws_iam_policy_document.codebuild_assume_role.json
}

data "aws_iam_policy_document" "codebuild_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["codebuild.amazonaws.com"]
    }
  }
}

resource "aws_codebuild_project" "app" {
  name          = "${var.project}-build"
  service_role  = aws_iam_role.codebuild.arn
  artifacts {
    type = "NO_ARTIFACTS"
  }
  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "aws/codebuild/standard:5.0"
    type                        = "LINUX_CONTAINER"
    environment_variable {
      name  = "EC2_HOST"
      value = aws_instance.app.public_ip
    }
  }
  source {
    type            = "GITHUB"
    location        = var.github_repo
    buildspec       = file("${path.module}/buildspec.yml")
  }
}

resource "aws_codepipeline" "app" {
  name     = "${var.project}-pipeline"
  role_arn = aws_iam_role.codebuild.arn
  artifact_store {
    location = aws_s3_bucket.artifact.bucket
    type     = "S3"
  }
  stage {
    name = "Source"
    action {
      name             = "Source"
      category         = "Source"
      owner            = "ThirdParty"
      provider         = "GitHub"
      version          = "1"
      output_artifacts = ["source_output"]
      configuration = {
        Owner  = var.github_owner
        Repo   = var.github_repo_name
        Branch = var.github_branch
        OAuthToken = var.github_token
      }
    }
  }
  stage {
    name = "Build"
    action {
      name             = "Build"
      category         = "Build"
      owner            = "AWS"
      provider         = "CodeBuild"
      input_artifacts  = ["source_output"]
      output_artifacts = []
      configuration = {
        ProjectName = aws_codebuild_project.app.name
      }
    }
  }
}
