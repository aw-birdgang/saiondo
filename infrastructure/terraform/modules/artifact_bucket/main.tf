resource "aws_s3_bucket" "artifact" {
  bucket = "saiondo-artifact-bucket"
  force_destroy = true
}
