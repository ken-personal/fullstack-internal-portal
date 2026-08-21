resource "aws_ecs_cluster" "this" {
  name = "${var.project}-cluster"
  tags = var.common_tags
}

resource "aws_ecs_task_definition" "backend" {
  family                   = "${var.project}-backend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = var.ecs_task_execution_role_arn
  task_role_arn            = var.ecs_task_role_arn

  container_definitions = jsonencode([{
    name  = "backend"
    image = var.backend_image_url
    portMappings = [{ containerPort = 3000, protocol = "tcp" }]
    environment = [
      { name = "DATABASE_HOST", value = var.db_host },
      { name = "DATABASE_NAME", value = var.db_name },
    ]
    secrets = [
      { name = "DATABASE_PASSWORD", valueFrom = "${var.db_secret_arn}:password::" }
    ]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = "/ecs/${var.project}-backend"
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "ecs"
      }
    }
  }])

  # IAMロールのポリシーが伝播してからタスク定義を作成する
  # （ARNは即時取得できるがポリシー有効化には数秒かかるため）
  depends_on = [
    var.ecs_task_execution_role_arn,
    var.ecs_task_role_arn,
  ]

  tags = var.common_tags
}

resource "aws_ecs_task_definition" "frontend" {
  family                   = "${var.project}-frontend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = var.ecs_task_execution_role_arn

  container_definitions = jsonencode([{
    name  = "frontend"
    image = var.frontend_image_url
    portMappings = [{ containerPort = 3000, protocol = "tcp" }]
    environment = [
      { name = "NEXT_PUBLIC_API_URL", value = "https://api.${var.project}.com" }
    ]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = "/ecs/${var.project}-frontend"
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "ecs"
      }
    }
  }])

  depends_on = [var.ecs_task_execution_role_arn]

  tags = var.common_tags
}

resource "aws_ecs_service" "backend" {
  name            = "${var.project}-backend"
  cluster         = aws_ecs_cluster.this.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.private_backend_subnet_ids
    security_groups  = [var.ecs_backend_sg_id]
    assign_public_ip = false
  }

  # タスク定義とクラスターが揃ってからサービスを起動する
  depends_on = [
    aws_ecs_task_definition.backend,
    aws_ecs_cluster.this,
  ]

  tags = var.common_tags
}

resource "aws_ecs_service" "frontend" {
  name            = "${var.project}-frontend"
  cluster         = aws_ecs_cluster.this.id
  task_definition = aws_ecs_task_definition.frontend.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.private_app_subnet_ids
    security_groups  = [var.ecs_frontend_sg_id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = var.frontend_target_group_arn
    container_name   = "frontend"
    container_port   = 3000
  }

  depends_on = [
    aws_ecs_task_definition.frontend,
    aws_ecs_cluster.this,
  ]

  tags = var.common_tags
}
