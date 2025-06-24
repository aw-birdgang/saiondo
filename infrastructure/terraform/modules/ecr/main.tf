resource "aws_ecr_repository" "ecr_repository" {
  name = "ecr-repo-${var.name}"
}
