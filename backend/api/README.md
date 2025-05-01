##
````
curl -X POST http://localhost:3000/llm/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "요즘 날씨 어때?", "model": "claude"}'

curl -X POST http://localhost:3000/llm/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "GPT야 안녕?", "model": "openai"}'
````
