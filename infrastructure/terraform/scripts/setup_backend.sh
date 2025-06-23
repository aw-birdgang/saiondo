#!/bin/bash

# 스크립트 실행 중 에러가 발생하면 즉시 중단
set -e

# --- 설정 변수 ---
# S3 버킷 이름 (전 세계적으로 고유해야 함)
# 만약 이미 존재하는 이름이라면, 자신만의 고유한 값을 뒤에 추가하세요. (예: -my-unique-name)
BUCKET_NAME="saiondo-terraform-state-bucket"

# DynamoDB 테이블 이름
DYNAMODB_TABLE_NAME="terraform-lock"

# AWS 리전
AWS_REGION="ap-northeast-2"
# -----------------

echo "Terraform 백엔드 설정을 시작합니다..."

# 1. S3 버킷 생성
echo "1. S3 버킷($BUCKET_NAME)을 생성합니다..."
if aws s3api head-bucket --bucket "$BUCKET_NAME" 2>/dev/null; then
  echo "S3 버킷 '$BUCKET_NAME'이(가) 이미 존재합니다."
else
  aws s3api create-bucket \
      --bucket "$BUCKET_NAME" \
      --region "$AWS_REGION" \
      --create-bucket-configuration LocationConstraint="$AWS_REGION"
  echo "S3 버킷 '$BUCKET_NAME' 생성이 완료되었습니다."
fi

# 2. S3 버킷 버저닝 활성화
echo "2. S3 버킷($BUCKET_NAME)의 버저닝을 활성화합니다..."
aws s3api put-bucket-versioning \
    --bucket "$BUCKET_NAME" \
    --versioning-configuration Status=Enabled
echo "S3 버킷 버저닝 활성화가 완료되었습니다."

# 3. DynamoDB 테이블 생성
echo "3. DynamoDB 테이블($DYNAMODB_TABLE_NAME)을 생성합니다..."
if aws dynamodb describe-table --table-name "$DYNAMODB_TABLE_NAME" 2>/dev/null; then
  echo "DynamoDB 테이블 '$DYNAMODB_TABLE_NAME'이(가) 이미 존재합니다."
else
  aws dynamodb create-table \
      --table-name "$DYNAMODB_TABLE_NAME" \
      --attribute-definitions AttributeName=LockID,AttributeType=S \
      --key-schema AttributeName=LockID,KeyType=HASH \
      --billing-mode PAY_PER_REQUEST \
      --region "$AWS_REGION"
  echo "DynamoDB 테이블 '$DYNAMODB_TABLE_NAME' 생성이 완료되었습니다."
  echo "테이블이 완전히 활성화될 때까지 잠시 기다립니다..."
  aws dynamodb wait table-exists --table-name "$DYNAMODB_TABLE_NAME" --region "$AWS_REGION"
fi

echo ""
echo "✅ Terraform 백엔드 설정이 성공적으로 완료되었습니다."
echo "S3 Bucket: $BUCKET_NAME"
echo "DynamoDB Table: $DYNAMODB_TABLE_NAME"
