from services.llm_provider import llm_provider

class ChatService:
    def chat(self, prompt: str, model: str) -> str:
        return llm_provider.ask(prompt, model)

chat_service = ChatService()
