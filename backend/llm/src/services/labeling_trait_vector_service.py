from core.labeling.rule_engine import KEYWORDS
from schemas.labeling_trait_vector import (
    ChatMessage, LabeledMessage, TraitVector, LabelingTraitVectorRequest, LabelingTraitVectorResponse
)
from services.llm_provider import llm_provider
from collections import Counter
import json

def build_labeling_and_summary_prompt(categories: dict, messages: list[ChatMessage]) -> str:
    """
    카테고리, 키워드, 메시지 목록을 LLM이 이해하기 쉽게 프롬프트로 만듦
    """
    prompt = "다음은 채팅 메시지 라벨링 및 성향 해석 작업입니다.\n"
    prompt += "카테고리와 키워드:\n"
    for cat, label_dict in categories.items():
        prompt += f"- {cat}:\n"
        for label, keywords in label_dict.items():
            prompt += f"  * {label.value}: {', '.join(keywords)}\n"
    prompt += "\n메시지 목록:\n"
    for i, msg in enumerate(messages):
        prompt += f"{i+1}. ({msg.sender}) {msg.text}\n"
    prompt += (
        "\n1. 각 메시지에 대해 아래와 같은 JSON 리스트 형식으로 라벨링 결과를 반환해 주세요:\n"
        "[\n"
        "  {\"sender\": \"male\", \"text\": \"...\", \"labels\": { ... }},\n"
        "  ...\n"
        "]\n"
        "2. 위 라벨링 결과를 바탕으로, 감정/의사소통/애착/특징을 3~5문장으로 한국어로 요약해 주세요.\n"
        "응답은 아래와 같은 JSON 형식으로 해주세요:\n"
        "{\n"
        "  \"labeled_messages\": [ ... ],\n"
        "  \"llm_summary\": \"...\"\n"
        "}\n"
    )
    return prompt

class LabelingTraitVectorService:
    @staticmethod
    def label_trait_vector(request: LabelingTraitVectorRequest) -> LabelingTraitVectorResponse:
        # 1. LLM을 통한 메시지 라벨링 + 요약 (한 번에)
        prompt = build_labeling_and_summary_prompt(KEYWORDS, request.messages)
        llm_response = llm_provider.ask(prompt)
        try:
            llm_result = json.loads(llm_response)
            labeled_messages_raw = llm_result.get("labeled_messages", [])
            llm_summary = llm_result.get("llm_summary", "")
        except Exception:
            # fallback: 라벨링 실패시 빈 라벨로 채움
            labeled_messages_raw = [
                {
                    "sender": msg.sender,
                    "text": msg.text,
                    "labels": {}
                } for msg in request.messages
            ]
            llm_summary = "LLM 요약 생성 실패"

        # LabeledMessage 객체로 변환
        labeled_messages = [
            LabeledMessage(
                sender=msg.get("sender", ""),
                text=msg.get("text", ""),
                labels=msg.get("labels", {})
            )
            for msg in labeled_messages_raw
        ]

        # 2. TraitVector 산출 (코드로 계산)
        trait_vector = LabelingTraitVectorService.compute_trait_vector(
            user_id=request.user_id,
            labeled_messages=labeled_messages
        )

        # 3. summary는 LLM 결과 사용
        summary = {"llm_summary": llm_summary}

        return LabelingTraitVectorResponse(
            labeled_messages=labeled_messages,
            trait_vector=trait_vector,
            summary=summary
        )

    @staticmethod
    def compute_trait_vector(user_id: str, labeled_messages: list[LabeledMessage]) -> TraitVector:
        n = len(labeled_messages)
        if n == 0:
            raise ValueError("No messages to analyze.")

        # 카운터 초기화
        emotion_counter = Counter()
        assertion_counter = Counter()
        attitude_counter = Counter()
        comm_counter = Counter()
        attach_counter = Counter()
        reconnection_attempts = 0

        for msg in labeled_messages:
            labels = msg.labels
            # 감정 표현
            for k in [
                "affection", "gratitude", "frustration", "anxiety",
                "jealousy", "loneliness", "sadness", "resentment"
            ]:
                if k in labels.get("emotion_expression", []):
                    emotion_counter[k] += 1

            # 자기 주장/관계 태도
            if "request" in labels.get("self_assertion", []):
                assertion_counter["request"] += 1
            if "complaint" in labels.get("self_assertion", []):
                assertion_counter["complaint"] += 1
            if "expectation" in labels.get("self_assertion", []):
                assertion_counter["expectation"] += 1
            if "boundaries" in labels.get("self_assertion", []):
                assertion_counter["boundaries"] += 1
            if "reproach" in labels.get("self_assertion", []):
                assertion_counter["reproach"] += 1
            if "accommodating" in labels.get("relationship_attitude", []):
                attitude_counter["accommodation"] += 1
            if "withdrawing" in labels.get("relationship_attitude", []):
                attitude_counter["withdrawal"] += 1
            if "confronting" in labels.get("relationship_attitude", []):
                attitude_counter["confrontation"] += 1
            if "reconnecting" in labels.get("relationship_attitude", []):
                reconnection_attempts += 1

            # 의사소통 스타일
            if "explanation" in labels.get("communication_style", []):
                comm_counter["explanation"] += 1
            if "question" in labels.get("communication_style", []):
                comm_counter["question"] += 1
            if "silence" in labels.get("communication_style", []):
                comm_counter["silence"] += 1
            if "meta_conversation" in labels.get("communication_style", []):
                comm_counter["meta_conversation"] += 1
            if "passive_aggressive" in labels.get("communication_style", []):
                comm_counter["passive_aggressive"] += 1
            if "repetition" in labels.get("communication_style", []):
                comm_counter["repetition"] += 1

            # 애착 유형
            for k in ["secure", "anxious", "avoidant", "fearful", "ambivalent"]:
                if k in labels.get("attachment_pattern", []):
                    attach_counter[k] += 1

        def ratio(cnt): return cnt / n if n else 0.0

        affection_level = ratio(emotion_counter["affection"])
        gratitude_level = ratio(emotion_counter["gratitude"])
        frustration_level = ratio(emotion_counter["frustration"])
        anxiety_level = ratio(emotion_counter["anxiety"])
        jealousy_level = ratio(emotion_counter["jealousy"])
        loneliness_level = ratio(emotion_counter["loneliness"])
        sadness_level = ratio(emotion_counter["sadness"])
        resentment_level = ratio(emotion_counter["resentment"])

        request_tendency = ratio(assertion_counter["request"])
        complaint_tendency = ratio(assertion_counter["complaint"])
        expectation_level = ratio(assertion_counter["expectation"])
        boundaries_level = ratio(assertion_counter["boundaries"])
        reproach_level = ratio(assertion_counter["reproach"])
        accommodation_level = ratio(attitude_counter["accommodation"])
        withdrawal_level = ratio(attitude_counter["withdrawal"])
        confrontation_level = ratio(attitude_counter["confrontation"])

        explanation_ratio = ratio(comm_counter["explanation"])
        questioning_rate = ratio(comm_counter["question"])
        silence_ratio = ratio(comm_counter["silence"])
        meta_conversation_ratio = ratio(comm_counter["meta_conversation"])
        passive_aggressive_ratio = ratio(comm_counter["passive_aggressive"])
        repetition_ratio = ratio(comm_counter["repetition"])

        secure_ratio = ratio(attach_counter["secure"])
        anxious_ratio = ratio(attach_counter["anxious"])
        avoidant_ratio = ratio(attach_counter["avoidant"])
        fearful_ratio = ratio(attach_counter["fearful"])
        ambivalent_ratio = ratio(attach_counter["ambivalent"])

        attach_types = {
            "secure": secure_ratio,
            "anxious": anxious_ratio,
            "avoidant": avoidant_ratio,
            "fearful": fearful_ratio,
            "ambivalent": ambivalent_ratio
        }
        attachment_style = max(attach_types, key=attach_types.get) if n else "unknown"

        dominant_emotion = max(emotion_counter, key=emotion_counter.get) if emotion_counter else "none"
        dominant_communication = max(comm_counter, key=comm_counter.get) if comm_counter else "none"

        emotion_values = [affection_level, gratitude_level, frustration_level, anxiety_level,
                          jealousy_level, loneliness_level, sadness_level, resentment_level]
        emotional_stability_score = 1.0 - (max(emotion_values) - min(emotion_values))
        expression_openness_score = min(1.0, affection_level + request_tendency + explanation_ratio + questioning_rate)

        return TraitVector(
            user_id=user_id,
            message_count=n,
            affection_level=affection_level,
            gratitude_level=gratitude_level,
            frustration_level=frustration_level,
            anxiety_level=anxiety_level,
            jealousy_level=jealousy_level,
            loneliness_level=loneliness_level,
            sadness_level=sadness_level,
            resentment_level=resentment_level,
            request_tendency=request_tendency,
            complaint_tendency=complaint_tendency,
            expectation_level=expectation_level,
            boundaries_level=boundaries_level,
            reproach_level=reproach_level,
            accommodation_level=accommodation_level,
            withdrawal_level=withdrawal_level,
            confrontation_level=confrontation_level,
            reconnection_attempts=reconnection_attempts,
            explanation_ratio=explanation_ratio,
            questioning_rate=questioning_rate,
            silence_ratio=silence_ratio,
            meta_conversation_ratio=meta_conversation_ratio,
            passive_aggressive_ratio=passive_aggressive_ratio,
            repetition_ratio=repetition_ratio,
            secure_ratio=secure_ratio,
            anxious_ratio=anxious_ratio,
            avoidant_ratio=avoidant_ratio,
            fearful_ratio=fearful_ratio,
            ambivalent_ratio=ambivalent_ratio,
            attachment_style=attachment_style,
            dominant_emotion=dominant_emotion,
            dominant_communication=dominant_communication,
            emotional_stability_score=emotional_stability_score,
            expression_openness_score=expression_openness_score
        )
