from typing import Dict, List, Optional
from langchain.memory import ConversationBufferMemory
from datetime import datetime

class MemoryService:
    def __init__(self):
        self._conversations: Dict[str, ConversationBufferMemory] = {}

    def get_conversation(self, user_id: str) -> ConversationBufferMemory:
        if user_id not in self._conversations:
            self._conversations[user_id] = ConversationBufferMemory(
                return_messages=True,
                memory_key="chat_history"
            )
        return self._conversations[user_id]

    def add_message(self, user_id: str, message: str, role: str = "user"):
        memory = self.get_conversation(user_id)
        memory.save_context(
            {"role": role},
            {"content": message, "timestamp": datetime.now().isoformat()}
        )

    def get_context(self, user_id: str) -> Dict:
        memory = self.get_conversation(user_id)
        return memory.load_memory_variables({})

    def clear_conversation(self, user_id: str):
        if user_id in self._conversations:
            del self._conversations[user_id]
