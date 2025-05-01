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

````
