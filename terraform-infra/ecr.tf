resource "aws_ecr_repository" "backend" {
  name                 = "${var.project_name}-backend"
  force_delete = true  # 👈 加上這一行，允許強制刪除包含映像檔的倉庫
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }
  tags = { Name = "${var.project_name}-ecr" }
}