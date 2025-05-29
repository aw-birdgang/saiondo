import json
from services.llm_provider import llm_provider

class ChatRelationshipCoachService:
    def run(self, messages, model):
        # system prompt는 이미 messages[0]에 포함되어 있음
        return llm_provider.ask_history(messages, model)

chat_relationship_coach_service = ChatRelationshipCoachService()
