from dotenv import load_dotenv
from fastapi import FastAPI

from api.chat import router as chat_router
from api.chat_relationship_coach import router as chat_relationship_coach_router
from api.couple_analysis import router as couple_analysis_router
from api.feedback import router as feedback_router
from api.health import router as health_router
from api.labeling import router as labeling_router
from api.labeling_trait_vector import router as labeling_trait_vector_router
from api.prompt import router as prompt_router

load_dotenv()

app = FastAPI(
    title="SAIONDO LLM Backend",
    description="커플 분석, AI 챗, 피드백 등 다양한 LLM 기반 기능 제공",
    version="1.0.0"
)

app.include_router(prompt_router)
app.include_router(chat_router)
app.include_router(feedback_router)
app.include_router(couple_analysis_router)
app.include_router(health_router)
app.include_router(chat_relationship_coach_router)
app.include_router(labeling_router)
app.include_router(labeling_trait_vector_router)
