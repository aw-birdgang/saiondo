# functions/

Firebase Functions(TypeScript) 폴더입니다.

- Firestore 트리거로 프롬프트 생성 감지
- Python 백엔드로 HTTP 요청 전송

## 주요 명령어

```bash
npm install      # 의존성 설치
npm run build    # TypeScript 빌드
npm run serve    # 로컬 에뮬레이터 실행
npm run deploy   # Firebase Functions 배포
npm run create-test-data
npm run create-test-data:count 50
```

# 먼저 emulator 시작 (새 터미널에서)
firebase emulators:start

# functions 디렉토리에서 테스트 실행 (다른 터미널에서)
cd functions
npm test 

## 환경 설정

### Firebase 서비스 계정 키 설정
1. Firebase Console에서 프로젝트 설정 > 서비스 계정으로 이동
2. "새 비공개 키 생성" 클릭
3. 다운로드된 키 파일을 `service-account.json`으로 이름 변경
4. 프로젝트 루트 디렉토리에 위치 