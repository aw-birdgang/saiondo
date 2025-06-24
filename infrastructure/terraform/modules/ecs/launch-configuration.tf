resource "aws_launch_template" "ecs_launch_template" {
  #(Optional) Creates a unique name beginning with the specified prefix. Conflicts with name.
  name_prefix = "${var.environment}-ecs-"
  #(Required) The EC2 image ID to launch.
  image_id = var.ami_id
  #(Required) The size of instance to launch.
  instance_type = var.instance_type
  #(Optional) The name attribute of the IAM instance profile to associate with launched instances.
  iam_instance_profile {
    name = aws_iam_instance_profile.ecs_instance_profile.name
  }

  #(Optional) The key name that should be used for the instance.
  key_name = var.key_name
  #(Optional) A list of associated security group IDS.
  vpc_security_group_ids = [var.security_group_id]

  #(Optional) The user data to provide when launching the instance. Do not pass gzip-compressed data via this argument; see user_data_base64 instead.
  user_data = base64encode("")
  #(Optional) If true, the launched EC2 instance will be EBS-optimized.
  ebs_optimized = false

  block_device_mappings {
    device_name = "/dev/xvda"
    ebs {
      volume_size = 30
      volume_type = "gp3"
      delete_on_termination = true
    }
  }

  lifecycle {
    create_before_destroy = true
  }
}
