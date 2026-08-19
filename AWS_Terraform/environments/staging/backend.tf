terraform {
  backend "s3" {
    bucket         = "internal-portal-tfstate"
    key            = "staging/terraform.tfstate"
    region         = "ap-northeast-1"
    encrypt        = true
    dynamodb_table = "internal-portal-tfstate-lock"
  }
}
