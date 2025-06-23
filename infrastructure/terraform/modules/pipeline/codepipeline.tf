data "aws_availability_zones" "available" {
}

data "aws_caller_identity" "current" {
}

resource "aws_codepipeline" "codepipeline" {
  #(Required) The name of the pipeline.
  name = var.name
  #(Required) A service role Amazon Resource Name (ARN) that grants AWS CodePipeline permission to make calls to AWS services on your behalf.
  role_arn = aws_iam_role.codepipeline-role.arn

  #(Required) One or more artifact_store blocks. Artifact stores are documented below.
  artifact_store {
    #(Required) The location where AWS CodePipeline stores artifacts for a pipeline; currently only S3 is supported.
#    location = aws_s3_bucket.s3-artifacts.bucket
    location = var.s3_artifacts_bucket
    #(Required) The type of the artifact store, such as Amazon S3
    type = "S3"

    #(Optional) The encryption key block AWS CodePipeline uses to encrypt the data in the artifact store, such as an AWS Key Management Service (AWS KMS) key. If you don't specify a key, AWS CodePipeline uses the default key for Amazon Simple Storage Service (Amazon S3).
    encryption_key {
      #(Required) The KMS key ARN or ID
      id   = aws_kms_alias.kms_alias_artifacts.arn
      #(Required) The type of key; currently only KMS is supported
      type = "KMS"
    }
  }

  #(Minimum of at least two stage blocks is required) A stage block.
  stage {
    #(Required) The name of the stage.
    name = "Source"
    #(Required) The action(s) to include in the stage.
    action {
      #(Required) The action declaration's name.
      name = "Source"
      #(Required) A category defines what kind of action can be taken in the stage, and constrains the provider type for the action. Possible values are Approval, Build, Deploy, Invoke, Source and Test.
      category = "Source"
      #(Required) The creator of the action being called. Possible values are AWS, Custom and ThirdParty.
      owner = "AWS"
      #(Required) The provider of the service being called by the action. Valid providers are determined by the action category. Provider names are listed in the Action Structure Reference documentation.
      provider = "CodeStarSourceConnection"
      #(Required) A string that identifies the action type.
      version = "1"
      #(Optional) A list of artifact names to output. Output artifact names must be unique within a pipeline.
      output_artifacts = ["${var.name}-docker-source"]

      #(Optional) A map of the action declaration's configuration. Configurations options for action types and providers can be found in the Pipeline Structure Reference and Action Structure Reference documentation.
      configuration = {
        ConnectionArn    = var.codestar_connection_arn
        FullRepositoryId = var.repository_in
        BranchName       = var.branch
      }
    }
  }

  stage {
    name = "Build"

    action {
      name = "Build"
      category = "Build"
      owner = "AWS"
      provider = "CodeBuild"
      #(Optional) A list of artifact names to be worked on.
      input_artifacts = ["${var.name}-docker-source"]
      output_artifacts = ["${var.name}-docker-build"]
      version = "1"

      configuration = {
        ProjectName = aws_codebuild_project.codebuild_project.name
      }
    }
  }

  stage {
    name = "Deploy"

    action {
      name = "DeployToECS"
      category = "Deploy"
      owner = "AWS"
      provider = "CodeDeployToECS"
      input_artifacts = ["${var.name}-docker-build"]
      version = "1"

      configuration = {
        ApplicationName = aws_codedeploy_app.codedeploy_app.name
        DeploymentGroupName = aws_codedeploy_deployment_group.codedeploy_deployment_group.deployment_group_name
        TaskDefinitionTemplateArtifact = "${var.name}-docker-build"
        AppSpecTemplateArtifact = "${var.name}-docker-build"
      }
    }
  }
}


