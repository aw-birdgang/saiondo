# python_backend/

LangChain, LangGraph 기반의 AI 분석 Python 백엔드입니다.

- FastAPI 서버로 Firebase Functions에서 HTTP로 호출
- Firestore에 결과 저장

## 실행 방법

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

## 테스트

```bash
python -m unittest discover tests
```


## 1. gcloud CLI 설치 방법

### (1) **macOS (Homebrew 사용)**
```bash
brew install --cask google-cloud-sdk
```

### (2) **직접 설치 (모든 OS)**
- [공식 설치 가이드](https://cloud.google.com/sdk/docs/install) 참고  
- 요약:
  ```bash
  curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-438.0.0-darwin-x86_64.tar.gz
  tar -xzf google-cloud-sdk-438.0.0-darwin-x86_64.tar.gz
  ./google-cloud-sdk/install.sh
  ```

### (3) **설치 후 환경변수 등록**
- 설치가 끝나면, 아래 명령어로 환경변수 등록:
  ```bash
  source ~/google-cloud-sdk/path.bash.inc
  ```

## 2. 설치 확인

```bash
gcloud --version
```
정상적으로 버전이 출력되면 설치 완료입니다.

## 3. 초기 설정

```bash
gcloud init
```
- Google 계정 로그인
- 사용할 프로젝트 선택

## 4. 다시 배포 명령 실행

설치 및 초기화가 끝나면,  
다시 아래 명령어로 Cloud Run 배포를 진행하세요:

```bash
gcloud run deploy python-backend \
  --source . \
  --region asia-northeast3 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars FIRESTORE_DATABASE_ID=mcp-demo-database
```

## 추가 안내
- **brew**가 없다면 [Homebrew 설치](https://brew.sh/index_ko) 후 진행하세요.
- 설치 중 오류가 있으면, 구체적인 에러 메시지를 알려주시면 추가로 도와드릴 수 있습니다.

설치 후에도 문제가 있으면 언제든 질문해 주세요!
