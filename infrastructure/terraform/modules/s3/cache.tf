#
# cache s3 bucket
#
resource "aws_s3_bucket" "codebuild_cache" {
  #(Optional, Forces new resource) Name of the bucket. If omitted, Terraform will assign a random, unique name. Must be lowercase and less than or equal to 63 characters in length. A full list of bucket naming rules may be found here.
  bucket = "codebuild-cache-${random_string.random.result}"

  tags = {
    Name = "codebuild-cache"
    TerraformManaged = "true"
  }
}

resource "aws_s3_bucket" "s3_artifacts" {
  bucket = "demo-artifacts-${random_string.random.result}"
}

#An S3 Lifecycle configuration consists of one or more Lifecycle rules.
resource "aws_s3_bucket_lifecycle_configuration" "artifacts_lifecycle" {
  #(Required) Name of the source S3 bucket you want Amazon S3 to monitor.
  bucket = aws_s3_bucket.s3_artifacts.id
  #(Required) List of configuration blocks describing the rules managing the replication.
  rule {
    #(Required) Unique identifier for the rule. The value cannot be longer than 255 characters.
    id = "clean-up"
    #(Required) Whether the rule is currently being applied. Valid values: Enabled or Disabled.
    status = "Enabled"
    #(Optional) Configuration block that specifies the expiration for the lifecycle of the object in the form of date, days and, whether the object has a delete marker.
    expiration {
      #(Optional) Lifetime, in days, of the objects that are subject to the rule. The value must be a non-zero positive integer.
      days = 30
    }
    filter {}
  }
}


resource "random_string" "random" {
  length  = 8
  special = false
  upper   = false
}
