# Saiondo LLM Server

FastAPI(Python) 기반의 LLM(대형 언어 모델) 연동 서버입니다.

## 📁 주요 구조

# init
```
python3 -m venv venv
source venv/bin/activate

```

# install
```
pip install -r requirements.txt

```


# run
```
uvicorn src.main:src --reload --port 8000
PYTHONPATH=src uvicorn main:app --reload --port 8000

```


##
````
curl -X POST http://localhost:3000/llm/chat \
-H "Content-Type: application/json" \
-d '{"prompt": "요즘 날씨 어때?", "model": "claude"}'

curl -X POST http://localhost:3000/llm/chat \
-H "Content-Type: application/json" \
-d '{"prompt": "GPT야 안녕?", "model": "openai"}'
````


##
````
{
"user_prompt": "나는 감정을 잘 표현하지 않아.",
"partner_prompt": "나는 대화를 통해 감정을 공유하길 원해.",
"user_gender": "male",
"partner_gender": "female",
"model": "openai"
}

curl http://localhost:8000/health

curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "안녕!", "model": "openai"}'

curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "안녕!", "model": "claude"}'

curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "user_prompt": "나는 감정 표현이 서툴고 대화를 많이 하는 걸 좋아하지 않아.",
    "partner_prompt": "나는 대화를 통해 감정을 확인하는 걸 중요하게 생각해.",
    "user_gender": "male",
    "partner_gender": "female",
    "model": "openai",
    "metadata": {
      "sessionId": "b7e23ec2-8d5a-4c2a-9e3b-1e2f3a4b5c6d",
      "user_mbti": "ISTJ",
      "partner_mbti": "ENFP",
      "user_age": 29,
      "relationship_duration_months": 6
    }
}'

````


## 🚀 개발/실행
````
1. 의존성 설치  
   ```sh
   pip install -r requirements.txt
   ```
2. 개발 서버 실행  
   ```sh
   uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
   ```
3. Docker 빌드/실행  
   ```sh
   docker build -t saiondo-llm .
   docker run -p 8000:8000 saiondo-llm
   ```
````

## 🧩 주요 기능
````
- OpenAI 등 외부 LLM API 연동
- /llm/analyze, /llm/chat 등 API 제공
- metadata, roomId 등 확장 필드 지원
````

## 📝 개발 팁
````
- 환경변수(OPENAI_API_KEY 등)는 .env 또는 docker-compose로 주입
- API 서버(`api/`)에서 HTTP로 호출
````


#
````
llm/
├── src/ # FastAPI 엔트리포인트 및 라우터
├── Dockerfile
├── requirements.txt # Python 의존성
└── README.md
````
