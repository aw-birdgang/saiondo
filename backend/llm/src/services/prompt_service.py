from services.llm_provider import llm_provider


class PromptService:
    def prompt(self, prompt: str, model: str) -> str:
        return llm_provider.ask(prompt, model)


prompt_service = PromptService()
