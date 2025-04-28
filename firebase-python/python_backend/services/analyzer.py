from langchain_pipeline import run_pipeline

def analyze_prompt(prompt: str) -> str:
    return run_pipeline(prompt) 