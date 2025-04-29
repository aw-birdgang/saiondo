import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';
import { logError } from './utils';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { DocumentSnapshot } from 'firebase-admin/firestore';
import { CloudEvent } from 'firebase-functions/v2/core';
import { getFirestore } from 'firebase-admin/firestore';

// Firebase Admin 초기화에 데이터베이스 이름 지정
admin.initializeApp({
  databaseURL: `https://mcp-demo-d548a.firebaseio.com`,
  projectId: 'mcp-demo-d548a',
  storageBucket: 'mcp-demo-d548a.appspot.com'
});

// Firestore 초기화 시 데이터베이스 이름 지정
const db = getFirestore(admin.app(), 'mcp-demo-database');

// Python 백엔드 URL을 상수로 분리
const PYTHON_BACKEND_URL = 'https://python-backend-812344915961.asia-northeast3.run.app/analyze';

// 프롬프트 분석 함수 분리
async function analyzePythonPrompt(promptText: string | undefined, promptId: string): Promise<void> {
  if (!promptText) {
    logError(new Error('Prompt text is missing'), 'analyzePythonPrompt');
    return;
  }

  try {
    await axios.post(PYTHON_BACKEND_URL, {
      prompt: promptText,
      id: promptId
    });
  } catch (error) {
    logError(error, `Python backend call failed for promptId: ${promptId}`);
  }
}

// Firestore 트리거 함수
export const onPromptCreated = onDocumentCreated({
  document: 'prompts/{promptId}',
  region: 'asia-northeast3',
  database: 'mcp-demo-database'
}, async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    console.log('No data associated with the event');
    return;
  }

  try {
    const data = snapshot.data();
    if (!data) {
      console.log('Document data is empty');
      return;
    }

    console.log('New prompt created:', {
      id: snapshot.id,
      data: data
    });

    // analyzePythonPrompt 함수 호출 추가
    await analyzePythonPrompt(data.text, snapshot.id);  // data.text는 프롬프트 텍스트 필드명에 따라 조정 필요

  } catch (error) {
    console.error('Error processing document:', error);
    throw error;
  }
});