// functions/tests/create-test-data.ts
import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// 테스트 데이터 인터페이스
interface PromptData {
  text: string;
  status: string;
  timestamp: admin.firestore.FieldValue;
}

// Firebase 초기화
admin.initializeApp({
  projectId: 'mcp-demo-d548a'
});

const db = getFirestore();

// 테스트 데이터 샘플
const testPrompts: Omit<PromptData, 'timestamp'>[] = [
  {
    text: "파이썬으로 피보나치 수열을 구현하는 방법을 알려주세요.",
    status: "pending"
  },
  {
    text: "머신러닝 모델의 과적합을 방지하는 방법에 대해 설명해주세요.",
    status: "pending"
  },
  {
    text: "Docker 컨테이너와 이미지의 차이점은 무엇인가요?",
    status: "pending"
  }
];

// 데이터 추가 함수
async function addTestPrompts() {
  try {
    console.log('Adding test prompts...');

    for (const prompt of testPrompts) {
      const docRef = await db.collection('prompts').add({
        ...prompt,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });

      console.log(`Added prompt with ID: ${docRef.id}`);
      
      // 문서 생성 확인
      const doc = await docRef.get();
      console.log('Created document data:', doc.data());
    }

    console.log('All test prompts added successfully!');
  } catch (error) {
    console.error('Error adding test prompts:', error);
  } finally {
    // Firebase 연결 종료
    process.exit(0);
  }
}

// 스크립트 실행
addTestPrompts();