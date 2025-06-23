data "aws_iam_policy_document" "assume_role_codedeploy" {
  statement {
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["codedeploy.amazonaws.com"]
    }
    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "codedeploy-role" {
  #(Optional, Forces new resource) Friendly name of the role. If omitted, Terraform will assign a random, unique name. See IAM Identifiers for more information.
  name = "${var.name}-codedeploy"
  #(Required) Policy that grants an entity permission to assume the role.
  assume_role_policy = data.aws_iam_policy_document.assume_role_codedeploy.json
}

data "aws_iam_policy_document" "permission_role_codedeploy" {
  statement {
    effect = "Allow"
    actions = [
      "ecs:DescribeServices",
      "ecs:CreateTaskSet",
      "ecs:UpdateServicePrimaryTaskSet",
      "ecs:DeleteTaskSet",
      "elasticloadbalancing:DescribeTargetGroups",
      "elasticloadbalancing:DescribeListeners",
      "elasticloadbalancing:ModifyListener",
      "elasticloadbalancing:DescribeRules",
      "elasticloadbalancing:ModifyRule",
      "lambda:InvokeFunction",
      "cloudwatch:DescribeAlarms",
      "sns:Publish",
      "s3:GetObject",
      "s3:GetObjectVersion"
    ]
    resources = [
      "*",
    ]
  }
  statement {
    effect = "Allow"
    actions = [
      "s3:Get*",
    ]
    resources = [
#      "${aws_s3_bucket.s3-artifacts.arn}/*",
      "${var.s3_artifacts_arn}/*",
    ]
  }
  statement {
    effect = "Allow"
    actions = [
      "kms:DescribeKey",
      "kms:Decrypt",
    ]
    resources = [
      aws_kms_key.kms_key_artifacts.arn
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

resource "aws_iam_role_policy" "codedeploy-role-policy" {
  #(Optional) The name of the role policy. If omitted, Terraform will assign a random, unique name.
  name = "${var.name}-codedeploy-policy"
  #(Required) The name of the IAM role to attach to the policy.
  role   = aws_iam_role.codedeploy-role.id
  ##(Required) The inline policy document. This is a JSON formatted string. For more information about building IAM policy documents with Terraform, see the AWS IAM Policy Document Guide
  policy = data.aws_iam_policy_document.permission_role_codedeploy.json
}


