from .labels import *
from typing import Dict, List

# 각 카테고리별 키워드 사전
KEYWORDS = {
    "emotion_expression": {
        EmotionExpression.affection: ["사랑해", "보고 싶어", "소중해"],
        EmotionExpression.frustration: ["짜증", "실망", "좌절", "또 이래", "짜증 나"],
        EmotionExpression.anxiety: ["불안", "걱정", "불신", "나 혼자만 노력"],
        EmotionExpression.gratitude: ["고마워", "덕분이야"],
        EmotionExpression.jealousy: ["질투", "비교", "더 자주 연락"],
        EmotionExpression.resentment: ["분노", "억울", "바보 된 기분"],
        EmotionExpression.loneliness: ["외로움", "나 혼자인 것"],
        EmotionExpression.sadness: ["슬픔", "눈물 나네"],
    },
    "self_assertion": {
        SelfAssertion.request: ["시간 좀 보내줄래", "해줄래", "원해", "바래"],
        SelfAssertion.complaint: ["불만", "비판", "항상 자기 생각만 해"],
        SelfAssertion.boundaries: ["한계", "더 이상 이 얘기", "그만하자"],
        SelfAssertion.expectation: ["기대", "챙겨줄 줄 알았어"],
        SelfAssertion.reproach: ["질책", "비난", "네가 잘못했잖아"],
        SelfAssertion.withdrawal: ["거리 두기", "생각할 시간이 필요해"],
    },
    "relationship_attitude": {
        RelationshipAttitude.accommodating: ["네 입장도 알겠어", "이해해"],
        RelationshipAttitude.withdrawing: ["회피", "말 안 할래", "됐고"],
        RelationshipAttitude.confronting: ["직면", "문제 제기", "반드시 하고 넘어가야 해"],
        RelationshipAttitude.reconnecting: ["다시 잘 해보자", "관계 회복"],
        RelationshipAttitude.testing: ["시험", "넌 어떻게 생각해", "그냥 해봤어"],
    },
    "communication_style": {
        CommunicationStyle.question: ["?", "왜", "어디", "뭐해", "언제", "어떻게"],
        CommunicationStyle.explanation: ["때문에", "이유", "있어서", "해서"],
        CommunicationStyle.silence: ["응", "알겠어", "…", "..."],
        CommunicationStyle.passive_aggressive: ["역시 너답네", "그럴 줄 알았어"],
        CommunicationStyle.repetition: ["몇 번이나 말했잖아", "계속 말했잖아"],
        CommunicationStyle.meta_conversation: ["대화가 안 되는 것 같아", "이야기 자체"],
    },
    "attachment_pattern": {
        AttachmentPattern.secure: ["믿어", "신뢰해"],
        AttachmentPattern.anxious: ["싫어진 거야", "불안해", "거절"],
        AttachmentPattern.avoidant: ["됐어", "별일 아냐", "괜찮아"],
        AttachmentPattern.fearful: ["좋아하지만 다치긴 싫어", "불안하면서도"],
        AttachmentPattern.ambivalent: ["좋아하면서도 멀어지고 싶어", "모순적"],
    },
    "topic_context": {
        TopicContext.attention: ["왜 연락 안 해", "관심 없어", "신경 안 써"],
        TopicContext.trust: ["정말 사실대로", "거짓말", "믿어도 돼?"],
        TopicContext.commitment: ["앞으로 어떻게", "확신", "미래"],
        TopicContext.jealousy_related: ["제3자", "걔랑", "다른 사람이랑"],
        TopicContext.emotional_needs: ["안아줬으면", "위로", "지지"],
        TopicContext.routine_checkin: ["밥은 먹었어", "잘 자", "일상"],
    }
}

def label_message(message: str) -> dict:
    """
    입력 메시지에서 각 카테고리별로 키워드가 포함되어 있으면 해당 라벨을 반환
    """
    result = {}
    for category, label_dict in KEYWORDS.items():
        matched = []
        for label, keywords in label_dict.items():
            for kw in keywords:
                if kw in message:
                    matched.append(label.value)
                    break  # 한 라벨에 여러 키워드가 있어도 한 번만 추가
        if matched:
            result[category] = matched
    return result
