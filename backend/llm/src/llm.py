from providers.claude_client import ask_claude
from providers.openai_client import ask_openai

def ask_llm(prompt: str, model: str) -> str:
    if model == 'openai':
        return ask_openai(prompt)
    elif model == 'claude':
        return ask_claude(prompt)
    else:
        return "❌ 지원하지 않는 모델입니다 (openai 또는 claude 선택)"

