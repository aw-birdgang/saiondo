import * as admin from 'firebase-admin';
import {getFirestore} from 'firebase-admin/firestore';

// 서비스 계정 키 로드
const serviceAccount = require('../service-account.json');

// Firebase 초기화 - databaseURL 추가
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'mcp-demo-d548a',
  databaseURL: 'https://mcp-demo-d548a.firebaseio.com'
});

// Firestore 초기화 - 데이터베이스 ID 지정
const db = getFirestore(admin.app(), 'mcp-demo-database');

// 테스트 프롬프트 템플릿
const promptTemplates = [
  "파이썬으로 {topic}을 구현하는 방법을 설명해주세요.",
  "{topic}의 장단점을 분석해주세요.",
  "{topic}에 대한 기초적인 설명과 예제를 제공해주세요.",
  "{topic}을 실무에서 어떻게 활용할 수 있을까요?",
  "초보자가 {topic}을 배우기 위한 최적의 방법은 무엇인가요?"
];

const topics = [
  "데이터베이스 설계",
  "REST API",
  "Docker 컨테이너",
  "클라우드 아키텍처",
  "마이크로서비스"
];

// 랜덤 프롬프트 생성
function generateRandomPrompt(): string {
  const template = promptTemplates[Math.floor(Math.random() * promptTemplates.length)];
  const topic = topics[Math.floor(Math.random() * topics.length)];
  return template.replace('{topic}', topic);
}

// 배치 데이터 생성 및 저장
async function createBatchData(count: number) {
  try {
    console.log(`Creating ${count} test prompts in database 'mcp-demo-database'...`);
    let totalCreated = 0;

    // 배치 단위로 처리
    while (totalCreated < count) {
      let batch = db.batch();
      let batchCount = 0;
      const remainingCount = count - totalCreated;
      const currentBatchSize = Math.min(500, remainingCount);

      console.log(`Preparing batch of ${currentBatchSize} documents...`);

      for (let i = 0; i < currentBatchSize; i++) {
        const docRef = db.collection('prompts').doc();
        batch.set(docRef, {
          text: generateRandomPrompt(),
          status: 'pending',
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          metadata: {
            isTest: true,
            createdAt: new Date().toISOString()
          }
        });

        batchCount++;
      }

      console.log(`Committing batch ${Math.ceil((totalCreated + batchCount) / 500)} of ${Math.ceil(count / 500)}...`);
      await batch.commit();
      totalCreated += batchCount;
      console.log(`Progress: ${totalCreated}/${count} documents created`);
    }

    console.log(`Successfully created ${totalCreated} test prompts!`);
  } catch (error) {
    console.error('Error creating batch data:', error);
  } finally {
    // Firebase 연결 종료
    await admin.app().delete();
    process.exit(0);
  }
}

// 실행할 테스트 데이터 수 지정
const TEST_DATA_COUNT = process.argv[2] ? parseInt(process.argv[2]) : 10;
console.log(`Starting to create ${TEST_DATA_COUNT} test prompts...`);
createBatchData(TEST_DATA_COUNT);
