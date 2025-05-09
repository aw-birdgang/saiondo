from providers.claude_client import ask_claude
from providers.openai_client import ask_openai

def ask_llm(prompt: str, model: str) -> str:
    if model == 'openai':
        return ask_openai(prompt)
    elif model == 'claude':
        return ask_claude(prompt)
    else:
        return "❌ 지원하지 않는 모델입니다 (openai 또는 claude 선택)"

# 신규: 피드백용 함수 (컨텍스트 활용 가능)
def feedback_llm(message: str, room_id: str, model: str) -> str:
    # room_id를 활용한 컨텍스트 확장 가능
    prompt = f"[Room: {room_id}] {message}"
    return ask_llm(prompt, model)

