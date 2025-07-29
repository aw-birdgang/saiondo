from enum import Enum


class EmotionExpression(str, Enum):
    affection = "애정 표현"
    frustration = "짜증, 실망, 좌절"
    anxiety = "불안, 걱정, 불신"
    gratitude = "감사 표현"
    jealousy = "질투, 비교"
    resentment = "분노, 억울함"
    loneliness = "외로움 표현"
    sadness = "슬픔 표현"


class SelfAssertion(str, Enum):
    request = "요청, 바람"
    complaint = "불만, 비판"
    boundaries = "한계 설정"
    expectation = "기대 표현"
    reproach = "질책, 비난"
    withdrawal = "거리 두기 선언"


class RelationshipAttitude(str, Enum):
    accommodating = "양보, 이해"
    withdrawing = "회피, 침묵"
    confronting = "직면, 문제 제기"
    reconnecting = "관계 회복 시도"
    testing = "상대 반응 시험"


class CommunicationStyle(str, Enum):
    question = "질문"
    explanation = "이유 설명"
    silence = "단답/무응답"
    passive_aggressive = "비꼬기, 간접적 비판"
    repetition = "같은 말 반복"
    meta_conversation = "대화 자체에 대한 이야기"


class AttachmentPattern(str, Enum):
    secure = "신뢰 기반의 안정형"
    anxious = "불안형, 거절에 민감"
    avoidant = "회피형, 감정 억제"
    fearful = "불안 + 회피 혼합형"
    ambivalent = "모순적 태도"


class TopicContext(str, Enum):
    attention = "관심 부족 관련"
    trust = "신뢰, 거짓말 의심"
    commitment = "관계의 확신, 미래 관련"
    jealousy_related = "질투, 제3자 관련"
    emotional_needs = "감정적 지지 요구"
    routine_checkin = "일상적 체크"
