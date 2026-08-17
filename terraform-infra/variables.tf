variable "project_name" {
}

variable "vpc_cidr" {
}

variable "db_name" {
}

variable "db_username" {
}

variable "db_password" {
  sensitive = true
}
variable "aws_region" {
}