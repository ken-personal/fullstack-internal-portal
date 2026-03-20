terraform {
  required_version = ">= 1.6.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = local.common_tags
  }
}

locals {
  common_tags = {
    Project     = var.project
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# =========================================
# Security Group（VPCより先に作成し、VPCに渡す）
# =========================================
module "security_group" {
  source = "./modules/security_group"

  project     = var.project
  vpc_id      = module.vpc.vpc_id
  vpc_cidr    = var.vpc_cidr
  common_tags = local.common_tags
}

# =========================================
# VPC（Security GroupのIDを受け取る）
# =========================================
module "vpc" {
  source = "./modules/vpc"

  project                      = var.project
  aws_region                   = var.aws_region
  vpc_cidr                     = var.vpc_cidr
  availability_zones           = var.availability_zones
  public_subnet_cidrs          = var.public_subnet_cidrs
  private_app_subnet_cidrs     = var.private_app_subnet_cidrs
  private_backend_subnet_cidrs = var.private_backend_subnet_cidrs
  private_db_subnet_cidrs      = var.private_db_subnet_cidrs
  vpce_security_group_id       = module.security_group.vpce_sg_id
  common_tags                  = local.common_tags
}

# =========================================
# IAM
# =========================================
module "iam" {
  source = "./modules/iam"

  project     = var.project
  common_tags = local.common_tags
}

# =========================================
# ECR
# =========================================
module "ecr" {
  source = "./modules/ecr"

  project     = var.project
  common_tags = local.common_tags
}

# =========================================
# ACM
# =========================================
module "acm" {
  source = "./modules/acm"

  project         = var.project
  domain_name     = var.domain_name
  route53_zone_id = module.route53.zone_id
  common_tags     = local.common_tags
}

# =========================================
# Route53
# =========================================
module "route53" {
  source = "./modules/route53"

  project      = var.project
  domain_name  = var.domain_name
  alb_dns_name = module.alb.alb_dns_name
  alb_zone_id  = module.alb.alb_zone_id
  common_tags  = local.common_tags
}

# =========================================
# ALB
# =========================================
module "alb" {
  source = "./modules/alb"

  project           = var.project
  vpc_id            = module.vpc.vpc_id
  alb_sg_id         = module.security_group.alb_sg_id
  public_subnet_ids = module.vpc.public_subnet_ids
  certificate_arn   = module.acm.certificate_arn
  aws_account_id    = var.aws_account_id
  aws_region        = var.aws_region
  common_tags       = local.common_tags
}

# =========================================
# RDS
# =========================================
module "rds" {
  source = "./modules/rds"

  project               = var.project
  private_db_subnet_ids = module.vpc.private_db_subnet_ids
  rds_sg_id             = module.security_group.rds_sg_id
  db_name               = var.db_name
  db_username           = var.db_username
  db_password           = var.db_password
  db_instance_class     = var.db_instance_class
  common_tags           = local.common_tags
}

# =========================================
# ECS
# =========================================
module "ecs" {
  source = "./modules/ecs"

  project                    = var.project
  aws_region                 = var.aws_region
  vpc_id                     = module.vpc.vpc_id
  private_app_subnet_ids     = module.vpc.private_app_subnet_ids
  private_backend_subnet_ids = module.vpc.private_backend_subnet_ids
  ecs_frontend_sg_id         = module.security_group.ecs_frontend_sg_id
  ecs_backend_sg_id          = module.security_group.ecs_backend_sg_id
  ecs_task_execution_role_arn = module.iam.ecs_task_execution_role_arn
  ecs_task_role_arn          = module.iam.ecs_task_role_arn
  frontend_target_group_arn  = module.alb.frontend_target_group_arn
  frontend_image_url         = module.ecr.frontend_repository_url
  backend_image_url          = module.ecr.backend_repository_url
  db_host                    = module.rds.db_host
  db_name                    = var.db_name
  db_secret_arn              = module.rds.db_secret_arn
  common_tags                = local.common_tags
}

# =========================================
# 監視（CloudWatch / CloudTrail / EventBridge / SNS / SQS）
# =========================================
module "monitoring" {
  source = "./modules/monitoring"

  project                = var.project
  aws_account_id         = var.aws_account_id
  aws_region             = var.aws_region
  alert_email            = var.alert_email
  ecs_cluster_name       = module.ecs.cluster_name
  ecs_cluster_arn        = module.ecs.cluster_arn
  frontend_service_name  = module.ecs.frontend_service_name
  backend_service_name   = module.ecs.backend_service_name
  db_instance_identifier = "${var.project}-postgres"
  alb_arn_suffix         = module.alb.alb_arn
  common_tags            = local.common_tags
}
