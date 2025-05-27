from services.llm_provider import llm_provider

class ChatService:
    def chat(self, prompt: str, model: str) -> str:
        return llm_provider.ask(prompt, model)

    def chat_history(self, messages, model: str) -> str:
        return llm_provider.ask_history(messages, model)

chat_service = ChatService()
