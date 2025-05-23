resource "aws_s3_bucket" "artifact" {
  bucket = "${var.project}-artifact-bucket"
  force_destroy = true
}
