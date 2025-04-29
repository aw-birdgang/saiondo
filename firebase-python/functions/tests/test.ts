// tests/test.ts
import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Emulator 호스트 설정
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
process.env.FIREBASE_FIRESTORE_EMULATOR_ADDRESS = 'localhost:8080';

// Firebase 초기화
admin.initializeApp({
  projectId: 'mcp-demo-d548a'
});

// Firestore 초기화
const db = getFirestore();

async function createTestPrompt() {
  try {
    const docRef = await db.collection('prompts').add({
      text: "테스트 프롬프트 내용",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      status: "pending"
    });
    console.log('Test document created with ID:', docRef.id);
  } catch (error) {
    console.error('Error creating test document:', error);
  }
}

createTestPrompt();