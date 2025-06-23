resource "aws_ecr_repository" "ecr_repository" {
  #(Required) Name of the repository.
  name = "ecr-repo-${var.name}"
}
