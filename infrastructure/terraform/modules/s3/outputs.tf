output "s3_artifacts_bucket" {
  description = "s3 artifacts bucket"
  value = aws_s3_bucket.s3_artifacts.bucket
}

output "s3_artifacts_arn" {
  description = "s3 artifacts arn"
  value = aws_s3_bucket.s3_artifacts.arn
}

output "codebuild_cache_arn" {
  description = "codebuild cache arn"
  value = aws_s3_bucket.codebuild_cache.arn
}
