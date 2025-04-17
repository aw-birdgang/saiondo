import axios from 'axios';
import * as functions from 'firebase-functions';

export async function callClaude(prompt: string): Promise<string> {
    const apiKey = functions.config().anthropic?.key;
    if (!apiKey) {
        functions.logger.error("❌ Anthropic API 키가 없습니다.");
        throw new Error('Anthropic API 키가 설정 되어 있지 않습니다.');
    }

    try {
        const res = await axios.post(
            'https://api.anthropic.com/v1/messages',
            {
                model: 'claude-3-5-sonnet-20240620',
                max_tokens: 1024,
                temperature: 0.5,
                system: "You are a software engineer assistant who helps with Node.js code.",
                messages: [{ role: 'user', content: prompt }],
            },
            {
                headers: {
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                    'content-type': 'application/json',
                },
            }
        );
        functions.logger.info("📩 Claude 응답 원문:", JSON.stringify(res.data, null, 2));
        const content = res.data?.content?.[0]?.text;
        if (!content || typeof content !== 'string') {
            functions.logger.error("❌ Claude 응답에 요약 텍스트 없음", res.data);
            throw new Error('요약 결과가 응답에 없습니다.');
        }

        return content;
    } catch (err: any) {
        const status = err.response?.status;
        const data = err.response?.data;
        const message = err.message;

        functions.logger.error('🔥 Claude API 호출 실패', {
            status,
            data,
            message,
        });

        throw new Error('Claude 호출 실패');
    }
}
