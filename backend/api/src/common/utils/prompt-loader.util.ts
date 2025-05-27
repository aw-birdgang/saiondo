import * as fs from 'fs';
import * as path from 'path';

let promptCache: Record<string, string> | null = null;

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
