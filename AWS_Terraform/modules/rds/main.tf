resource "aws_db_subnet_group" "this" {
  name       = "${var.project}-db-subnet-group"
  subnet_ids = var.private_db_subnet_ids
  tags       = var.common_tags
}

resource "aws_secretsmanager_secret" "db_password" {
  name                    = "${var.project}/db-password"
  recovery_window_in_days = 7
  tags                    = var.common_tags

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_secretsmanager_secret_version" "db_password" {
  secret_id     = aws_secretsmanager_secret.db_password.id
  secret_string = jsonencode({ password = var.db_password })
}

resource "aws_db_instance" "this" {
  identifier        = "${var.project}-postgres"
  engine            = "postgres"
  engine_version    = "15"
  instance_class    = var.db_instance_class
  allocated_storage = 20
  storage_encrypted = true

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  db_subnet_group_name   = aws_db_subnet_group.this.name
  vpc_security_group_ids = [var.rds_sg_id]

  multi_az            = true
  skip_final_snapshot = false
  final_snapshot_identifier = "${var.project}-postgres-final-snapshot"

  backup_retention_period = 7
  deletion_protection     = true

  tags = var.common_tags

  # 本番DBの誤削除・誤置換を防止
  lifecycle {
    prevent_destroy = true
    # DBパスワード変更はSecrets Manager経由で行うため、Terraform管理外とする
    ignore_changes = [password]
  }
}
