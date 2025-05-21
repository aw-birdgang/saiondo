from services.llm_provider import llm_provider

class CoupleAnalysisService:
    def analyze(self, prompt: str) -> str:
        return llm_provider.ask(prompt)

couple_analysis_service = CoupleAnalysisService()
