resource "aws_ecs_cluster" "ecs_cluster" {
  #(Required) Name of the cluster (up to 255 letters, numbers, hyphens, and underscores)
  name = "ecs-cluster-${var.name}"
}
