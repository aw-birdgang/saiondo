import os

class Settings:
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
    CLAUDE_API_KEY = os.getenv("CLAUDE_API_KEY", "")
    DEFAULT_MODEL = os.getenv("DEFAULT_MODEL", "openai")

settings = Settings()
