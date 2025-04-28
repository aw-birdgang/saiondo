from fastapi import FastAPI, Request
from services.analyzer import analyze_prompt
from firestore_client import save_result

app = FastAPI()

@app.post("/analyze")
async def analyze(request: Request):
    body = await request.json()
    prompt = body.get("prompt")
    prompt_id = body.get("id")
    result = analyze_prompt(prompt)
    save_result(prompt_id, result)
    return {"result": result} 