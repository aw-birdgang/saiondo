resource "aws_instance" "web" {
  ami                    = "ami-0c9c942bd7bf113a2" # Ubuntu 20.04 in ap-northeast-2
  instance_type          = var.instance_type
  subnet_id              = var.subnet_id
  key_name               = var.key_name
  associate_public_ip_address = true

  tags = {
    Name = "Terraform-Dev-Instance"
  }
} 