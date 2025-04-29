from fastapi import FastAPI, Request, HTTPException
from services.analyzer import analyze_prompt
from firestore_client import save_result
import logging
from typing import Dict, Any
import traceback
import os

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 환경 변수 설정
os.environ['FIRESTORE_DATABASE_ID'] = 'mcp-demo-database'

app = FastAPI()

@app.get("/")
async def health_check():
    return {"status": "healthy"}

@app.post("/analyze")
async def analyze(request: Request) -> Dict[str, Any]:
    try:
        # 요청 바디 파싱
        body = await request.json()
        logger.info(f"Received request body: {body}")
        
        # 필수 필드 확인
        prompt = body.get("prompt")
        prompt_id = body.get("id")
        
        if not prompt:
            raise HTTPException(status_code=400, detail="Missing prompt")
        if not prompt_id:
            raise HTTPException(status_code=400, detail="Missing prompt ID")

        logger.info(f"Processing prompt {prompt_id}: {prompt}")
        
        # 프롬프트 분석
        try:
            result = analyze_prompt(prompt)
            logger.info(f"Analysis completed for prompt {prompt_id}")
        except Exception as analyze_error:
            logger.error(f"Analysis failed: {str(analyze_error)}")
            raise HTTPException(status_code=500, detail=f"Analysis failed: {str(analyze_error)}")

        # Firestore에 결과 저장
        try:
            save_result(prompt_id, result)
            logger.info(f"Result saved for prompt {prompt_id}")
        except ValueError as ve:
            raise HTTPException(status_code=404, detail=str(ve))
        except Exception as save_error:
            logger.error(f"Failed to save result: {str(save_error)}")
            raise HTTPException(status_code=500, detail=f"Failed to save result: {str(save_error)}")

        return {
            "status": "success",
            "prompt_id": prompt_id,
            "result": result
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e)) 