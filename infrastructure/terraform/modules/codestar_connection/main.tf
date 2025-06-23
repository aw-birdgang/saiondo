resource "aws_codestarconnections_connection" "github_codepipeline" {
  #(Required) The name of the connection to be created. The name must be unique in the calling AWS account. Changing name will create a new resource.
  name = "github-codepipeline"
  #(Optional) The name of the external provider where your third-party code repository is configured. Valid values are Bitbucket, GitHub or GitHubEnterpriseServer. Changing provider_type will create a new resource. Conflicts with host_arn
  provider_type = "GitHub"
}
