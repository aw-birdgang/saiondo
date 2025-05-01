import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class LlmService {
    private readonly llmApiUrl = 'http://localhost:8000/chat';

    async forwardToLLM(prompt: string): Promise<any> {
        try {
            const response = await axios.post(this.llmApiUrl, { prompt });
            return response.data;
        } catch (error) {
            console.error('LLM 서버 호출 실패:', error.message);
            throw new Error('LLM 응답 실패');
        }
    }
}
