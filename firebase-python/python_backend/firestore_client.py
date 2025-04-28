import firebase_admin
from firebase_admin import credentials, firestore

# Firebase Admin SDK 초기화 (환경변수 또는 서비스 계정 키 필요)
if not firebase_admin._apps:
    # Cloud Run에서는 별도 키 파일 없이 initialize_app()만 호출
    firebase_admin.initialize_app()

db = firestore.client()

def save_result(prompt_id: str, result: str):
    db.collection('results').document(prompt_id).set({
        'result': result
    }) 