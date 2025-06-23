#resource "aws_iam_role" "demo-codepipeline" {
#  name = var.iam_role_codepipeline_name
#  assume_role_policy = <<EOF
#{
#  "Version": "2012-10-17",
#  "Statement": [
#    {
#      "Effect": "Allow",
#      "Principal": {
#        "Service": "codepipeline.amazonaws.com"
#      },
#      "Action": "sts:AssumeRole"
#    }
#  ]
#}
#EOF
#
#}

data "aws_iam_policy_document" "assume_role_codepipeline" {
  statement {
    effect = "Allow"
    principals {
      type = "Service"
      identifiers = ["codepipeline.amazonaws.com"]
    }
    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "codepipeline-role" {
  #(Optional, Forces new resource) Friendly name of the role. If omitted, Terraform will assign a random, unique name. See IAM Identifiers for more information.
  name = "${var.name}-codepipeline"
  #(Required) Policy that grants an entity permission to assume the role.
  assume_role_policy = data.aws_iam_policy_document.assume_role_codepipeline.json
}


data "aws_iam_policy_document" "demo-codepipeline-role-policy" {
  statement {
    effect = "Allow"
    actions = [
      "s3:*",
    ]
    resources = [
#      aws_s3_bucket.s3-artifacts.arn,
#      "${aws_s3_bucket.s3-artifacts.arn}/*",
      var.s3_artifacts_arn,
      "${var.s3_artifacts_arn}/*",
    ]
  }
  statement {
    effect = "Allow"
    actions = [
      "codebuild:BatchGetBuilds",
      "codebuild:StartBuild",
    ]
    resources = [
      "*",
    ]
  }
  statement {
    effect = "Allow"
    actions = [
      "sts:AssumeRole",
    ]
    resources = [
      "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/iam-pipeline-${var.name}}",
    ]
  }
  statement {
    effect = "Allow"
    actions = [
      "kms:DescribeKey",
      "kms:GenerateDataKey*",
      "kms:Encrypt",
      "kms:ReEncrypt*",
      "kms:Decrypt",
    ]
    resources = [
      aws_kms_key.kms_key_artifacts.arn,
    ]
  }
#  statement {
#    effect = "Allow"
#    actions = [
#      "codecommit:UploadArchive",
#      "codecommit:Get*",
#      "codecommit:BatchGet*",
#      "codecommit:Describe*",
#      "codecommit:BatchDescribe*",
#      "codecommit:GitPull",
#    ]
#    resources = [
#      aws_codecommit_repository.demo.arn,
#    ]
#  }

  statement {
    effect = "Allow"
    actions = [
      "codestar-connections:UseConnection"
    ]
    resources = [
      "*",
    ]
  }
  statement {
    effect = "Allow"
    actions = [
      "appconfig:StartDeployment",
      "appconfig:GetDeployment",
      "appconfig:StopDeployment"
    ]
    resources = [
      "*",
    ]
  }
  statement {
    effect = "Allow"
    actions = [
      "codecommit:GetRepository"
    ]
    resources = [
      "*",
    ]
  }

  statement {
    effect = "Allow"
    actions = [
      "codedeploy:*",
      "ecs:*",
    ]
    resources = [
      "*",
    ]
  }
  statement {
    effect = "Allow"
    actions = [
      "iam:PassRole"
    ]
    resources = [
      #      aws_iam_role.ecs-task-execution-role.arn,
      #      aws_iam_role.ecs-task-role.arn,
      var.ecs_task_execution_role_arn,
      var.ecs_task_role_arn,
    ]
    condition {
      test     = "StringLike"
      variable = "iam:PassedToService"
      values   = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy" "codepipeline-role-policy" {
  #(Optional) The name of the role policy. If omitted, Terraform will assign a random, unique name.
  name = "${var.name}-codepipeline-policy"
  #(Required) The name of the IAM role to attach to the policy.
  role = aws_iam_role.codepipeline-role.id
  ##(Required) The inline policy document. This is a JSON formatted string. For more information about building IAM policy documents with Terraform, see the AWS IAM Policy Document Guide
  policy = data.aws_iam_policy_document.demo-codepipeline-role-policy.json
}
