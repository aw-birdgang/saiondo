#Use this data source to get the ARN of a KMS key alias. By using this data source, you can reference key alias without having to hard code the ARN as input.
data "aws_iam_policy_document" "artifacts_kms_policy" {
  policy_id = "key-default-1"
  statement {
    sid    = "Enable IAM User Permissions"
    effect = "Allow"
    principals {
      type        = "AWS"
      identifiers = ["arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"]
    }
    actions = [
      "kms:*",
    ]
    resources = [
      "*",
    ]
  }
}

#KMS Key Policy can be configured in either the standalone resource aws_kms_key_policy or with the parameter policy in this resource. Configuring with both will cause inconsistencies and may overwrite configuration.
resource "aws_kms_key" "kms_key_artifacts" {
  #(Optional) The description of the key as viewed in AWS console.
  description = "kms key for artifacts"
  #(Optional) A valid policy JSON document. Although this is a key policy, not an IAM policy, an aws_iam_policy_document, in the form that designates a principal, can be used. For more information about building policy documents with Terraform, see the AWS IAM Policy Document Guide.
  policy = data.aws_iam_policy_document.artifacts_kms_policy.json
}

#Provides an alias for a KMS customer master key. AWS Console enforces 1-to-1 mapping between aliases & keys, but API (hence Terraform too) allows you to create as many aliases as the account limits allow you.
resource "aws_kms_alias" "kms_alias_artifacts" {
  #(Optional) The display name of the alias. The name must start with the word "alias" followed by a forward slash (alias/)
  name = "alias/artifacts"
  #(Required) Identifier for the key for which the alias is for, can be either an ARN or key_id.
  target_key_id = aws_kms_key.kms_key_artifacts.key_id
}


