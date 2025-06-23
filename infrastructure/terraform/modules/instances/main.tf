# Find the latest Ubuntu 22.04 AMI in the current region
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical (Ubuntu's publisher)

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# TLS Provider for generating private key
resource "tls_private_key" "this" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

# Create an AWS Key Pair from the generated public key
resource "aws_key_pair" "this" {
  key_name   = "${var.key_pair_name}-${var.environment}"
  public_key = tls_private_key.this.public_key_openssh
}

# Save the generated private key to a local file
# This allows you to SSH into the instance, e.g., ssh -i saiondo-key-dev.pem ubuntu@<public_ip>
resource "local_file" "private_key" {
  content  = tls_private_key.this.private_key_pem
  filename = "${var.key_pair_name}-${var.environment}.pem"
  file_permission = "0400"
}

resource "aws_instance" "example" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  key_name      = aws_key_pair.this.key_name

  tags = {
    Name = "${var.name}-${var.environment}"
  }
}