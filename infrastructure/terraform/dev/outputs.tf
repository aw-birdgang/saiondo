output "ec2_public_ip" {
  value = aws_instance.app.public_ip
}
output "artifact_bucket" {
  value = aws_s3_bucket.artifact.bucket
}
