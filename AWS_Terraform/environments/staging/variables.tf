variable "project" {
  type    = string
  default = "internal-portal"
}

variable "environment" {
  type    = string
  default = "staging"
}

variable "aws_region" {
  type    = string
  default = "ap-northeast-1"
}

variable "aws_account_id" {
  type = string
}

variable "vpc_cidr" {
  type    = string
  default = "10.2.0.0/16"
}

variable "availability_zones" {
  type    = list(string)
  default = ["ap-northeast-1a", "ap-northeast-1c"]
}

variable "public_subnet_cidrs" {
  type    = list(string)
  default = ["10.2.0.0/24", "10.2.1.0/24"]
}

variable "private_app_subnet_cidrs" {
  type    = list(string)
  default = ["10.2.10.0/24", "10.2.11.0/24"]
}

variable "private_backend_subnet_cidrs" {
  type    = list(string)
  default = ["10.2.20.0/24", "10.2.21.0/24"]
}

variable "private_db_subnet_cidrs" {
  type    = list(string)
  default = ["10.2.30.0/24", "10.2.31.0/24"]
}

variable "domain_name" {
  type = string
}

variable "db_name" {
  type    = string
  default = "portaldb_staging"
}

variable "db_username" {
  type    = string
  default = "postgres"
}

variable "db_password" {
  type      = string
  sensitive = true
}

variable "db_instance_class" {
  type    = string
  default = "db.t3.small"
}

variable "alert_email" {
  type = string
}
