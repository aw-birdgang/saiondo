
output "front_end_arn" {
  value = aws_lb_listener.front_end.arn
}

output "target_group_blue_id" {
  value = aws_lb_target_group.lb_target_group_blue.id
}

output "target_group_blue_name" {
  value = aws_lb_target_group.lb_target_group_blue.name
}

output "target_group_green_name" {
  value = aws_lb_target_group.lb_target_group_green.name
}
