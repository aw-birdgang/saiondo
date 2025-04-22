// firebase/functions/src/services/claude.ts

import axios from 'axios';
import * as functions from 'firebase-functions';

export class ClaudeService {
    private static instance: ClaudeService;
    private readonly apiKey: string;

    private constructor() {
        this.apiKey = functions.config().anthropic?.key;
        if (!this.apiKey) {
            functions.logger.error("❌ Anthropic API 키가 없습니다.");
            throw new Error('Anthropic API 키가 설정 되어 있지 않습니다.');
        }
    }

    public static getInstance(): ClaudeService {
        if (!ClaudeService.instance) {
            ClaudeService.instance = new ClaudeService();
        }
        return ClaudeService.instance;
    }

    async getAdvice(prompt: string) {
        try {
            const response = await axios.post(
                'https://api.anthropic.com/v1/messages',
                {
                    model: 'claude-3-opus-20240229',
                    max_tokens: 220,
                    messages: [{
                        role: 'user',
                        content: prompt
                    }]
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': this.apiKey,
                        'anthropic-version': '2023-06-01'
                    }
                }
            );

            const aiResponse = response.data.content[0].text;

            return {
                content: aiResponse,
                suggestedActions: this.extractSuggestedActions(aiResponse),
                explanation: this.extractExplanation(aiResponse)
            };
        } catch (error) {
            console.error('Claude API Error:', error);
            throw new Error('AI 조언 생성 중 오류가 발생 했습니다.');
        }
    }

    private extractSuggestedActions(response: string): string[] {
        // AI 응답에서 제안된 행동 추출 로직
        return [];
    }

    private extractExplanation(response: string): string {
        // AI 응답에서 설명 부분 추출 로직
        return '';
    }
}
