resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-db-subnet-group"
  subnet_ids = [aws_subnet.db_1.id, aws_subnet.db_2.id]
  tags       = { Name = "${var.project_name}-db-subnet-group" }
}

resource "aws_db_instance" "mysql" {
  identifier         = "${var.project_name}-mysql"
  instance_class     = "db.t3.micro"

  snapshot_identifier = "ecommerce"

  #  重要：當使用 snapshot_identifier 時，AWS 會從快照讀取以下設定，
  # 因此在 Terraform 中必須將它們註解掉，否則會產生「參數衝突」錯誤：
  # engine                = "mysql"
  # engine_version        = "8.0"
  # allocated_storage     = 20
  # db_name               = var.db_name
  # username              = var.db_username
  # password              = var.db_password

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  skip_final_snapshot    = true
  publicly_accessible    = false

  tags = { Name = "${var.project_name}-mysql" }
}