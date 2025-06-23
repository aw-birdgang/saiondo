data "aws_iam_policy_document" "assume_role_codebuild" {
  #(Optional) - Configuration block for a policy statement.
  statement {
    #(Optional) - Whether this statement allows or denies the given actions. Valid values are Allow and Deny. Defaults to Allow.
    effect = "Allow"
    #(Optional) - Configuration block for principals.
    principals {
      #(Required) Type of principal. Valid values include AWS, Service, Federated, CanonicalUser and *.
      type = "Service"
      #(Required) List of identifiers for principals. When type is AWS, these are IAM principal ARNs, e.g., arn:aws:iam::12345678901:role/yak-role. When type is Service, these are AWS Service roles, e.g., lambda.amazonaws.com. When type is Federated, these are web identity users or SAML provider ARNs, e.g., accounts.google.com or arn:aws:iam::12345678901:saml-provider/yak-saml-provider. When type is CanonicalUser, these are canonical user IDs, e.g., 79a59df900b949e55d96a1e698fbacedfd6e09d98eacf8f8d5218e7cd47ef2be.
      identifiers = ["codebuild.amazonaws.com"]
    }
    #(Optional) - List of actions that this statement either allows or denies. For example, ["ec2:RunInstances", "s3:*"].
    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "codebuild-role" {
  #(Optional, Forces new resource) Friendly name of the role. If omitted, Terraform will assign a random, unique name. See IAM Identifiers for more information.
  name = "${var.name}-codebuild"
  #(Required) Policy that grants an entity permission to assume the role.
  assume_role_policy = data.aws_iam_policy_document.assume_role_codebuild.json
}

data "aws_iam_policy_document" "codebuild-policy-document" {
  #
  statement {
    effect = "Allow"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    resources = ["*"]
  }

  #
  statement {
    sid = "CodeCommitPolicy"
    effect = "Allow"
    actions = [
      "codecommit:GitPull"
    ]
    resources = ["*"]
  }

  #
  statement {
    effect = "Allow"
    actions = [
      "ec2:CreateNetworkInterface",
      "ec2:DescribeDhcpOptions",
      "ec2:DescribeNetworkInterfaces",
      "ec2:DeleteNetworkInterface",
      "ec2:DescribeSubnets",
      "ec2:DescribeSecurityGroups",
      "ec2:DescribeVpcs",
    ]
    resources = ["*"]
  }

  #
  statement {
    effect    = "Allow"
    actions   = ["ec2:CreateNetworkInterfacePermission"]
    resources = ["arn:aws:ec2:us-east-1:123456789012:network-interface/*"]
#    condition {
#      test     = "StringEquals"
#      variable = "ec2:Subnet"
#      values = [
#        var.public_subnets[0].arn,
#        var.public_subnets[1].arn,
#      ]
#    }
    condition {
      test     = "StringEquals"
      variable = "ec2:AuthorizedService"
      values   = ["codebuild.amazonaws.com"]
    }
  }

  #
  statement {
    effect  = "Allow"
    actions = ["s3:*"]
    resources = [
      var.codebuild_cache_arn,
      "${var.codebuild_cache_arn}/*",
#      aws_s3_bucket.codebuild-cache.arn,
#      "${aws_s3_bucket.codebuild-cache.arn}/*",
    ]
  }
  #
  statement {
    effect = "Allow"
    actions = [
      "s3:List*",
      "s3:Put*",
      "s3:Get*"
    ]
    resources = [
#      aws_s3_bucket.s3-artifacts.arn,
#      "${aws_s3_bucket.s3-artifacts.arn}/*"
      var.s3_artifacts_arn,
      "${var.s3_artifacts_arn}/*"
    ]
  }

  #
  statement {
    sid = "ECRPushPolicy"
    effect = "Allow"
    actions = [
      "ecr:BatchCheckLayerAvailability",
      "ecr:GetDownloadUrlForLayer",
      "ecr:GetRepositoryPolicy",
      "ecr:DescribeRepositories",
      "ecr:ListImages",
      "ecr:DescribeImages",
      "ecr:BatchGetImage",
      "ecr:InitiateLayerUpload",
      "ecr:UploadLayerPart",
      "ecr:CompleteLayerUpload",
      "ecr:PutImage"
    ]
    resources = ["*"]
  }

  #
  statement {
    sid = "ECRAuthPolicy"
    effect = "Allow"
    actions = [
      "ecr:GetAuthorizationToken"
    ]
    resources = ["*"]
  }

  #
  statement {
    sid = "ECS"
    effect = "Allow"
    actions = [
      "ecs:List*",
      "ecs:Describe*"
    ]
    resources = ["*"]
  }

  #
  statement {
    effect = "Allow"
    actions = [
      "kms:DescribeKey",
      "kms:GenerateDataKey*",
      "kms:Encrypt",
      "kms:ReEncrypt*",
      "kms:Decrypt"
    ]
    resources = [
      aws_kms_key.kms_key_artifacts.arn
    ]
  }
}


resource "aws_iam_role_policy" "role-policy" {
  #(Optional) The name of the role policy. If omitted, Terraform will assign a random, unique name.
  name = "${var.name}-codebuild-policy"
  #(Required) The name of the IAM role to attach to the policy.
  role = aws_iam_role.codebuild-role.id
  #(Required) The inline policy document. This is a JSON formatted string. For more information about building IAM policy documents with Terraform, see the AWS IAM Policy Document Guide
  policy = data.aws_iam_policy_document.codebuild-policy-document.json
}
