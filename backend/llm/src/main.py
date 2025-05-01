from fastapi import FastAPI
from routes import router

app = FastAPI(
    title="LLM Proxy API",
    description="OpenAI + Claude 프록시 API",
    version="1.0.0",
)

app.include_router(router)
