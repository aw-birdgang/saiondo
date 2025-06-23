resource "aws_codedeploy_app" "codedeploy_app" {
  #(Optional) The compute platform can either be ECS, Lambda, or Server. Default is Server.
  compute_platform = "ECS"
  #(Required) The name of the application.
  name = var.name
}

#Provides a CodeDeploy Deployment Group for a CodeDeploy Application
resource "aws_codedeploy_deployment_group" "codedeploy_deployment_group" {
  #(Required) The name of the application.
  app_name = aws_codedeploy_app.codedeploy_app.name
  #(Optional) The name of the group's deployment config. The default is "CodeDeployDefault.OneAtATime".
  deployment_config_name = "CodeDeployDefault.ECSAllAtOnce"
  #(Required) The name of the deployment group.
  deployment_group_name = "${var.name}-deploy-group"
  #(Required) The service role ARN that allows deployments.
  service_role_arn = aws_iam_role.codedeploy-role.arn

  #(Optional) Configuration block of the automatic rollback configuration associated with the deployment group.
  auto_rollback_configuration {
    #(Optional) Indicates whether a defined automatic rollback configuration is currently enabled for this Deployment Group. If you enable automatic rollback, you must specify at least one event type.
    enabled = true
    #(Optional) The event type or types that trigger a rollback. Supported types are DEPLOYMENT_FAILURE and DEPLOYMENT_STOP_ON_ALARM.
    events  = ["DEPLOYMENT_FAILURE"]
  }

  #(Optional) Configuration block of the blue/green deployment options for a deployment group.
  blue_green_deployment_config {
    #(Optional) Information about the action to take when newly provisioned instances are ready to receive traffic in a blue/green deployment (documented below).
    deployment_ready_option {
      action_on_timeout = "CONTINUE_DEPLOYMENT"
    }
    #(Optional) Information about whether to terminate instances in the original fleet during a blue/green deployment (documented below).
    terminate_blue_instances_on_deployment_success {
      #(Optional) The action to take on instances in the original environment after a successful blue/green deployment.
      action = "TERMINATE"
      #(Optional) The number of minutes to wait after a successful blue/green deployment before terminating instances from the original environment.
      termination_wait_time_in_minutes = 5
    }
  }

  #(Optional) Configuration block of the type of deployment, either in-place or blue/green, you want to run and whether to route deployment traffic behind a load balancer.
  deployment_style {
    deployment_option = "WITH_TRAFFIC_CONTROL"
    deployment_type   = "BLUE_GREEN"
  }

  #(Optional) Configuration block(s) of the ECS services for a deployment group
  ecs_service {
    #(Required) The name of the ECS cluster.
#    cluster_name = aws_ecs_cluster.ecs_cluster.name
    cluster_name = var.ecs_cluster_name
    #(Required) The name of the ECS service.
#    service_name = aws_ecs_service.ecs_service.name
    service_name = var.ecs_service_name
  }

  #(Optional) Single configuration block of the load balancer to use in a blue/green deployment (documented below).
  load_balancer_info {
    #(Optional) The (Application/Network Load Balancer) target group pair to use in a deployment. Conflicts with elb_info and target_group_info.
    target_group_pair_info {
      #(Required) Configuration block for the production traffic route
      prod_traffic_route {
#        listener_arns = [aws_lb_listener.front_end.arn]
        listener_arns = [var.front_end_arn]
      }
      #(Required) Configuration blocks for a target group within a target group pair
      target_group {
#        name = aws_lb_target_group.lb-target-group-blue.name
        name = var.target_group_blue_name
      }
      target_group {
#        name = aws_lb_target_group.lb-target-group-green.name
        name = var.target_group_green_name
      }
    }
  }
}
