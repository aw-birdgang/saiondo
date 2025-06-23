# Internet VPC
resource "aws_vpc" "vpc-terraform" {
#  cidr_block = "10.0.0.0/16"
  cidr_block = var.vpc_cidr_block
  instance_tenancy     = "default"
  enable_dns_support   = "true"
  enable_dns_hostnames = "true"

  tags = {
    Name             = var.name
    Environment      = var.environment
    TerraformManaged = "true"
  }
}

# Subnets
resource "aws_subnet" "public-subnet-1" {
  vpc_id = aws_vpc.vpc-terraform.id
#  cidr_block = "10.0.1.0/24"
  cidr_block = var.public_subnets[0]
  map_public_ip_on_launch = "true"
  availability_zone = "ap-northeast-2a"

  tags = {
    Name = var.public_subnets_name[0]
    TerraformManaged = "true"
  }
}

resource "aws_subnet" "public-subnet-2" {
  vpc_id                  = aws_vpc.vpc-terraform.id
#  cidr_block              = "10.0.2.0/24"
  cidr_block = var.public_subnets[1]
  map_public_ip_on_launch = "true"
  availability_zone       = "ap-northeast-2b"

  tags = {
    Name = var.public_subnets_name[1]
    TerraformManaged = "true"
  }
}

resource "aws_subnet" "public-subnet-3" {
  vpc_id                  = aws_vpc.vpc-terraform.id
#  cidr_block              = "10.0.3.0/24"
  cidr_block = var.public_subnets[2]
  map_public_ip_on_launch = "true"
  availability_zone       = "ap-northeast-2c"

  tags = {
    Name = var.public_subnets_name[2]
    TerraformManaged = "true"
  }
}

resource "aws_subnet" "private-subnet-1" {
  vpc_id                  = aws_vpc.vpc-terraform.id
#  cidr_block              = "10.0.4.0/24"
  cidr_block = var.private_subnets[0]
  map_public_ip_on_launch = "false"
  availability_zone       = "ap-northeast-2a"

  tags = {
    Name = var.private_subnets_name[0]
    TerraformManaged = "true"
  }
}

resource "aws_subnet" "private-subnet-2" {
  vpc_id                  = aws_vpc.vpc-terraform.id
#  cidr_block              = "10.0.5.0/24"
  cidr_block = var.private_subnets[1]
  map_public_ip_on_launch = "false"
  availability_zone       = "ap-northeast-2b"

  tags = {
    Name = var.private_subnets_name[1]
    TerraformManaged = "true"
  }
}

resource "aws_subnet" "private-subnet-3" {
  vpc_id                  = aws_vpc.vpc-terraform.id
#  cidr_block              = "10.0.6.0/24"
  cidr_block = var.private_subnets[2]
  map_public_ip_on_launch = "false"
  availability_zone = "ap-northeast-2c"

  tags = {
    Name = var.private_subnets_name[2]
    TerraformManaged = "true"
  }
}

# Internet GW
resource "aws_internet_gateway" "igw-terraform" {
  vpc_id = aws_vpc.vpc-terraform.id

  tags = {
    Name = "${var.environment}-${var.name}-igw"
    TerraformManaged = "true"
  }
}

# route tables
resource "aws_route_table" "route-table-terraform" {
  vpc_id = aws_vpc.vpc-terraform.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw-terraform.id
  }

  tags = {
    Name = "${var.environment}-${var.name}-route-table"
    TerraformManaged = "true"
  }
}

# route associations public
resource "aws_route_table_association" "main-public-1-a" {
  subnet_id      = aws_subnet.public-subnet-1.id
  route_table_id = aws_route_table.route-table-terraform.id
}

resource "aws_route_table_association" "main-public-2-a" {
  subnet_id      = aws_subnet.public-subnet-2.id
  route_table_id = aws_route_table.route-table-terraform.id
}

resource "aws_route_table_association" "main-public-3-a" {
  subnet_id      = aws_subnet.public-subnet-3.id
  route_table_id = aws_route_table.route-table-terraform.id
}

resource "aws_eip" "nat" {
  count = var.nat_gateway_enabled ? length(var.public_subnets) : 0
  domain   = "vpc"

  tags = {
    Name = "${var.name}-eip-${count.index + 1}"
  }
}

resource "aws_nat_gateway" "nat" {
  count         = var.nat_gateway_enabled ? length(var.public_subnets) : 0
  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public-subnet-1.id

  tags = {
    Name = "${var.name}-nat-${count.index + 1}"
  }

  depends_on = [aws_internet_gateway.igw-terraform]
}

resource "aws_route_table" "private" {
  count  = var.nat_gateway_enabled ? length(var.private_subnets) : 0
  vpc_id = aws_vpc.vpc-terraform.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = element(aws_nat_gateway.nat.*.id, count.index)
  }

  tags = {
    Name = "${var.name}-private-route-table-${count.index + 1}"
  }
}
