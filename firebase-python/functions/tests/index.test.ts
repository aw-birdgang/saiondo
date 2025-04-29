import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { assert } from 'chai';

// 프롬프트 데이터 인터페이스 정의
interface PromptData {
  text: string;
  status: string;
  timestamp: admin.firestore.Timestamp;
}

describe('Firebase Function Tests', () => {
  let db: admin.firestore.Firestore;

  before(async () => {
    // Emulator 설정
    process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
    process.env.FIREBASE_FIRESTORE_EMULATOR_ADDRESS = 'localhost:8080';
    process.env.FUNCTIONS_EMULATOR = 'true';

    // Firebase 초기화
    admin.initializeApp({
      projectId: 'mcp-demo-d548a'
    });

    // Firestore 초기화
    db = getFirestore();
  });

  it('should create a prompt and trigger analysis', async function() {
    this.timeout(20000); // 시간을 좀 더 넉넉히 설정

    const testData: Omit<PromptData, 'timestamp'> = {
      text: "테스트 프롬프트 내용",
      status: "pending"
    };

    try {
      console.log('Creating test document...');
      const docRef = await db.collection('prompts').add({
        ...testData,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
      const docId = docRef.id;
      console.log('Created test document with ID:', docId);

      // 문서 변경 감지를 위한 Promise
      const documentUpdated = new Promise<PromptData>((resolve, reject) => {
        const unsubscribe = docRef.onSnapshot((snapshot) => {
          const data = snapshot.data() as PromptData | undefined;
          console.log('Document updated:', data);
          
          // status가 'pending'이 아닌 다른 상태로 변경되면 성공
          if (data && data.status !== 'pending') {
            unsubscribe(); // 리스너 제거
            resolve(data);
          }
        }, (error) => {
          reject(error);
        });

        // 15초 후에도 변경이 없으면 타임아웃
        setTimeout(() => {
          unsubscribe();
          reject(new Error('Document update timeout'));
        }, 15000);
      });

      console.log('Waiting for function execution and document update...');
      const updatedData = await documentUpdated;
      
      console.log('Final document data:', updatedData);
      
      // 검증
      assert.exists(updatedData, 'Updated document should exist');
      assert.equal(updatedData.text, testData.text, 'Document text should match');
      assert.notEqual(updatedData.status, 'pending', 'Status should be updated');
      
      console.log('Test completed successfully');
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });

  after(async () => {
    // 테스트 후 정리
    await admin.app().delete();
  });
});
