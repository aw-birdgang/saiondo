# init
````
python3 -m venv venv
source venv/bin/activate

````


# install
````
pip install -r requirements.txt

````


# run
````
uvicorn src.main:src --reload --port 8000
PYTHONPATH=src uvicorn main:app --reload --port 8000

````


# test
````

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
