from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.health import router as health_router
from api.prompt import router as prompt_router

from api.chat import router as chat_router
from api.chat_relationship_coach import router as chat_relationship_coach_router

from api.couple_analysis import router as couple_analysis_router
from api.enhanced_couple_analysis import router as enhanced_couple_analysis_router
from api.batch_analysis import router as batch_analysis_router

from api.labeling import router as labeling_router
from api.labeling_trait_vector import router as labeling_trait_vector_router

from api.feedback import router as feedback_router

load_dotenv()

app = FastAPI(
    title="SAIONDO LLM Backend",
    description="커플 분석, AI 챗, 피드백 등 다양한 LLM 기반 기능 제공",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 실제 운영에서는 특정 도메인만 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록 (기능별 정렬)
app.include_router(health_router)
app.include_router(prompt_router)

app.include_router(chat_router)
app.include_router(chat_relationship_coach_router)

app.include_router(couple_analysis_router)
app.include_router(enhanced_couple_analysis_router, prefix="/api/v1")
app.include_router(batch_analysis_router, prefix="/api/v1")

app.include_router(labeling_router)
app.include_router(labeling_trait_vector_router)

app.include_router(feedback_router)

@app.get("/")
async def root():
    return {
        "message": "SAIONDO LLM Backend API",
        "version": "1.0.0",
        "docs": "/docs"
    }
