output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "alb_dns_name" {
  description = "ALBのDNS名"
  value       = module.alb.alb_dns_name
}

output "ecr_frontend_url" {
  description = "フロントエンドECRリポジトリURL"
  value       = module.ecr.frontend_repository_url
}

output "ecr_backend_url" {
  description = "バックエンドECRリポジトリURL"
  value       = module.ecr.backend_repository_url
}

output "rds_endpoint" {
  description = "RDSエンドポイント"
  value       = module.rds.db_endpoint
  sensitive   = true
}

output "ecs_cluster_name" {
  description = "ECSクラスター名"
  value       = module.ecs.cluster_name
}
