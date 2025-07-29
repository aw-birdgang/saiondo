import json
from typing import Optional

from core.labeling.rule_engine import KEYWORDS, label_message
from schemas.labeling import HistoryMessage, SingleMessageRequest
from services.llm_provider import llm_provider


def build_labeling_prompt(categories: dict, messages: list) -> str:
    """
    카테고리, 키워드, 메시지 목록을 LLM이 이해하기 쉽게 프롬프트로 만듦
    """
    prompt = "다음은 채팅 메시지 라벨링 작업입니다.\n"
    prompt += "카테고리와 키워드:\n"
    for cat, label_dict in categories.items():
        prompt += f"- {cat}:\n"
        for label, keywords in label_dict.items():
            prompt += f"  * {label.value}: {', '.join(keywords)}\n"
    prompt += "\n메시지 목록:\n"
    for i, msg in enumerate(messages):
        prompt += f"{i+1}. ({msg.sender}) {msg.text}\n"
    prompt += "\n각 메시지에 대해 해당되는 카테고리별 라벨을 JSON 형식으로 반환해 주세요."
    return prompt


class LabelingService:
    @staticmethod
    def label_with_llm(messages: list, model: Optional[str] = None) -> dict:
        """
        LLM을 이용한 메시지(히스토리) 라벨링
        """
        prompt = build_labeling_prompt(KEYWORDS, messages)
        llm_response = llm_provider.ask(prompt, model=model)
        try:
            result = json.loads(llm_response)
        except Exception:
            result = {"error": "LLM 응답 파싱 실패", "raw": llm_response}
        return result

    @staticmethod
    def label_single_message(request: SingleMessageRequest) -> dict:
        """
        단일 메시지 룰 기반 라벨링
        """
        labels = label_message(request.text)
        return {"sender": request.sender, "text": request.text, "labels": labels}

    @staticmethod
    def label_message_history(messages: list[HistoryMessage]) -> list:
        """
        메시지 히스토리 룰 기반 라벨링
        """
        results = []
        for msg in messages:
            labels = label_message(msg.text)
            results.append({"sender": msg.sender, "text": msg.text, "labels": labels})
        return results

    @staticmethod
    def label_single_message_llm(
        request: SingleMessageRequest, model: Optional[str] = None
    ) -> dict:
        """
        단일 메시지 LLM 기반 라벨링
        """
        prompt = build_labeling_prompt(KEYWORDS, [request])
        llm_response = llm_provider.ask(prompt, model=model)
        try:
            result = json.loads(llm_response)
        except Exception:
            result = {"error": "LLM 응답 파싱 실패", "raw": llm_response}
        return result

    @staticmethod
    def label_message_history_llm(
        messages: list[HistoryMessage], model: Optional[str] = None
    ) -> dict:
        """
        메시지 히스토리 LLM 기반 라벨링
        """
        prompt = build_labeling_prompt(KEYWORDS, messages)
        llm_response = llm_provider.ask(prompt, model=model)
        try:
            result = json.loads(llm_response)
        except Exception:
            result = {"error": "LLM 응답 파싱 실패", "raw": llm_response}
        return result
