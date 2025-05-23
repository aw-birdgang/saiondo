resource "aws_s3_bucket" "sample" {
  bucket = var.s3_bucket_name
}

resource "aws_dynamodb_table" "sample" {
  name           = var.dynamodb_table_name
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }
}