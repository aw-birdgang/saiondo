terraform {
  backend "s3" {
    bucket         = "saiondo-terraform-state-bucket"
    key            = "dev/terraform.tfstate"
    region         = "ap-northeast-2"
    dynamodb_table = "terraform-lock"
    encrypt        = true
  }
}
