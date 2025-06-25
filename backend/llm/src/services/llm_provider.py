import openai
from config import settings
from providers.claude_client import ask_claude
from providers.openai_client import ask_openai, ask_openai_history

class LLMProvider:
    def ask(self, prompt: str, model: str = None) -> str:
        """
        프롬프트를 LLM(OpenAI/Claude 등)에 전달하고 응답을 반환
        """
        if model is None:
            model = settings.DEFAULT_MODEL
        if model == "openai":
            return ask_openai(prompt)
        elif model == "claude":
            return ask_claude(prompt)
        else:
            return "지원하지 않는 모델입니다."

    def ask_history(self, messages, model: str = None) -> str:
        """
        메시지 히스토리를 LLM에 전달 (OpenAI/Claude 등)
        """
        if model is None:
            model = settings.DEFAULT_MODEL
        if model == "openai":
            return ask_openai_history(messages)
        elif model == "claude":
            # Claude가 messages 지원 시 구현, 아니면 마지막 user 메시지만 전달
            return ask_claude(messages[-1]["content"])
        else:
            return "지원하지 않는 모델입니다."

# 싱글턴 인스턴스
llm_provider = LLMProvider()
