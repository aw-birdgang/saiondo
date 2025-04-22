import { EmotionAnalysis } from './types';

export function generatePrompt(analysis: EmotionAnalysis): string {
  const genderContext = analysis.gender === 'male' ?
    '남성이 여성 파트너에게 느끼는' :
    '여성이 남성 파트너에게 느끼는';

  return `
당신은 연인 관계 전문 상담가입니다. ${genderContext} 감정과 상황에 대해 분석하고 조언해주세요.

상황:
- 감정: ${analysis.emotion}
- 감정 강도: ${analysis.intensity}/5
- 구체적 상황: ${analysis.situation}
- 파트너의 행동: ${analysis.partnerBehavior}

다음 형식으로 응답해주세요:
1. 감정 분석: 현재 감정과 그 원인에 대한 분석
2. 파트너의 관점: 파트너가 이 상황을 어떻게 보고 있을지에 대한 분석
3. 구체적 조언: 상황 개선을 위한 실천적 조언
4. 대화 제안: 파트너와 나눌 수 있는 대화 예시

응답은 공감적이고 건설적이며, 실천 가능한 내용으로 작성해주세요.
`;
}
