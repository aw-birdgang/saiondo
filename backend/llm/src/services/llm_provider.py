from config import settings

from providers.claude_client import ask_claude
from providers.openai_client import ask_openai

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

llm_provider = LLMProvider()
