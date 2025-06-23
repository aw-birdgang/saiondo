resource "aws_launch_configuration" "launch_configuration" {
  #(Optional) Creates a unique name beginning with the specified prefix. Conflicts with name.
  name_prefix = "${var.name}-"
  #(Required) The EC2 image ID to launch.
  image_id = "ami-086ca990ae37efc1b" // amzn2-ami-ecs-hvm-2.0.20190301-x86_64-ebs
  #(Required) The size of instance to launch.
  instance_type = var.instance_type
  #(Optional) The name attribute of the IAM instance profile to associate with launched instances.
  iam_instance_profile = "ecsInstanceRole"

  #(Optional) The key name that should be used for the instance.
  key_name = var.keypair
  #(Optional) A list of associated security group IDS.
  security_groups = var.security_groups

  #(Optional) The user data to provide when launching the instance. Do not pass gzip-compressed data via this argument; see user_data_base64 instead.
  user_data = "#!/bin/bash\necho ECS_CLUSTER=${aws_ecs_cluster.ecs_cluster.name} > /etc/ecs/ecs.config"
  #(Optional) If true, the launched EC2 instance will be EBS-optimized.
  ebs_optimized = false

  root_block_device {
    #(Optional) The type of volume. Can be standard, gp2, gp3, st1, sc1 or io1.
    volume_type = "standard"
    #(Optional) The size of the volume in gigabytes.
    volume_size = 30
    #(Optional) Whether the volume should be destroyed on instance termination. Defaults to true.
    delete_on_termination = true
  }

  lifecycle {
    create_before_destroy = true
  }
}
