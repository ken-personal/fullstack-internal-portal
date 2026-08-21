variable "project"                     { type = string }
variable "aws_region"                   { type = string }
variable "vpc_id"                       { type = string }
variable "private_app_subnet_ids"       { type = list(string) }
variable "private_backend_subnet_ids"   { type = list(string) }
variable "ecs_frontend_sg_id"           { type = string }
variable "ecs_backend_sg_id"            { type = string }
variable "ecs_task_execution_role_arn"  { type = string }
variable "ecs_task_role_arn"            { type = string }
variable "frontend_target_group_arn"    { type = string }
variable "frontend_image_url"           { type = string }
variable "backend_image_url"            { type = string }
variable "db_host"                      { type = string; sensitive = true }
variable "db_name"                      { type = string }
variable "db_secret_arn"                { type = string }
variable "common_tags"                  { type = map(string) }
