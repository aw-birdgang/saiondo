# Firebase Python AI Project

## 구조

```
project-root/
│
├── functions/           # Firebase Functions (Node.js, Firestore 트리거)
│   ├── src/
│   │   ├── index.js
│   │   └── utils.js
│   ├── package.json
│   └── ...
│
├── python_backend/      # Python 백엔드 (LangChain, LangGraph)
│   ├── main.py
│   ├── langchain_pipeline.py
│   ├── firestore_client.py
│   ├── models/
│   │   └── prompt.py
│   ├── services/
│   │   └── analyzer.py
│   ├── tests/
│   │   └── test_pipeline.py
│   ├── requirements.txt
│   └── README.md
│
├── firestore.rules      # Firestore 보안 규칙
├── firebase.json        # Firebase 프로젝트 설정
├── .firebaserc
├── .gitignore
└── README.md
```

## 사용법

1. `functions/`에서 Firebase Functions 배포 및 실행
2. `python_backend/`에서 FastAPI 서버 실행
3. 앱/클라이언트에서 Firestore prompts 컬렉션에 프롬프트 추가
4. 전체 파이프라인이 자동으로 동작

---

각 폴더별 README 참고 