import requests
import time

API_URL = "http://localhost:8000/api/v1/chat"
HEADERS = {"Content-Type": "application/json"}

TEST_CASES = [
    {
        "name": "Calculator",
        "input": "123 더하기 456은?",
        "expected_tool": "Calculator",
        "check": lambda resp: "579" in resp
    },
    {
        "name": "Weather",
        "input": "서울의 현재 날씨 알려줘",
        "expected_tool": "Weather",
        "check": lambda resp: "서울" in resp and ("°C" in resp or "온도" in resp)
    },
    {
        "name": "News",
        "input": "오늘 IT 뉴스 알려줘",
        "expected_tool": "News",
        "check": lambda resp: "-" in resp or "뉴스" in resp
    },
    # 필요하다면 더 추가 가능
]

def run_test(test):
    data = {
        "message": test["input"],
        "history": []
    }
    try:
        response = requests.post(API_URL, headers=HEADERS, json=data, timeout=15)
        response.raise_for_status()
        result = response.json()
        tool_used = result.get("tool_used")
        resp_text = result.get("response", "")
        passed = (tool_used == test["expected_tool"]) and test["check"](resp_text)
        print(f"[{test['name']}] {'✅ 성공' if passed else '❌ 실패'}")
        print(f"  입력: {test['input']}")
        print(f"  기대 도구: {test['expected_tool']} / 실제: {tool_used}")
        print(f"  응답: {resp_text[:100]}{'...' if len(resp_text)>100 else ''}")
        print()
        return passed
    except Exception as e:
        print(f"[{test['name']}] ❌ 예외 발생: {e}")
        return False

if __name__ == "__main__":
    print("툴별 자동화 테스트 시작!\n")
    all_passed = True
    for test in TEST_CASES:
        time.sleep(1)  # 서버 과부하 방지
        if not run_test(test):
            all_passed = False
    print("전체 결과:", "🎉 모두 성공!" if all_passed else "⚠️ 일부 실패 또는 예외 발생")