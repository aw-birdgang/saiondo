import { BaseService } from "../core/services/base.service";
import { ClaudeService } from "../services/claude-daily-tips";
import { EmotionRepository } from "./repository";
import { Emotion, CreateEmotionData } from "./types";
import {AppError} from "../core/error/app-error";

export class EmotionService extends BaseService {
    private repository: EmotionRepository;
    private claudeService: ClaudeService;

    constructor() {
        super();
        this.repository = EmotionRepository.getInstance();
        this.claudeService = ClaudeService.getInstance();
    }

    private validateEmotionData(data: CreateEmotionData): void {
        if (!data.emotion) {
            throw new AppError({
                code: 'invalid-argument',
                message: '감정을 입력 해주세요.'
            });
        }

        if (data.intensity < 0 || data.intensity > 10) {
            throw new AppError({
                code: 'invalid-argument',
                message: '감정 강도는 0에서 10 사이의 값 이어야 합니다.'
            });
        }

        if (!data.situation) {
            throw new AppError({
                code: 'invalid-argument',
                message: '상황을 입력 해주세요.'
            });
        }

        if (!data.date) {
            throw new AppError({
                code: 'invalid-argument',
                message: '날짜를 입력해주세요.'
            });
        }
    }

    async createEmotion(userId: string, data: CreateEmotionData): Promise<Emotion> {
        try {
            this.validateEmotionData(data);
            const user = await this.repository.findById(userId);
            if (!user) {
                throw new AppError({
                    code: 'not-found',
                    message: '사용자 를 찾을 수 없습니다.'
                });
            }
            const emotion = await this.repository.createEmotion({
                userId,
                ...data,
            });
            this.logger.info('감정 데이터 생성 완료', { emotionId: emotion.id });
            return emotion;
        } catch (error) {
            this.logger.error('감정 데이터 생성 실패', error);
            throw error;
        }
    }
}
