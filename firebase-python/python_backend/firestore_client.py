import firebase_admin
from firebase_admin import credentials, firestore
import os
import logging

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def initialize_firestore():
    cred = credentials.ApplicationDefault()
    # 데이터베이스 ID 지정
    app = firebase_admin.initialize_app(cred, {
        'projectId': 'mcp-demo-d548a',
        'databaseURL': 'https://mcp-demo-d548a.firebaseio.com'
    })
    
    # Firestore 클라이언트 초기화 시 데이터베이스 ID 지정
    return firestore.Client(
        project='mcp-demo-d548a',
        database='mcp-demo-database'  # 여기에 데이터베이스 ID 지정
    )

# Firestore 클라이언트 초기화
db = initialize_firestore()

def save_result(prompt_id: str, result: str):
    try:
        print(f"Database ID: {db._database_string}")
        print(f"Project ID: {db.project}")
        logger.info(f"Attempting to save result for prompt {prompt_id}")
        
        # prompts 컬렉션의 문서 업데이트
        doc_ref = db.collection('prompts').document(prompt_id)
        
        # 문서가 존재하는지 확인
        doc = doc_ref.get()
        if not doc.exists:
            logger.error(f"Document {prompt_id} not found")
            raise ValueError(f"Document {prompt_id} not found")

        # 문서 업데이트
        doc_ref.update({
            'result': result,
            'status': 'completed',
            'updated_at': firestore.SERVER_TIMESTAMP
        })
        
        logger.info(f"Successfully saved result for prompt {prompt_id}")
        return True
        
    except Exception as e:
        logger.error(f"Error saving result for prompt {prompt_id}: {str(e)}")
        
        # 에러 상태 업데이트 시도
        try:
            if doc_ref:
                doc_ref.update({
                    'status': 'error',
                    'error_message': str(e),
                    'updated_at': firestore.SERVER_TIMESTAMP
                })
        except Exception as update_error:
            logger.error(f"Failed to update error status: {str(update_error)}")
        
        raise 