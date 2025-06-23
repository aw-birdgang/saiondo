#Provides a Load Balancer resource.
resource "aws_lb" "front_end" {
  #(Optional) The name of the LB. This name must be unique within your AWS account, can have a maximum of 32 characters, must contain only alphanumeric characters or hyphens, and must not begin or end with a hyphen. If not specified, Terraform will autogenerate a name beginning with tf-lb.
  name = "${var.name}-nlb"
  #(Optional) A list of subnet IDs to attach to the LB. Subnets cannot be updated for Load Balancers of type network. Changing this value for load balancers of type network will force a recreation of the resource.
  subnets = var.public_subnets
  #(Optional) The type of load balancer to create. Possible values are application, gateway, or network. The default value is application.
  load_balancer_type = "network"
  #(Optional) If true, cross-zone load balancing of the load balancer will be enabled. For network and gateway type load balancers, this feature is disabled by default (false). For application load balancer this feature is always enabled (true) and cannot be disabled. Defaults to false.
  enable_cross_zone_load_balancing = true
}

#aws_alb_listener is known as aws_lb_listener. The functionality is identical.
resource "aws_lb_listener" "front_end" {
  #(Required, Forces New Resource) ARN of the load balancer.
  load_balancer_arn = aws_lb.front_end.arn
  #(Optional) Port on which the load balancer is listening. Not valid for Gateway Load Balancers.
  port = "80"
  #(Optional) Protocol for connections from clients to the load balancer. For Application Load Balancers, valid values are HTTP and HTTPS, with a default of HTTP. For Network Load Balancers, valid values are TCP, TLS, UDP, and TCP_UDP. Not valid to use UDP or TCP_UDP if dual-stack mode is enabled. Not valid for Gateway Load Balancers.
  protocol = "TCP"

  default_action {
    #(Optional) ARN of the Target Group to which to route traffic. Specify only if type is forward and you want to route to a single target group. To route to one or more target groups, use a forward block instead.
    target_group_arn = aws_lb_target_group.lb_target_group_blue.id
    #(Required) Type of routing action. Valid values are forward, redirect, fixed-response, authenticate-cognito and authenticate-oidc.
    type = "forward"
  }
  lifecycle {
    ignore_changes = [
      default_action,
    ]
  }
}

#Provides a Target Group resource for use with Load Balancer resources.
resource "aws_lb_target_group" "lb_target_group_blue" {
  #(Optional, Forces new resource) Name of the target group. If omitted, Terraform will assign a random, unique name. This name must be unique per region per account, can have a maximum of 32 characters, must contain only alphanumeric characters or hyphens, and must not begin or end with a hyphen.
  name = "${var.name}-http-blue-tg"
  #(May be required, Forces new resource) Port on which targets receive traffic, unless overridden when registering a specific target. Required when target_type is instance, ip or alb. Does not apply when target_type is lambda.
  port = "3000"
  #(May be required, Forces new resource) Protocol to use for routing traffic to the targets. Should be one of GENEVE, HTTP, HTTPS, TCP, TCP_UDP, TLS, or UDP. Required when target_type is instance, ip or alb. Does not apply when target_type is lambda.
  protocol = "TCP"
  #(May be required, Forces new resource) Type of target that you must specify when registering targets with this target group. See doc for supported values. The default is instance.
  #Note that you can't specify targets for a target group using both instance IDs and IP addresses.
  target_type = "ip"
  #(Optional, Forces new resource) Identifier of the VPC in which to create the target group. Required when target_type is instance, ip or alb. Does not apply when target_type is lambda.
  vpc_id = var.vpc_id
  #(Optional) Amount time for Elastic Load Balancing to wait before changing the state of a deregistering target from draining to unused. The range is 0-3600 seconds. The default value is 300 seconds.
  deregistration_delay = "30"

  #The Health Check parameters you can set vary by the protocol of the Target Group. Many parameters cannot be set to custom values for network load balancers at this time. See http://docs.aws.amazon.com/elasticloadbalancing/latest/APIReference/API_CreateTargetGroup.html for a complete reference.
  health_check {
    #(Optional) Number of consecutive health check successes required before considering a target healthy. The range is 2-10. Defaults to 3.
    healthy_threshold = 2
    #(Optional) Number of consecutive health check failures required before considering a target unhealthy. The range is 2-10. Defaults to 3.
    unhealthy_threshold = 2
    #(Optional) Protocol the load balancer uses when performing health checks on targets. Must be either TCP, HTTP, or HTTPS. The TCP protocol is not supported for health checks if the protocol of the target group is HTTP or HTTPS. Defaults to HTTP.
    protocol = "TCP"
    #(Optional) Approximate amount of time, in seconds, between health checks of an individual target. The range is 5-300. For lambda target groups, it needs to be greater than the timeout of the underlying lambda. Defaults to 30.
    interval = 30
  }
}

resource "aws_lb_target_group" "lb_target_group_green" {
  #(Optional, Forces new resource) Name of the target group. If omitted, Terraform will assign a random, unique name. This name must be unique per region per account, can have a maximum of 32 characters, must contain only alphanumeric characters or hyphens, and must not begin or end with a hyphen.
  name = "${var.name}-http-green-tg"
  #(May be required, Forces new resource) Port on which targets receive traffic, unless overridden when registering a specific target. Required when target_type is instance, ip or alb. Does not apply when target_type is lambda.
  port = "3000"
  #(May be required, Forces new resource) Protocol to use for routing traffic to the targets. Should be one of GENEVE, HTTP, HTTPS, TCP, TCP_UDP, TLS, or UDP. Required when target_type is instance, ip or alb. Does not apply when target_type is lambda.
  protocol = "TCP"
  #(May be required, Forces new resource) Type of target that you must specify when registering targets with this target group. See doc for supported values. The default is instance.
  #Note that you can't specify targets for a target group using both instance IDs and IP addresses.
  target_type = "ip"
  #(Optional, Forces new resource) Identifier of the VPC in which to create the target group. Required when target_type is instance, ip or alb. Does not apply when target_type is lambda.
  vpc_id = var.vpc_id
  #(Optional) Amount time for Elastic Load Balancing to wait before changing the state of a deregistering target from draining to unused. The range is 0-3600 seconds. The default value is 300 seconds.
  deregistration_delay = "30"

  #The Health Check parameters you can set vary by the protocol of the Target Group. Many parameters cannot be set to custom values for network load balancers at this time. See http://docs.aws.amazon.com/elasticloadbalancing/latest/APIReference/API_CreateTargetGroup.html for a complete reference.
  health_check {
    #(Optional) Number of consecutive health check successes required before considering a target healthy. The range is 2-10. Defaults to 3.
    healthy_threshold = 2
    #(Optional) Number of consecutive health check failures required before considering a target unhealthy. The range is 2-10. Defaults to 3.
    unhealthy_threshold = 2
    #(Optional) Protocol the load balancer uses when performing health checks on targets. Must be either TCP, HTTP, or HTTPS. The TCP protocol is not supported for health checks if the protocol of the target group is HTTP or HTTPS. Defaults to HTTP.
    protocol = "TCP"
    #(Optional) Approximate amount of time, in seconds, between health checks of an individual target. The range is 5-300. For lambda target groups, it needs to be greater than the timeout of the underlying lambda. Defaults to 30.
    interval = 30
  }
}
