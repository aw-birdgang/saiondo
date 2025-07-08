# 🧑‍🔬 LangSmith (smith.langchain.com) 활용 가이드 - Saiondo LLM 서버 기준

[smith.langchain.com](https://smith.langchain.com/)의 **LangSmith**는  
**LangChain 기반 LLM 애플리케이션의 실시간 트레이싱, 디버깅, 평가, 데이터셋 관리**를 위한 SaaS 플랫폼입니다.

Saiondo의 LLM 서버(backend/llm)는 LangChain 기반 Python 코드로 구현되어 있으며,  
LangSmith 연동을 통해 개발/운영/품질 개선 전 과정에서 LLM 체인 실행을 투명하게 추적·분석할 수 있습니다.

---

## 📌 주요 기능 및 Saiondo에서의 활용

### 1. 트레이싱(Tracing)
- LLM 호출, 체인 실행, 에이전트 동작 등 **모든 과정을 시각화**하여 보여줍니다.
- 각 단계별 입력/출력, 프롬프트, 파라미터, LLM 응답, 토큰 사용량, 에러 등을 한눈에 확인.
- Saiondo LLM 서버의 모든 주요 LLM 호출이 자동 기록되어, 운영 중 문제를 빠르게 파악할 수 있습니다.

### 2. 디버깅(Debugging)
- 트레이스 내역을 클릭하면, **실제 프롬프트/LLM 응답/중간 체인 결과**를 상세하게 볼 수 있습니다.
- 에러 발생 지점, 비효율적 체인, 불필요한 LLM 호출 등을 쉽게 찾을 수 있습니다.

### 3. 평가(Evaluation)
- LLM 응답의 품질을 **자동/수동 평가**할 수 있습니다.
- 예: "이 답변이 적절한가?" 등 기준을 설정해 평가 데이터를 쌓고,  
  Saiondo의 프롬프트/모델 개선에 활용할 수 있습니다.

### 4. 데이터셋 관리(Dataset Management)
- 실제 유저 입력, 테스트 케이스, 평가용 데이터셋을 **LangSmith 대시보드에서 직접 관리**.
- 데이터셋을 기반으로 LLM 체인/프롬프트의 성능을 반복적으로 테스트하고 개선.

### 5. 실시간 모니터링 & 알림
- 운영 중인 서비스의 트래픽, 에러, 토큰 사용량 등을 실시간 모니터링.
- 이상 징후(에러율 급증 등) 발생 시 알림을 받을 수 있습니다.

---

## 🛠️ Saiondo LLM 서버에서의 실제 활용 시나리오

### 개발 단계
- 프롬프트/체인/에이전트 설계 시,  
  LangSmith 트레이싱으로 **입력-출력 흐름을 시각적으로 확인**하며 빠르게 디버깅
- LLM 응답이 기대와 다를 때,  
  어떤 프롬프트/파라미터/컨텍스트에서 문제가 발생했는지 즉시 파악

### 운영/배포 단계
- 실제 유저 요청이 어떻게 처리되는지,  
  **실시간으로 트레이스가 쌓여서 운영 이슈를 빠르게 발견**
- 에러가 발생한 요청의 전체 체인 실행 내역을 확인해,  
  원인 분석 및 빠른 대응 가능

### 품질 개선/평가
- 다양한 입력/상황에서 LLM 응답을 평가하고,  
  **프롬프트/체인/모델 개선의 근거 데이터**로 활용
- 데이터셋을 만들어 반복적으로 테스트,  
  모델/프롬프트의 성능을 수치로 비교

---

## 🖥️ LangSmith 대시보드 주요 화면

- **Traces**:  
  각 LLM 호출/체인 실행의 상세 내역(입력, 출력, 토큰, 에러 등) 리스트 및 상세 페이지
- **Datasets**:  
  평가용 데이터셋 생성/관리, 테스트 실행, 결과 비교
- **Evaluations**:  
  자동/수동 평가 결과, 품질 지표, 개선 이력
- **Projects**:  
  여러 프로젝트(서비스/모델/프롬프트 버전 등)별로 트레이스/데이터셋/평가를 분리 관리

<p align="center">
  <img src="../../assets/images/llm/langsmith-dashboard.png" alt="LangSmith 대시보드 예시" width="700"/>
</p>

---

## 🚀 Saiondo LLM 서버에서 LangSmith 연동 방법

**Python(LangChain)에서 환경변수와 콜백만 추가하면 자동 연동됩니다.**

```python
import os
from langchain_openai import ChatOpenAI
from langchain.callbacks.tracers.langchain import LangChainTracer

os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = "your_langsmith_api_key"
os.environ["LANGCHAIN_PROJECT"] = "saiondo-llm"  # Saiondo 프로젝트명으로 구분

tracer = LangChainTracer()
llm = ChatOpenAI(
    model_name="gpt-3.5-turbo",
    openai_api_key="sk-...",
    callbacks=[tracer],
)
response = llm.invoke("안녕!")
```

- **환경변수**는 `.env` 또는 런타임 환경에서 설정
- Saiondo LLM 서버의 모든 주요 LLM 호출이 LangSmith 대시보드에 자동 기록됨

---

## 🔒 운영/보안 팁

- **API Key 등 민감 정보는 환경변수(.env)로 관리**하고, 코드에 직접 노출하지 마세요.
- 프로젝트별로 `LANGCHAIN_PROJECT`를 구분하면 여러 서비스/버전의 트레이스를 분리 관리할 수 있습니다.
- 트레이스 데이터는 개인정보/민감정보가 포함될 수 있으니, 필요시 마스킹/필터링 처리 권장
- 운영 환경에서는 **불필요한 트레이싱을 비활성화**하거나, 민감 데이터가 노출되지 않도록 주의하세요.

---

## 🧑‍💻 실전 운영/개발 팁

- **트레이스 필터링**: LangSmith 대시보드에서 프로젝트/날짜/에러/토큰 사용량 등으로 필터링 가능
- **체인/프롬프트 개선**: 트레이스와 평가 데이터를 기반으로 프롬프트/체인 구조를 반복적으로 개선
- **자동화**: CI/CD 파이프라인에서 LangSmith 평가 API를 활용해 자동 품질 테스트 가능

---

## ❓ FAQ

- **Q. LangSmith 연동이 안 될 때?**  
  → 환경변수(`LANGCHAIN_TRACING_V2`, `LANGCHAIN_API_KEY`, `LANGCHAIN_PROJECT`)가 올바르게 설정되어 있는지 확인하세요.

- **Q. 트레이스에 민감 정보가 남지 않게 하려면?**  
  → 프롬프트/입력 데이터에서 개인정보를 마스킹하거나, LangChain 콜백에서 커스텀 필터링 로직을 추가하세요.

- **Q. 여러 프로젝트/서비스를 분리 관리하려면?**  
  → `LANGCHAIN_PROJECT` 값을 서비스/환경별로 다르게 지정하세요.

---

## 📚 참고 자료

- 공식 사이트: [https://smith.langchain.com/](https://smith.langchain.com/)
- 공식 문서: [LangSmith Docs](https://docs.smith.langchain.com/)
- LangChain 트레이싱 가이드: [Tracing & Debugging](https://docs.smith.langchain.com/user_guide/tracing/)

---

## 📝 정리

- **LangSmith**는 Saiondo LLM 서버의 **트레이싱, 디버깅, 평가, 데이터 관리**를 위한 강력한 SaaS 플랫폼입니다.
- 개발/운영/품질 개선 전 과정에서 **실시간 가시성**과 **데이터 기반 개선**을 지원합니다.
- LangChain 기반 Python 코드에 환경변수와 콜백만 추가하면 바로 연동할 수 있습니다.

---
