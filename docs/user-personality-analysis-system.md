# 🧠 SAIONDO 유저 성향 파악 시스템 가이드

SAIONDO 프로젝트에서 **유저의 성향을 파악하기 위한 모든 기능**과  
각 분석 항목별 **시스템 아키텍처/시퀀스**를 정리한 문서입니다.  
AI 기반 분석, MBTI, 소통 스타일, 사랑의 언어 등 다양한 관점에서 유저의 성향을 종합적으로 분석하여  
개인화된 커플 케어 서비스를 제공하는 시스템을 설명합니다.

---

## 📖 목차

- [1. AI 기반 대화 분석](#1-ai-기반-대화-분석)
- [2. MBTI 성향 분석](#2-mbti-성향-분석)
- [3. 소통 스타일 분석](#3-소통-스타일-분석)
- [4. 사랑의 언어 분석](#4-사랑의-언어-분석)
- [5. 성향 프로필 시스템](#5-성향-프로필-시스템)
- [6. 관계 분석 리포트](#6-관계-분석-리포트)
- [7. AI 챗봇 기반 성향 탐지](#7-ai-챗봇-기반-성향-탐지)
- [8. 행동 패턴 분석](#8-행동-패턴-분석)
- [9. 감정 상태 분석](#9-감정-상태-분석)
- [10. 성향 기반 피드백 시스템](#10-성향-기반-피드백-시스템)
- [11. 기술적 구현 및 API 설계](#11-기술적-구현-및-api-설계)
- [12. 데이터 흐름 및 연동](#12-데이터-흐름-및-연동)
- [13. 시스템 통합 아키텍처](#13-시스템-통합-아키텍처)
- [14. 참고/연계 문서](#14-참고연계-문서)

---

## 1. AI 기반 대화 분석

### 주요 기능
- 실시간 채팅/상담 대화에서 LLM을 통한 성향 추출
- 대화 패턴, 감정 표현, 소통 방식 등 분석
- 관계 코치 AI를 통한 상대방 성향 추론 및 피드백

### 필요 API/요소
- `POST /api/personality/analyze-conversation`
- 대화 데이터 전처리, 프롬프트 생성, LLM 호출, 결과 파싱
- 분석 결과 DB 저장, 피드백 생성

### API Request/Response 예시

#### Request
POST /api/personality/analyze-conversation
```json
{
  "userId": "user-123",
  "partnerId": "partner-456",
  "messages": [
    {
      "sender": "user",
      "text": "오늘 회사에서 정말 힘들었어. 너무 스트레스 받아.",
      "timestamp": "2024-01-15T14:30:00Z"
    },
    {
      "sender": "partner",
      "text": "무슨 일이 있었어? 내가 들어줄게.",
      "timestamp": "2024-01-15T14:31:00Z"
    },
    {
      "sender": "user",
      "text": "상사가 또 까다롭게 굴어서... 그래도 네가 이렇게 들어주니까 기분이 좋아져.",
      "timestamp": "2024-01-15T14:32:00Z"
    }
  ]
}
```

#### Response
```json
{
  "personalityTraits": {
    "emotional_expression": "high",
    "communication_style": "direct",
    "stress_coping": "seeks_support",
    "appreciation_expression": "high"
  },
  "feedback": "감정을 솔직하게 표현하는 것이 좋습니다. 상대방의 공감적 반응에 대한 감사 표현도 잘 하고 있어요.",
  "score": 0.87
}
```

### 시스템 시퀀스 다이어그램
![AI 기반 대화 분석 시퀀스](../assets/images/personality/ai-conversation-analysis-seq.png)

---

## 2. MBTI 성향 분석

### 주요 기능
- 16가지 MBTI 유형 분류 및 궁합 분석
- 유형별 소통 팁, 강점/약점 도출

### 필요 API/요소
- `POST /api/personality/analyze-mbti`
- 설문/대화 기반 MBTI 추론, 궁합 분석, 결과 저장

### API Request/Response 예시

#### Request
POST /api/personality/analyze-mbti
```json
{
  "userId": "user-123",
  "data": {
    "answers": [
      {
        "question": "새로운 사람들과 만나는 것이 즐겁다",
        "answer": 4,
        "scale": 1-5
      },
      {
        "question": "혼자 있는 시간이 필요하다",
        "answer": 2,
        "scale": 1-5
      },
      {
        "question": "구체적인 사실보다는 가능성을 선호한다",
        "answer": 5,
        "scale": 1-5
      },
      {
        "question": "논리적 판단보다는 감정적 판단을 한다",
        "answer": 4,
        "scale": 1-5
      }
    ],
    "conversation_samples": [
      "미래에 대해 이야기하는 것을 좋아해",
      "사람들과 함께 있을 때 에너지를 얻어"
    ]
  }
}
```

#### Response
```json
{
  "mbti": "ENFP",
  "description": "열정적이고 창의적인 성향으로, 새로운 가능성을 추구하며 사람들과의 연결을 중요시합니다.",
  "match": {
    "best": ["INFJ", "INTJ"],
    "good": ["ENFJ", "ENTJ"],
    "challenging": ["ISTJ", "ESTJ"]
  },
  "strengths": [
    "창의적 사고",
    "공감 능력",
    "적응력"
  ],
  "weaknesses": [
    "일상적 업무",
    "감정적 불안정성"
  ]
}
```

### 시스템 시퀀스 다이어그램
![MBTI 성향 분석 시퀀스](../assets/images/personality/mbti-analysis-seq.png)

---

## 3. 소통 스타일 분석

### 주요 기능
- 직접/간접, 논리/감정, 적극/소극 등 소통 패턴 분석
- 커플 간 소통 스타일 차이 및 개선 방안 제시

### 필요 API/요소
- `POST /api/personality/analyze-communication`
- 대화 데이터 기반 소통 패턴 추출, 개선 피드백

### API Request/Response 예시

#### Request
POST /api/personality/analyze-communication
```json
{
  "userId": "user-123",
  "messages": [
    {
      "sender": "user",
      "text": "우리 오늘 저녁 뭐 먹을까?",
      "timestamp": "2024-01-15T18:00:00Z"
    },
    {
      "sender": "partner",
      "text": "음... 뭐가 좋을까?",
      "timestamp": "2024-01-15T18:01:00Z"
    },
    {
      "sender": "user",
      "text": "피자 어때? 아니면 치킨?",
      "timestamp": "2024-01-15T18:02:00Z"
    },
    {
      "sender": "partner",
      "text": "둘 다 괜찮아. 네가 정해.",
      "timestamp": "2024-01-15T18:03:00Z"
    },
    {
      "sender": "user",
      "text": "그럼 피자로 하자!",
      "timestamp": "2024-01-15T18:04:00Z"
    }
  ]
}
```

#### Response
```json
{
  "style": "direct_emotional",
  "description": "직접적이고 감정을 표현하는 소통 스타일입니다. 의사결정을 주도적으로 하며 명확한 의견을 제시합니다.",
  "feedback": "상대방의 의견을 더 적극적으로 물어보고, 함께 결정하는 과정을 즐겨보세요.",
  "patterns": {
    "decision_making": "dominant",
    "emotional_expression": "high",
    "conflict_resolution": "direct"
  },
  "improvement_suggestions": [
    "상대방의 의견을 먼저 물어보기",
    "감정 표현 시 상대방의 반응 고려하기"
  ]
}
```

### 시스템 시퀀스 다이어그램
![소통 스타일 분석 시퀀스](../assets/images/personality/communication-style-analysis-seq.png)

---

## 4. 사랑의 언어 분석

### 주요 기능
- 5가지 사랑의 언어(말, 행동, 선물, 시간, 스킨십) 분석
- 커플 간 호환성, 효과적 사랑 표현법 제안

### 필요 API/요소
- `POST /api/personality/analyze-love-language`
- 대화/행동 데이터 기반 사랑의 언어 추론, 결과 저장

### API Request/Response 예시

#### Request
POST /api/personality/analyze-love-language
```json
{
  "userId": "user-123",
  "data": {
    "actions": [
      "상대방에게 '사랑해'라고 자주 말함",
      "상대방을 위해 요리함",
      "상대방과 함께 영화를 봄",
      "상대방에게 선물을 줌",
      "상대방을 안아줌"
    ],
    "conversations": [
      "네가 있어서 행복해",
      "오늘 저녁 같이 먹자",
      "이 선물 마음에 들어?",
      "너무 보고 싶었어"
    ],
    "preferences": {
      "verbal_affirmation": 5,
      "acts_of_service": 4,
      "receiving_gifts": 3,
      "quality_time": 5,
      "physical_touch": 4
    }
  }
}
```

#### Response
```json
{
  "mainLanguage": "quality_time",
  "description": "함께 있는 시간을 가장 중요하게 여기며, 대화와 공유 활동을 통해 사랑을 표현합니다.",
  "match": {
    "best": ["verbal_affirmation", "physical_touch"],
    "worst": ["receiving_gifts"]
  },
  "expression_methods": [
    "함께 취미 활동하기",
    "깊이 있는 대화 나누기",
    "공동 목표 설정하기"
  ],
  "score": {
    "quality_time": 0.9,
    "verbal_affirmation": 0.8,
    "physical_touch": 0.7,
    "acts_of_service": 0.6,
    "receiving_gifts": 0.4
  }
}
```

### 시스템 시퀀스 다이어그램
![사랑의 언어 분석 시퀀스](../assets/images/personality/love-language-analysis-seq.png)

---

## 5. 성향 프로필 시스템

### 주요 기능
- 유저별 성향 정보 통합 관리
- 성향 변화 이력, 선호 활동, 관계 목표 등 기록

### 필요 API/요소
- `GET/PUT /api/personality/profile`
- 성향 정보 CRUD, 이력 관리, 추천 연동

### API Request/Response 예시

#### GET Request
```http
GET /api/personality/profile?userId=user-123
```

#### GET Response
```json
{
  "userId": "user-123",
  "personalityTraits": {
    "mbti": "ENFP",
    "communication_style": "direct_emotional",
    "love_language": "quality_time",
    "emotional_expression": "high"
  },
  "preferences": {
    "activities": ["영화 감상", "산책", "요리"],
    "communication": ["직접적 대화", "감정 공유"],
    "conflict_resolution": "즉시 해결"
  },
  "relationship_goals": [
    "더 깊은 정서적 연결",
    "함께 성장하기",
    "상호 이해 증진"
  ],
  "history": [
    {
      "date": "2024-01-15",
      "analysis_type": "conversation",
      "changes": ["감정 표현 증가"]
    }
  ]
}
```

#### PUT Request
PUT /api/personality/profile
```json
{
  "userId": "user-123",
  "categoryCodeId": "MBTI",
  "content": "ENFP",
  "isStatic": false,
  "source": "AI_ANALYSIS",
  "confidenceScore": 0.85
}
```

#### PUT Response
```json
{
  "id": "profile-456",
  "userId": "user-123",
  "categoryCodeId": "MBTI",
  "content": "ENFP",
  "isStatic": false,
  "source": "AI_ANALYSIS",
  "confidenceScore": 0.85,
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### 시스템 시퀀스 다이어그램
![성향 프로필 시스템 시퀀스](../assets/images/personality/profile-system-seq.png)

---

## 6. 관계 분석 리포트

### 주요 기능
- MBTI, 소통 스타일, 사랑의 언어 등 종합 분석
- 커플 궁합 점수, 강점/개선점, 맞춤형 조언 제공

### 필요 API/요소
- `GET /api/personality/relationship-report`
- 종합 분석 워크플로우, 리포트 생성/저장

### API Request/Response 예시

#### Request
```http
GET /api/personality/relationship-report?channelId=channel-789
```

#### Response
```json
{
  "channelId": "channel-789",
  "reportDate": "2024-01-15T10:00:00Z",
  "coupleProfile": {
    "user1": {
      "userId": "user-123",
      "mbti": "ENFP",
      "communication_style": "direct_emotional",
      "love_language": "quality_time"
    },
    "user2": {
      "userId": "user-456",
      "mbti": "INFJ",
      "communication_style": "reflective_caring",
      "love_language": "verbal_affirmation"
    }
  },
  "compatibility": {
    "overall_score": 0.85,
    "mbti_compatibility": 0.9,
    "communication_compatibility": 0.8,
    "love_language_compatibility": 0.85
  },
  "strengths": [
    "서로의 감정을 잘 이해함",
    "깊이 있는 대화 가능",
    "상호 보완적 성향"
  ],
  "improvement_areas": [
    "의사결정 과정에서 더 많은 소통 필요",
    "일상적 스킨십 증가"
  ],
  "recommendations": [
    "주간 관계 체크인 시간 만들기",
    "함께 새로운 취미 활동 시작하기",
    "감사 표현 빈도 증가"
  ],
  "relationship_insights": {
    "current_phase": "deepening",
    "growth_potential": "high",
    "challenges": ["일상적 소통 부족"]
  }
}
```

### 시스템 시퀀스 다이어그램
![관계 분석 리포트 시퀀스](../assets/images/personality/relationship-report-seq.png)

---

## 7. AI 챗봇 기반 성향 탐지

### 주요 기능
- 챗봇과의 자연스러운 대화로 성향 탐지
- 감정 상태, 행동 패턴, 관계 동적 분석

### 필요 API/요소
- `POST /api/personality/chatbot-detect`
- 대화형 프롬프트, 실시간 성향 추론, 피드백 제공

### API Request/Response 예시

#### Request
POST /api/personality/chatbot-detect
```json
{
  "userId": "user-123",
  "messages": [
    {
      "sender": "user",
      "text": "안녕하세요! 오늘 기분이 어때요?",
      "timestamp": "2024-01-15T09:00:00Z"
    },
    {
      "sender": "chatbot",
      "text": "안녕하세요! 저는 항상 좋아요. 당신은 어떠세요?",
      "timestamp": "2024-01-15T09:01:00Z"
    },
    {
      "sender": "user",
      "text": "저도 좋아요! 오늘 파트너와 데이트를 할 예정이에요.",
      "timestamp": "2024-01-15T09:02:00Z"
    },
    {
      "sender": "chatbot",
      "text": "와, 정말 기대되겠네요! 어떤 계획이 있으세요?",
      "timestamp": "2024-01-15T09:03:00Z"
    },
    {
      "sender": "user",
      "text": "영화를 보고 맛있는 저녁을 먹을 거예요. 파트너가 좋아하는 음식점으로 갈 예정이에요.",
      "timestamp": "2024-01-15T09:04:00Z"
    }
  ]
}
```

#### Response
```json
{
  "detectedTraits": {
    "personality": {
      "optimism": "high",
      "planning": "structured",
      "consideration": "high",
      "excitement_expression": "moderate"
    },
    "relationship_style": {
      "thoughtfulness": "high",
      "shared_activities": "preferred",
      "partner_focus": "high"
    }
  },
  "feedback": "파트너를 생각하는 마음이 정말 아름다워요. 함께하는 시간을 소중히 여기는 모습이 보입니다.",
  "confidence": 0.82,
  "suggestions": [
    "파트너의 반응도 함께 공유해보세요",
    "데이트 후 감정을 정리해보는 시간을 가져보세요"
  ]
}
```

### 시스템 시퀀스 다이어그램
![AI 챗봇 기반 성향 탐지 시퀀스](../assets/images/personality/ai-chatbot-personality-detection-seq.png)

---

## 8. 행동 패턴 분석

### 주요 기능
- 앱 사용/활동 데이터 기반 간접 성향 분석
- 선호도, 참여도, 시간대별 패턴 등 추론

### 필요 API/요소
- `POST /api/personality/analyze-behavior`
- 행동 데이터 수집/분석, 추천 연동

### API Request/Response 예시

#### Request
POST /api/personality/analyze-behavior
```json
{
  "userId": "user-123",
  "data": {
    "logs": [
      {
        "action": "login",
        "timestamp": "2024-01-15T08:00:00Z",
        "context": "morning"
      },
      {
        "action": "send_message",
        "timestamp": "2024-01-15T12:30:00Z",
        "context": "lunch_break"
      },
      {
        "action": "view_profile",
        "timestamp": "2024-01-15T18:00:00Z",
        "context": "evening"
      },
      {
        "action": "send_gift",
        "timestamp": "2024-01-15T20:00:00Z",
        "context": "evening"
      },
      {
        "action": "read_advice",
        "timestamp": "2024-01-15T22:00:00Z",
        "context": "night"
      }
    ],
    "patterns": {
      "active_hours": ["08:00-09:00", "12:00-13:00", "18:00-22:00"],
      "favorite_features": ["messaging", "gifts", "advice"],
      "engagement_frequency": "daily"
    }
  }
}
```

#### Response
```json
{
  "pattern": "evening_engaged",
  "description": "저녁 시간대에 가장 활발하게 활동하며, 파트너와의 소통과 관계 개선에 관심이 많습니다.",
  "recommendation": "아침 시간에도 짧은 인사 메시지를 보내보세요. 하루를 시작하는 파트너의 기분을 좋게 해줄 수 있어요.",
  "behavioral_insights": {
    "communication_preference": "evening",
    "relationship_focus": "high",
    "self_improvement": "active"
  },
  "suggestions": [
    "아침 인사 메시지 보내기",
    "주간 관계 체크인 설정",
    "새로운 소통 방법 시도"
  ],
  "engagement_score": 0.78
}
```

### 시스템 시퀀스 다이어그램
![행동 패턴 분석 시퀀스](../assets/images/personality/behavior-pattern-analysis-seq.png)

---

## 9. 감정 상태 분석

### 주요 기능
- 대화/상담에서 감정 상태 및 변화 추적
- 스트레스, 기분 변화, 감정 기반 지원

### 필요 API/요소
- `POST /api/personality/analyze-emotion`
- 감정 분석 프롬프트, 결과 저장/피드백

### API Request/Response 예시

#### Request
POST /api/personality/analyze-emotion
```json
{
  "userId": "user-123",
  "messages": [
    {
      "sender": "user",
      "text": "요즘 너무 바빠서 스트레스 받아.",
      "timestamp": "2024-01-15T10:00:00Z"
    },
    {
      "sender": "partner",
      "text": "힘들겠다. 내가 도와줄 수 있는 게 있을까?",
      "timestamp": "2024-01-15T10:01:00Z"
    },
    {
      "sender": "user",
      "text": "그냥 들어주기만 해도 고마워. 너가 있어서 다행이야.",
      "timestamp": "2024-01-15T10:02:00Z"
    },
    {
      "sender": "partner",
      "text": "언제든 말해. 내가 여기 있을게.",
      "timestamp": "2024-01-15T10:03:00Z"
    },
    {
      "sender": "user",
      "text": "고마워. 이제 조금 나아진 것 같아.",
      "timestamp": "2024-01-15T10:04:00Z"
    }
  ]
}
```

#### Response
```json
{
  "emotion": "stressed_but_supported",
  "description": "현재 스트레스 상태이지만 파트너의 지원으로 안정감을 느끼고 있습니다.",
  "feedback": "스트레스 상황에서 파트너에게 도움을 요청하는 것은 건강한 관계의 증거입니다. 충분한 휴식도 잊지 마세요.",
  "emotion_timeline": [
    {
      "timestamp": "2024-01-15T10:00:00Z",
      "emotion": "stressed",
      "intensity": 0.8
    },
    {
      "timestamp": "2024-01-15T10:02:00Z",
      "emotion": "grateful",
      "intensity": 0.6
    },
    {
      "timestamp": "2024-01-15T10:04:00Z",
      "emotion": "relieved",
      "intensity": 0.4
    }
  ],
  "support_suggestions": [
    "규칙적인 휴식 시간 확보",
    "파트너와의 스트레스 공유",
    "스트레스 해소 활동 찾기"
  ],
  "relationship_impact": "positive"
}
```

### 시스템 시퀀스 다이어그램
![감정 상태 분석 시퀀스](../assets/images/personality/emotion-analysis-seq.png)

---

## 10. 성향 기반 피드백 시스템

### 주요 기능
- 실시간/정기 피드백, 성장 추천, 관계 개선 제안
- 대화/활동/리포트 기반 맞춤 피드백

### 필요 API/요소
- `POST /api/personality/feedback`
- 피드백 엔진, 추천 시스템, 결과 저장

### API Request/Response 예시

#### Request
POST /api/personality/feedback
```json
{
  "userId": "user-123",
  "partnerId": "partner-456",
  "data": {
    "context": "recent_conversation_decrease",
    "analysis_results": {
      "conversation_frequency": "decreased",
      "message_length": "shorter",
      "emotional_expression": "reduced"
    },
    "relationship_phase": "comfortable",
    "stress_factors": ["work_pressure", "routine_fatigue"]
  }
}
```

#### Response
```json
{
  "feedback": "최근 대화가 줄어든 것은 자연스러운 현상일 수 있어요. 하지만 서로의 감정을 자주 확인해보는 것이 좋겠습니다.",
  "recommendation": "주간 관계 체크인 시간을 만들어보세요. 서로의 하루와 감정을 공유하는 시간을 가져보세요.",
  "personalized_suggestions": [
    {
      "type": "daily_ritual",
      "suggestion": "매일 저녁 10분씩 서로의 하루를 공유하는 시간 가지기",
      "reason": "정기적인 소통으로 관계 유지"
    },
    {
      "type": "activity",
      "suggestion": "함께 새로운 취미 활동 시작하기",
      "reason": "새로운 경험으로 관계 활성화"
    },
    {
      "type": "communication",
      "suggestion": "감사 표현 빈도 늘리기",
      "reason": "긍정적 감정 강화"
    }
  ],
  "progress_tracking": {
    "current_score": 0.7,
    "target_score": 0.85,
    "improvement_areas": ["communication_frequency", "emotional_sharing"]
  },
  "next_check_in": "2024-01-22T10:00:00Z"
}
```

### 시스템 시퀀스 다이어그램
![성향 기반 피드백 시스템 시퀀스](../assets/images/personality/personality-feedback-system-seq.png)

---

## 11. 기술적 구현 및 API 설계

### 공통 요소
- **프론트엔드(Flutter)**: 입력/분석 요청, 결과 표시, 프로필/리포트 UI
- **API 서버(NestJS)**: 분석 요청/결과 관리, DB 연동, 피드백/추천 엔진
- **LLM 서버(FastAPI)**: 프롬프트 생성, LLM 호출(OpenAI/Claude), 결과 파싱
- **DB(PostgreSQL)**: 성향/분석/이력/추천 데이터 저장
- **AI 서비스**: OpenAI, Claude, LangChain 등

### API 설계 예시
```http
POST /api/personality/analyze-conversation
{
  "userId": "...",
  "partnerId": "...",
  "messages": [ ... ]
}
→
{
  "personalityTraits": { ... },
  "feedback": "...",
  "score": 0.87
}
```
- 각 분석 항목별로 별도 API/엔드포인트 설계 권장

---

## 12. 데이터 흐름 및 연동

1. **데이터 수집**: 대화, 설문, 행동, 감정 등 다양한 데이터 수집
2. **분석 요청**: 프론트 → API → LLM → AI 서비스
3. **분석 결과 저장**: API 서버가 DB에 결과 저장
4. **피드백/추천 제공**: 분석 결과 기반 실시간/정기 피드백, 추천 제공
5. **프로필/리포트 관리**: 유저별 성향/이력/리포트 통합 관리

---

## 13. 시스템 통합 아키텍처

SAIONDO의 성향 분석 시스템은 다음과 같은 통합 아키텍처로 구성됩니다:

![SAIONDO Personality Analysis System Architecture](../assets/images/personality/personality-analysis-system-architecture.png)

### 🏗️ 아키텍처 구성 요소

#### **Frontend Layer (Flutter App)**
- **사용자 인터페이스**: 직관적이고 반응형 UI/UX
- **성향 분석 요청**: 다양한 분석 모듈에 대한 요청 처리
- **결과 표시**: 분석 결과를 시각적이고 이해하기 쉽게 표현
- **프로필 관리**: 사용자 성향 정보 및 이력 관리

#### **API Gateway Layer (NestJS)**
- **요청 라우팅**: 각 분석 모듈로의 요청 분배
- **인증/인가**: 사용자 권한 검증 및 보안 관리
- **데이터 검증**: 입력 데이터의 유효성 검사
- **응답 포맷팅**: 일관된 API 응답 형식 제공

#### **AI Analysis Layer (FastAPI)**
- **프롬프트 생성**: 각 분석 유형에 맞는 최적화된 프롬프트 생성
- **LLM 호출 관리**: OpenAI, Claude 등 외부 AI 서비스 연동
- **결과 파싱**: AI 응답을 구조화된 데이터로 변환
- **에러 처리**: AI 서비스 장애 시 대체 로직 및 복구

#### **Personality Analysis Modules**
- **MBTI Analysis**: 16가지 성향 유형 분류 및 궁합 분석
- **Communication Style**: 소통 패턴 및 스타일 분석
- **Love Language**: 5가지 사랑의 언어 분석
- **Emotion Analysis**: 감정 상태 및 변화 추적
- **Behavior Pattern**: 사용자 행동 패턴 분석

#### **External AI Services**
- **OpenAI GPT**: 고성능 언어 모델 활용
- **Claude AI**: 대안 AI 서비스로 안정성 확보
- **LangChain**: 프롬프트 관리 및 워크플로우 최적화

#### **Data Layer (PostgreSQL)**
- **사용자 프로필**: 개인별 성향 정보 저장
- **분석 결과**: 각 분석 모듈의 결과 데이터
- **대화 이력**: 성향 분석을 위한 대화 데이터
- **피드백 데이터**: 사용자 피드백 및 개선 사항

#### **Feedback System**
- **실시간 피드백**: 즉시적인 분석 결과 및 조언 제공
- **정기 리포트**: 주간/월간 성향 변화 및 관계 분석
- **추천 엔진**: 개인화된 활동 및 개선 방안 제안

### 📊 데이터 흐름

1. **사용자 요청** → Flutter App에서 분석 요청
2. **API 처리** → NestJS 서버에서 요청 검증 및 라우팅
3. **AI 분석** → FastAPI 서버에서 LLM 호출 및 결과 처리
4. **데이터 저장** → PostgreSQL에 분석 결과 및 이력 저장
5. **피드백 생성** → 분석 결과 기반 맞춤형 피드백 생성
6. **결과 전달** → 사용자에게 시각화된 결과 및 조언 제공

### ✨ 시스템 특징

- **모듈화 설계**: 각 분석 모듈이 독립적으로 동작하며 확장 가능
- **실시간 처리**: 대화 기반 실시간 성향 분석 및 피드백
- **개인화**: 사용자별 맞춤형 분석 및 추천 시스템
- **확장성**: 새로운 분석 모듈 추가 시 기존 시스템에 영향 최소화
- **안정성**: 다중 AI 서비스 연동으로 서비스 안정성 확보

이 아키텍처를 통해 **개인화된 커플 케어 서비스**를 제공하며,  
각 분석 결과가 서로 연동되어 **종합적인 관계 인사이트**를 제공합니다.

---

## 14. 참고/연계 문서

- [SAIONDO 전체 아키텍처](../README.md#🚀-시스템-아키텍처-전체-구조)
- [LLM 서버 문서](../backend/llm/README.md)
- [API 서버 문서](../backend/api/README.md)
- [Flutter 앱 문서](../frontend/app/README.md)
- [LangSmith 활용 가이드](../backend/llm/docs/langsmith-guide.md)

---

## 📝 최적화/확장 팁

- 각 분석 항목별로 **API/DB/LLM/프론트**의 역할을 명확히 분리
- **프롬프트 엔지니어링**: LLM 분석 정확도 향상을 위한 프롬프트 설계
- **분석 결과 표준화**: 모든 분석 결과를 공통 포맷(JSON 등)으로 관리
- **실시간/정기 피드백**: 이벤트 기반/스케줄 기반 피드백 시스템 병행
- **모듈화/확장성**: 새로운 성향 분석 항목 추가 시, puml/코드/API 구조 일관성 유지
- **테스트/모니터링**: LangSmith 등으로 LLM 분석 품질/트레이싱 강화

---
