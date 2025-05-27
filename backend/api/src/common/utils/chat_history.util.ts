export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

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

// 간단한 토큰 계산 (실제 서비스는 더 정교한 계산 필요)
export function countTokens(text: string): number {
    // 한글/영문 혼용 기준, 1단어 ≈ 1토큰 근사치
    return text.split(/\s+/).length;
  }
