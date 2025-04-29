from fastapi import FastAPI, Request, HTTPException
from services.analyzer import PromptAnalyzer
from firestore_client import save_result
import logging
from typing import Dict, Any
import traceback
import os
from pydantic import BaseModel
from firebase_admin import credentials, initialize_app, firestore, get_app

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 환경 변수 설정
os.environ['FIRESTORE_DATABASE_ID'] = 'mcp-demo-database'

# Firebase 초기화 (이미 초기화되어 있는지 확인)
try:
    firebase_app = get_app()
    logger.info("Firebase app already initialized")
except ValueError:
    # Firebase가 초기화되어 있지 않은 경우에만 초기화
    cred = credentials.ApplicationDefault()
    firebase_app = initialize_app(cred, {
        'projectId': 'mcp-demo-d548a',
        'databaseURL': 'https://mcp-demo-d548a.firebaseio.com'
    })
    logger.info("Firebase app initialized")

# Firestore 클라이언트 초기화
db = firestore.Client(
    project='mcp-demo-d548a',
    database='mcp-demo-database'
)

# FastAPI 앱 초기화
app = FastAPI()

# PromptAnalyzer 인스턴스 생성
analyzer = PromptAnalyzer(db)

class PromptRequest(BaseModel):
    prompt: str
    id: str

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/analyze")
async def analyze_prompt(request: PromptRequest):
    try:
        logger.info(f"Received request body: {request.dict()}")
        logger.info(f"Processing prompt {request.id}: {request.prompt}")
        
        # 프롬프트 분석 수행
        result = await analyzer.analyze_prompt(request.prompt, request.id)
        
        # Firestore에 결과 저장
        prompt_ref = db.collection('prompts').document(request.id)
        prompt_ref.update({
            'result': result,
            'status': 'completed',
            'updatedAt': firestore.SERVER_TIMESTAMP
        })
        
        logger.info(f"Analysis completed for prompt {request.id}")
        return {"status": "success", "result": result}
        
    except Exception as e:
        logger.error(f"Error processing prompt: {str(e)}")
        # Firestore에 에러 상태 업데이트
        try:
            prompt_ref = db.collection('prompts').document(request.id)
            prompt_ref.update({
                'status': 'error',
                'error': str(e),
                'updatedAt': firestore.SERVER_TIMESTAMP
            })
        except Exception as update_error:
            logger.error(f"Failed to update error status: {str(update_error)}")
        
        raise HTTPException(status_code=500, detail=str(e)) 