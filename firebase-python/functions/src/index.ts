import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';

admin.initializeApp();

// Firestore 트리거: prompts 컬렉션에 새 문서가 생성될 때마다 실행
export const onPromptCreate = functions.firestore
  .document('prompts/{promptId}')
  .onCreate(async (snap, context) => {
    const data = snap.data() as { promptText?: string };
    const promptId = context.params.promptId;
    try {
      // Python 백엔드로 프롬프트 전달
      await axios.post('https://python-backend-812344915961.asia-northeast3.run.app/analyze', {
        prompt: data.promptText,
        id: promptId
      });
    } catch (error) {
      console.error('Python backend 호출 실패:', error);
    }
  });