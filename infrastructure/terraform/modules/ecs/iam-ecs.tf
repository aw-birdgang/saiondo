data "aws_iam_policy_document" "assume_role" {
  #(Optional) - Configuration block for a policy statement.
  statement {
    #(Optional) - Whether this statement allows or denies the given actions. Valid values are Allow and Deny. Defaults to Allow.
    effect = "Allow"
    #(Optional) - Configuration block for principals.
    principals {
      #(Required) Type of principal. Valid values include AWS, Service, Federated, CanonicalUser and *.
      type = "Service"
      #(Required) List of identifiers for principals. When type is AWS, these are IAM principal ARNs, e.g., arn:aws:iam::12345678901:role/yak-role. When type is Service, these are AWS Service roles, e.g., lambda.amazonaws.com. When type is Federated, these are web identity users or SAML provider ARNs, e.g., accounts.google.com or arn:aws:iam::12345678901:saml-provider/yak-saml-provider. When type is CanonicalUser, these are canonical user IDs, e.g., 79a59df900b949e55d96a1e698fbacedfd6e09d98eacf8f8d5218e7cd47ef2be.
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
    #(Optional) - List of actions that this statement either allows or denies. For example, ["ec2:RunInstances", "s3:*"].
    actions = ["sts:AssumeRole"]
  }
}


resource "aws_iam_role" "ecs_task_execution_role" {
  #(Optional, Forces new resource) Friendly name of the role. If omitted, Terraform will assign a random, unique name. See IAM Identifiers for more information.
  name = "${var.environment}-ecs-task-execution-role"
  #(Required) Policy that grants an entity permission to assume the role.
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}


resource "aws_iam_role_policy" "ecs_task_execution_role_policy" {
  name = "${var.environment}-ecs-task-execution-role"
  role = aws_iam_role.ecs_task_execution_role.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "ssm:GetParameters",
        "ssm:GetParameter"
      ],
      "Resource": "*"
    }
  ]
}
EOF

}


resource "aws_iam_role" "ecs_task_role" {
  #(Optional, Forces new resource) Friendly name of the role. If omitted, Terraform will assign a random, unique name. See IAM Identifiers for more information.
  name = "${var.environment}-ecs-task-role"
  #(Required) Policy that grants an entity permission to assume the role.
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}
