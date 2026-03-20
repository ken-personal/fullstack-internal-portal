variable "project" {
  description = "プロジェクト名"
  type        = string
  default     = "internal-portal"
}

variable "environment" {
  description = "環境名"
  type        = string
  default     = "production"
}

variable "aws_region" {
  description = "AWSリージョン"
  type        = string
  default     = "ap-northeast-1"
}

variable "aws_account_id" {
  description = "AWSアカウントID"
  type        = string
}

# =========================================
# ネットワーク
# =========================================
variable "vpc_cidr" {
  description = "VPC CIDRブロック"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "使用するAZ"
  type        = list(string)
  default     = ["ap-northeast-1a", "ap-northeast-1c"]
}

variable "public_subnet_cidrs" {
  type    = list(string)
  default = ["10.0.0.0/24", "10.0.1.0/24"]
}

variable "private_app_subnet_cidrs" {
  type    = list(string)
  default = ["10.0.10.0/24", "10.0.11.0/24"]
}

variable "private_backend_subnet_cidrs" {
  type    = list(string)
  default = ["10.0.20.0/24", "10.0.21.0/24"]
}

variable "private_db_subnet_cidrs" {
  type    = list(string)
  default = ["10.0.30.0/24", "10.0.31.0/24"]
}

# =========================================
# ドメイン
# =========================================
variable "domain_name" {
  description = "ドメイン名（例: example.com）"
  type        = string
}

# =========================================
# データベース
# =========================================
variable "db_name" {
  description = "DBデータベース名"
  type        = string
  default     = "portaldb"
}

variable "db_username" {
  description = "DBユーザー名"
  type        = string
  default     = "postgres"
}

variable "db_password" {
  description = "DBパスワード（terraform.tfvarsで設定）"
  type        = string
  sensitive   = true
}

variable "db_instance_class" {
  description = "RDSインスタンスタイプ"
  type        = string
  default     = "db.t3.micro"
}

# =========================================
# 監視
# =========================================
variable "alert_email" {
  description = "アラート通知先メールアドレス"
  type        = string
}
