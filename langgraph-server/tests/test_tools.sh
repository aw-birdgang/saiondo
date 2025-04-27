#!/bin/bash

# 색상 정의
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BLUE='\033[0;34m'

# API 엔드포인트
API_URL="http://localhost:8000/api/v1/chat"

# 함수 정의: curl 요청 보내기
send_request() {
    local message="$1"
    local description="$2"
    
    echo -e "\n${GREEN}테스트: ${description}${NC}"
    echo -e "${BLUE}요청: ${message}${NC}"
    
    response=$(curl -s -X POST $API_URL \
    -H "Content-Type: application/json" \
    -d "{
      \"message\": \"$message\",
      \"history\": []
    }" | python3 -m json.tool)
    
    echo -e "${BLUE}응답:${NC}"
    echo "$response"
    echo "----------------------------------------"
}

echo -e "${GREEN}🤖 도구 테스트 시작!${NC}\n"

# 계산기 테스트
send_request "123 더하기 456은?" "계산기 - 덧셈"
sleep 1
send_request "17 곱하기 19는?" "계산기 - 곱셈"
sleep 1

# 날씨 테스트
send_request "서울의 현재 날씨 알려줘" "날씨 - 서울"
sleep 1
send_request "부산 날씨는 어때?" "날씨 - 부산"
sleep 1

# 뉴스 테스트
send_request "오늘 IT 뉴스 알려줘" "뉴스 - IT"
sleep 1
send_request "최신 경제 뉴스 보여줘" "뉴스 - 경제"

echo -e "\n${GREEN}🎉 테스트 완료!${NC}"
