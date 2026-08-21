output "db_host" {
  value     = aws_db_instance.this.address
  sensitive = true
}

output "db_secret_arn" {
  value = aws_secretsmanager_secret.db_password.arn
}
