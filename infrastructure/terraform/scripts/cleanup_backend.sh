#!/bin/bash

# 스크립트 실행 중 에러가 발생하면 즉시 중단
set -e

# --- 설정 변수 ---
# 삭제할 S3 버킷 이름
BUCKET_NAME="saiondo-terraform-state-bucket"

# 삭제할 DynamoDB 테이블 이름
DYNAMODB_TABLE_NAME="terraform-lock"

# AWS 리전
AWS_REGION="ap-northeast-2"
# -----------------

echo "⚠️ 경고: 이 스크립트는 Terraform 백엔드 리소스를 영구적으로 삭제합니다."
echo "삭제 대상:"
echo "  - S3 Bucket: $BUCKET_NAME"
echo "  - DynamoDB Table: $DYNAMODB_TABLE_NAME"
echo ""
echo "이 작업을 수행하면 Terraform 상태 파일이 모두 사라져 더 이상 인프라 관리가 불가능할 수 있습니다."
read -p "정말로 모든 백엔드 리소스를 삭제하시겠습니까? (yes/no): " CONFIRMATION

if [ "$CONFIRMATION" != "yes" ]; then
    echo "삭제 작업을 취소했습니다."
    exit 0
fi

echo ""
echo "백엔드 리소스 삭제를 시작합니다..."

# 1. S3 버킷 삭제
echo "1. S3 버킷($BUCKET_NAME)을 삭제합니다..."
if aws s3api head-bucket --bucket "$BUCKET_NAME" 2>/dev/null; then
  # '--force' 옵션은 버킷 안의 객체를 모두 삭제하고 버킷을 삭제합니다.
  aws s3 rb "s3://$BUCKET_NAME" --force
  echo "S3 버킷 '$BUCKET_NAME' 삭제가 완료되었습니다."
else
  echo "S3 버킷 '$BUCKET_NAME'이(가) 존재하지 않습니다. 건너뜁니다."
fi

# 2. DynamoDB 테이블 삭제
echo "2. DynamoDB 테이블($DYNAMODB_TABLE_NAME)을 삭제합니다..."
if aws dynamodb describe-table --table-name "$DYNAMODB_TABLE_NAME" --region "$AWS_REGION" 2>/dev/null; then
  aws dynamodb delete-table --table-name "$DYNAMODB_TABLE_NAME" --region "$AWS_REGION"
  echo "DynamoDB 테이블 '$DYNAMODB_TABLE_NAME' 삭제 요청이 완료되었습니다."
  echo "테이블이 완전히 삭제될 때까지 잠시 기다립니다..."
  aws dynamodb wait table-not-exists --table-name "$DYNAMODB_TABLE_NAME" --region "$AWS_REGION"
else
  echo "DynamoDB 테이블 '$DYNAMODB_TABLE_NAME'이(가) 존재하지 않습니다. 건너뜁니다."
fi

echo ""
echo "✅ Terraform 백엔드 리소스 삭제가 성공적으로 완료되었습니다."
