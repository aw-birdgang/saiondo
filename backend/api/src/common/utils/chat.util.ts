export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * 대화 내역을 토큰 제한에 맞게 구성
 */
export function buildHistory(
  messages: LLMMessage[],
  maxTokens = 3000
): LLMMessage[] {
  const systemMsgs = messages.filter((m) => m.role === 'system');
  let tokenCount = 0;
  const history: LLMMessage[] = [];

  // 최근 메시지부터 거꾸로 추가
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (m.role === 'system') continue; // 이미 포함
    const t = countTokens(m.content);
    if (tokenCount + t > maxTokens) break;
    history.unshift(m);
    tokenCount += t;
  }
  return [...systemMsgs, ...history];
}

/**
 * 간단한 토큰 계산 (실제 서비스는 더 정교한 계산 필요)
 */
export function countTokens(text: string): number {
  // 한글/영문 혼용 기준, 1단어 ≈ 1토큰 근사치
  return text.split(/\s+/).length;
}

/**
 * 대화 내역 요약 함수
 */
export function summarizeChatHistory(chatHistory: string): string {
  const lines = chatHistory.split('\n').filter(line => line.trim());
  const essential = lines.slice(-4); // 최근 2~3 round만
  return essential.join(' ').replace(/\s+/g, ' ');
}

/**
 * JSON 코드 블록에서 JSON 추출
 */
export function extractJsonFromCodeBlock(text: string): any | null {
  const match = text.match(/```json\s*([\s\S]*?)```/);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1]);
    } catch {
      const braceMatch = match[1].match(/{[\s\S]*}/);
      if (braceMatch) {
        try {
          return JSON.parse(braceMatch[0]);
        } catch {
          return null;
        }
      }
      return null;
    }
  }
  
  const braceMatch = text.match(/{[\s\S]*}/);
  if (braceMatch) {
    try {
      return JSON.parse(braceMatch[0]);
    } catch {
      return null;
    }
  }
  return null;
}