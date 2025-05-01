# init
````
mkdir llm_service
cd llm_service
python3 -m venv venv
source venv/bin/activate

````


# install
````
pip install fastapi uvicorn langchain openai pydantic python-dotenv

pip install -r requirements.txt

````


# run
````
uvicorn src.main:src --reload --port 8000
PYTHONPATH=src uvicorn main:app --reload --port 8000

````


# test
````
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "안녕!", "model": "openai"}'

curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "안녕!", "model": "claude"}'

curl http://localhost:8000/health

````
