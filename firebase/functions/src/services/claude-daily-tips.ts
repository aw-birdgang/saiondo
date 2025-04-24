// firebase/functions/src/services/claude.ts

import axios from 'axios';
import * as functions from 'firebase-functions';
import {AppError} from "../core/error/app-error";
import {BaseService} from "../core/services/base.service";
import {AiAdvice, EmotionAnalysis} from "../daily-tips/types";

interface ClaudeResponse {
    completion: string;
    stop_reason: string;
    model: string;
}

interface ParsedAdvice {
    content: string;
    suggestedActions: string[];
    explanation: string;
}


export class ClaudeService extends BaseService {
    private static instance: ClaudeService;
    private readonly apiKey: string;
    private readonly apiEndpoint: string;
    private readonly model: string = 'claude-3-sonnet-20240229';

    private constructor() {
        super();
        this.apiKey = functions.config().anthropic?.key;
        this.apiEndpoint = 'https://api.anthropic.com/v1/messages';

        if (!this.apiKey) {
            throw new AppError({
                code: 'failed-precondition',
                message: 'Claude API 키가 설정되지 않았습니다.'
            });
        }
    }

    static getInstance(): ClaudeService {
        if (!ClaudeService.instance) {
            ClaudeService.instance = new ClaudeService();
        }
        return ClaudeService.instance;
    }

    async getAdvice(prompt: string): Promise<AiAdvice> {
        try {
            this.logger.info('Claude API 요청', { prompt });

            const response = await this.callClaudeAPI(prompt);
            const parsedAdvice = this.parseClaudeResponse(response);

            this.logger.info('Claude API 응답 파싱 완료', { parsedAdvice });

            return {
                content: parsedAdvice.content,
                suggestedActions: parsedAdvice.suggestedActions,
                explanation: parsedAdvice.explanation
            };
        } catch (error) {
            this.logger.error('Claude API 호출 실패', error);
            throw new AppError({
                code: 'internal',
                message: 'AI 조언 생성 중 오류가 발생했습니다.',
                details: error
            });
        }
    }

    private async callClaudeAPI(prompt: string): Promise<ClaudeResponse> {
        try {
            const response = await axios.post(
                this.apiEndpoint,
                {
                    model: this.model,
                    messages: [{
                        role: 'user',
                        content: this.formatPrompt(prompt)
                    }],
                    max_tokens: 1000,
                    temperature: 0.7
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': this.apiKey,
                        'anthropic-version': '2023-06-01'
                    }
                }
            );

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new AppError({
                    code: 'internal',
                    message: `Claude API 호출 실패: ${error.response?.data?.error?.message || error.message}`,
                    details: error.response?.data
                });
            }
            throw error;
        }
    }

    private formatPrompt(basePrompt: string): string {
        return `
당신은 커플 관계 전문 상담가입니다. 다음 상황에 대해 공감적이고 실용적인 조언을 제공해주세요.

상황:
${basePrompt}

다음 형식으로 응답해주세요:
1. 메인 조언 (한 문단)
2. 구체적인 행동 제안 (3-5개의 bullet points)
3. 추가 설명 (한 문단)

응답은 따뜻하고 공감적인 톤을 유지하면서, 실천 가능한 구체적인 조언을 포함해야 합니다.
`;
    }

    private parseClaudeResponse(response: ClaudeResponse): ParsedAdvice {
        try {
            const text = response.completion;
            const sections = text.split('\n\n');

            // 기본 응답 형식
            let parsedResponse: ParsedAdvice = {
                content: '',
                suggestedActions: [],
                explanation: ''
            };

            // 메인 조언 추출
            const mainAdviceMatch = sections[0]?.match(/메인 조언:?\s*(.*)/i);
            if (mainAdviceMatch) {
                parsedResponse.content = mainAdviceMatch[1].trim();
            }

            // 행동 제안 추출
            const actionSection = sections.find(s => s.includes('행동 제안') || s.includes('구체적인 행동'));
            if (actionSection) {
                const actions = actionSection.split('\n')
                    .filter(line => line.match(/^[•\-\*]\s/))
                    .map(line => line.replace(/^[•\-\*]\s/, '').trim());
                parsedResponse.suggestedActions = actions;
            }

            // 추가 설명 추출
            const explanationMatch = text.match(/추가 설명:?\s*(.*)/i);
            if (explanationMatch) {
                parsedResponse.explanation = explanationMatch[1].trim();
            }

            // 기본값 설정
            if (!parsedResponse.content) {
                parsedResponse.content = '파트너의 감정을 이해하고 공감하는 것이 중요합니다.';
            }
            if (parsedResponse.suggestedActions.length === 0) {
                parsedResponse.suggestedActions = ['경청하기', '공감 표현하기', '함께 시간 보내기'];
            }
            if (!parsedResponse.explanation) {
                parsedResponse.explanation = '상대방의 감정을 인정하고 지지해주세요.';
            }

            return parsedResponse;
        } catch (error) {
            this.logger.error('Claude 응답 파싱 실패', error);
            throw new AppError({
                code: 'internal',
                message: 'AI 응답 처리 중 오류가 발생했습니다.',
                details: error
            });
        }
    }

    // 감정 분석 결과를 기반으로 프롬프트 생성
    generateEmotionPrompt(analysis: EmotionAnalysis): string {
        const intensityLevel = this.getIntensityLevel(analysis.intensity);
        const partnerContext = analysis.partnerBehavior
            ? `\n파트너의 행동/반응: ${analysis.partnerBehavior}`
            : '';

        return `
감정 상태: ${analysis.emotion} (강도: ${intensityLevel})
성별: ${analysis.gender}
상황: ${analysis.situation}${partnerContext}

위 상황에서 파트너가 취할 수 있는 가장 적절한 대응 방법을 조언해주세요.
특히 감정의 강도가 ${analysis.intensity}점인 것을 고려하여, 상황에 맞는 구체적인 조언을 제공해주세요.
`;
    }

    private getIntensityLevel(intensity: number): string {
        if (intensity <= 3) return '약함';
        if (intensity <= 6) return '보통';
        return '강함';
    }
}



// export class ClaudeService {
//     private static instance: ClaudeService;
//     private readonly apiKey: string;
//
//     private constructor() {
//         this.apiKey = functions.config().anthropic?.key;
//         if (!this.apiKey) {
//             functions.logger.error("❌ Anthropic API 키가 없습니다.");
//             throw new Error('Anthropic API 키가 설정 되어 있지 않습니다.');
//         }
//     }
//
//     public static getInstance(): ClaudeService {
//         if (!ClaudeService.instance) {
//             ClaudeService.instance = new ClaudeService();
//         }
//         return ClaudeService.instance;
//     }
//
//     async getAdvice(prompt: string) {
//         try {
//             const response = await axios.post(
//                 'https://api.anthropic.com/v1/messages',
//                 {
//                     model: 'claude-3-opus-20240229',
//                     max_tokens: 220,
//                     messages: [{
//                         role: 'user',
//                         content: prompt
//                     }]
//                 },
//                 {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'x-api-key': this.apiKey,
//                         'anthropic-version': '2023-06-01'
//                     }
//                 }
//             );
//
//             const aiResponse = response.data.content[0].text;
//
//             return {
//                 content: aiResponse,
//                 suggestedActions: this.extractSuggestedActions(aiResponse),
//                 explanation: this.extractExplanation(aiResponse)
//             };
//         } catch (error) {
//             console.error('Claude API Error:', error);
//             throw new Error('AI 조언 생성 중 오류가 발생 했습니다.');
//         }
//     }
//
//     private extractSuggestedActions(response: string): string[] {
//         // AI 응답에서 제안된 행동 추출 로직
//         return [];
//     }
//
//     private extractExplanation(response: string): string {
//         // AI 응답에서 설명 부분 추출 로직
//         return '';
//     }
// }
