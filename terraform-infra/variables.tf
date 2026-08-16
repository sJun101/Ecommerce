variable "project_name" {
  default = "ecommerce"
}

variable "vpc_cidr" {
  default = "10.0.0.0/16"
}

variable "db_name" {
  default = "demo"
}

variable "db_username" {
  default = "admin"
}

variable "db_password" {
  default   = "shengjun"
  sensitive = true
}
variable "aws_region" {
  default = "ap-northeast-1"
}