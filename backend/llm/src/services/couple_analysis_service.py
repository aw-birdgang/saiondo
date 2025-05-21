from services.llm_provider import llm_provider
import json

class CoupleAnalysisService:
    def analyze(self, data: dict) -> dict:
        prompt = f"""
아래는 커플의 정보입니다.
- 유저1: {data['user1_name']}, MBTI: {data['user1_mbti']}, 성별: {data['user1_gender']}
- 유저2: {data['user2_name']}, MBTI: {data['user2_mbti']}, 성별: {data['user2_gender']}
- 기념일: {data.get('anniversary', '미입력')}
- 관계 기간(개월): {data.get('relationship_months', '미입력')}
- 최근 키워드: {data.get('keywords', [])}

이 커플의 현재 상태를 한 문장으로 요약해주고, 조언을 한 문장으로 해주고,
각각의 페르소나(성향/특징)를 한 문장으로 분석해줘.
결과는 아래 JSON 포맷으로 반환해줘.

{{
  "summary": "...",
  "advice": "...",
  "persona1": "...",
  "persona2": "...",
  "keywords": [...]
}}
"""
        model = data.get("model", "openai")
        result = llm_provider.ask(prompt, model)
        try:
            return json.loads(result)
        except Exception:
            return {
                "summary": result,
                "advice": "",
                "persona1": "",
                "persona2": "",
                "keywords": [],
            }

couple_analysis_service = CoupleAnalysisService()
