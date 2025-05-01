[ Flutter App (Mobile/Web) ]
|
REST API (HTTPS, Auth)
↓
┌──────────────────────┐
│      NestJS API      │  ← 사용자 인증, 라우팅, 결제 등
└──────────────────────┘
|
┌───────────┴───────────┐
↓                       ↓
[ LLM Proxy Module ]     [ Other API (User, Billing...) ]
↓
┌───────────────────────────┐
│  Python FastAPI + LangChain│  ← GPT 호출, RAG, 분석
└───────────────────────────┘
↓
[ Vector DB / OpenAI / Claude ]


