#!/bin/bash
set -e

# (필요시) 환경변수 로드
# source .env

# 최신 코드 pull (이미 scp로 복사했으므로 생략 가능)
# git pull origin main

# 도커 이미지 빌드 및 컨테이너 재시작
docker compose down || true
docker compose pull || true
docker compose up -d --build

echo "Deployment complete!"
