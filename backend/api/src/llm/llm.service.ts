import {Injectable} from '@nestjs/common';
import axios from 'axios';
import {ConfigService} from "@nestjs/config";
import {AllConfigType} from "../config/config.type";

@Injectable()
export class LlmService {
    private readonly llmApiUrl: string;

    constructor(
        private readonly configService: ConfigService<AllConfigType>,
    ) {
        this.llmApiUrl = configService.getOrThrow('common', { infer: true }).llmApiUrl;
    }

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
