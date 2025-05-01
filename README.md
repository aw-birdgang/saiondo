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




# pipeline
````
[ 프롬프트 입력 (남 / 여) ]
↓
[NestJS → LLM 서버 POST 요청]
↓
[MCPContext 생성]
↓
[LangGraph 상태머신 실행]
├─ 성향 분석 (TraitAnalysis)
├─ 상호 비교 (MatchAnalysis)
└─ 조언 생성 (AdviceGenerator)
↓
[결과 반환]
````


