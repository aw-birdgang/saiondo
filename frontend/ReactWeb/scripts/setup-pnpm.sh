#!/bin/bash

# ReactWeb 프로젝트 pnpm 설정 스크립트

echo "🚀 ReactWeb 프로젝트 pnpm 설정을 시작합니다..."

# pnpm이 설치되어 있는지 확인
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm이 설치되어 있지 않습니다."
    echo "📦 pnpm을 설치합니다..."
    npm install -g pnpm
else
    echo "✅ pnpm이 이미 설치되어 있습니다."
fi

# pnpm 버전 확인
echo "📋 pnpm 버전: $(pnpm --version)"

# 기존 node_modules 삭제 (npm/yarn 사용 시)
if [ -d "node_modules" ]; then
    echo "🧹 기존 node_modules를 삭제합니다..."
    rm -rf node_modules
fi

# package-lock.json 또는 yarn.lock 삭제
if [ -f "package-lock.json" ]; then
    echo "🗑️ package-lock.json을 삭제합니다..."
    rm package-lock.json
fi

if [ -f "yarn.lock" ]; then
    echo "🗑️ yarn.lock을 삭제합니다..."
    rm yarn.lock
fi

# pnpm으로 의존성 설치
echo "📦 pnpm으로 의존성을 설치합니다..."
pnpm install

# pnpm store 정리
echo "🧹 pnpm store를 정리합니다..."
pnpm store prune

echo "✅ pnpm 설정이 완료되었습니다!"
echo ""
echo "📝 사용 가능한 명령어:"
echo "  pnpm dev      - 개발 서버 실행"
echo "  pnpm build    - 프로덕션 빌드"
echo "  pnpm lint     - 코드 린팅"
echo "  pnpm test     - 테스트 실행"
echo "  pnpm audit    - 보안 감사"
echo "  pnpm outdated - 오래된 패키지 확인" 