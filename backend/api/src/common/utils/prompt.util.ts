import * as fs from 'fs';
import * as path from 'path';

let promptCache: Record<string, string> | null = null;

/**
 * 프롬프트 템플릿을 환경 변수로 채우는 함수
 */
export function fillPromptTemplate(template: string, params: Record<string, any>): string {
  return template.replace(/{{(.*?)}}/g, (_, key) => {
    const value = params[key.trim()];
    if (typeof value === 'object') return JSON.stringify(value);
    return value ?? '';
  });
}

/**
 * 프롬프트 파일에서 템플릿을 로드하는 함수
 */
export function loadPromptTemplate(key: string): string {
  if (!promptCache) {
    const filePath = path.join(__dirname, '../../prompts/prompt-chat.json');
    if (!fs.existsSync(filePath)) {
      throw new Error(`Prompt file not found: ${filePath}`);
    }
    const file = fs.readFileSync(filePath, 'utf-8');
    promptCache = JSON.parse(file);
  }
  
  if (!promptCache || !(key in promptCache)) {
    throw new Error(`Prompt key "${key}" not found in prompt file`);
  }
  
  return promptCache[key];
}

/**
 * 프롬프트 캐시를 초기화하는 함수 (테스트용)
 */
export function clearPromptCache(): void {
  promptCache = null;
}
