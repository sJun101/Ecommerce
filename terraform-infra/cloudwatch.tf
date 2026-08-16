resource "aws_cloudwatch_log_group" "ecs" {
  name              = "/ecs/${var.project_name}-backend"
  retention_in_days = 7
  tags              = { Name = "${var.project_name}-log-group" }
}