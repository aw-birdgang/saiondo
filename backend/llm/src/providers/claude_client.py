import os
import requests
from dotenv import load_dotenv

load_dotenv()

CLAUDE_API_URL = os.getenv("CLAUDE_API_BASE", "https://api.anthropic.com/v1")
CLAUDE_API_KEY = os.getenv("CLAUDE_API_KEY")


def ask_claude(prompt: str) -> str:
    headers = {
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
    }

    payload = {
        "model": "claude-3-opus-20240229",  # 최신 Claude 모델
        "max_tokens": 1024,
        "temperature": 0.7,
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }

    try:
        res = requests.post(f"{CLAUDE_API_URL}/messages", headers=headers, json=payload)
        res.raise_for_status()
        return res.json()['content'][0]['text']
    except Exception as e:
        return f"❌ Claude 오류: {e}"
