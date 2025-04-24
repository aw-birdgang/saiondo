import {EmotionAnalysis} from "../daily-tips/types";

export const generatePrompt = (analysis: EmotionAnalysis): string => {
  const intensityLevel = getIntensityLevel(analysis.intensity);
  const partnerContext = analysis.partnerBehavior
      ? `\n파트너의 행동/반응: ${analysis.partnerBehavior}`
      : '';

  return `
감정 상태: ${analysis.emotion} (강도: ${intensityLevel})
성별: ${analysis.gender}
상황: ${analysis.situation}${partnerContext}

위 상황에서 파트너가 취할 수 있는 가장 적절한 대응 방법을 조언 해주세요.
특히 감정의 강도가 ${analysis.intensity}점인 것을 고려 하여, 상황에 맞는 구체적인 조언을 제공 해주세요.
`;
};

const getIntensityLevel = (intensity: number): string => {
  if (intensity <= 3) return '약함';
  if (intensity <= 6) return '보통';
  return '강함';
};
