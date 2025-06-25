# 최신 Ubuntu 22.04 AMI 조회 (Canonical 공식)
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# SSH 접속용 RSA 키 생성
resource "tls_private_key" "this" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

# 생성한 키를 로컬 파일로 저장
resource "local_file" "private_key" {
  content        = tls_private_key.this.private_key_pem
  filename       = "${var.key_pair_name}.pem"
  file_permission = "0400"
}

# EC2 인스턴스 생성
resource "aws_instance" "this" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  subnet_id              = var.public_subnets[0]
  vpc_security_group_ids = var.vpc_security_group_ids
  key_name               = var.key_pair_name
  associate_public_ip_address = true

  tags = {
    Name = var.name
  }
}
