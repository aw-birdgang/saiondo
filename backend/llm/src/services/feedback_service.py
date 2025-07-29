from services.llm_provider import llm_provider


class FeedbackService:
    def feedback(self, message: str, room_id: str, model: str) -> str:
        prompt = f"[Room: {room_id}] {message}"
        return llm_provider.ask(prompt, model)

    def feedback_history(self, messages, model: str) -> str:
        return llm_provider.ask_history(messages, model)


feedback_service = FeedbackService()
