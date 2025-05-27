from config import settings

from providers.claude_client import ask_claude
from providers.openai_client import ask_openai, ask_openai_history

class LLMProvider:
    def ask(self, prompt: str, model: str = None) -> str:
        if model is None:
            model = settings.DEFAULT_MODEL
        if model == "openai":
            return ask_openai(prompt)
        elif model == "claude":
            return ask_claude(prompt)
        else:
            return "지원하지 않는 모델입니다."

    def ask_history(self, messages, model: str = None) -> str:
        if model is None:
            model = settings.DEFAULT_MODEL
        if model == "openai":
            return ask_openai_history(messages)
        elif model == "claude":
            # Claude도 messages 지원 시 구현, 아니면 첫 user 메시지만 전달
            return ask_claude(messages[-1]["content"])
        else:
            return "지원하지 않는 모델입니다."

llm_provider = LLMProvider()
