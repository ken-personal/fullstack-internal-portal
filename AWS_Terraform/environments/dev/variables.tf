variable "project" {
  type    = string
  default = "internal-portal"
}

variable "environment" {
  type    = string
  default = "dev"
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
  default = "10.1.0.0/16"
}

variable "availability_zones" {
  type    = list(string)
  default = ["ap-northeast-1a"]
}

variable "public_subnet_cidrs" {
  type    = list(string)
  default = ["10.1.0.0/24"]
}

variable "private_app_subnet_cidrs" {
  type    = list(string)
  default = ["10.1.10.0/24"]
}

variable "private_backend_subnet_cidrs" {
  type    = list(string)
  default = ["10.1.20.0/24"]
}

variable "private_db_subnet_cidrs" {
  type    = list(string)
  default = ["10.1.30.0/24"]
}

variable "domain_name" {
  type = string
}

variable "db_name" {
  type    = string
  default = "portaldb_dev"
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
  default = "db.t3.micro"
}

variable "alert_email" {
  type = string
}
