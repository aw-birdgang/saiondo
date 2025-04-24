import * as admin from 'firebase-admin';
import {BaseService} from '../../core/services/base.service';
import {AiAdvice, DailyTip, EmotionAnalysis, UpdateDailyTipsData, UserData} from '../types';
import {DailyTipsRepository} from "../repository";
import {ClaudeService} from "../../services/claude-daily-tips";
import {NotificationService} from "../../services/notification-daily-tips";
import {generatePrompt} from "../../utils/prompt";
import {AppError} from "../../core/error/app-error";

export class DailyTipsService extends BaseService {
    private repository: DailyTipsRepository;
    private claudeService: ClaudeService;
    private notificationService: NotificationService;

    constructor() {
        super();
        this.repository = DailyTipsRepository.getInstance();
        this.claudeService = ClaudeService.getInstance();
        this.notificationService = NotificationService.getInstance();
    }

    async createTip(userId: string, data: UpdateDailyTipsData): Promise<DailyTip> {
        try {
            // 1. 사용자 데이터 조회 및 검증
            const userData = await this.getUserData(userId);
            this.validateUserData(userData);
            this.validateInputData(data);

            // 2. 감정 분석 데이터 생성
            const emotionAnalysis = this.createEmotionAnalysis(userData, data);
            this.logger.info('감정 분석 데이터 생성', emotionAnalysis);

            // 3. AI 조언 받기
            const prompt = generatePrompt(emotionAnalysis);
            const aiAdvice = await this.claudeService.getAdvice(prompt);
            this.logger.info('AI 조언 생성 완료', aiAdvice);

            // 4. 데이터 저장
            const newTip = this.createNewTip(userData, emotionAnalysis, aiAdvice, data);
            const savedTip = await this.repository.createTip(newTip);
            this.logger.info('데이터 저장 완료', { tipId: savedTip.id });

            // 5. 파트너 알림 전송
            if (!newTip.isPrivate && userData.partnerId) {
                await this.notificationService.notifyPartner(
                    userData.coupleId!,
                    userData.partnerId,
                    emotionAnalysis
                );
                this.logger.info('파트너 알림 전송 완료', { partnerId: userData.partnerId });
            }

            return savedTip;
        } catch (error) {
            this.logger.error('일일 팁 생성 실패', error);
            throw error;
        }
    }

    private async getUserData(userId: string): Promise<UserData> {
        const userData = await this.repository.getUserData(userId);
        if (!userData) {
            throw new AppError({
                code: 'not-found',
                message: '사용자를 찾을 수 없습니다.'
            });
        }
        return userData;
    }

    private validateUserData(userData: UserData): void {
        if (!userData.gender) {
            throw new AppError({
                code: 'failed-precondition',
                message: '사용자의 성별 정보가 없습니다.'
            });
        }

        if (!userData.coupleId) {
            throw new AppError({
                code: 'failed-precondition',
                message: '커플 연결이 필요합니다.'
            });
        }
    }

    private validateInputData(data: UpdateDailyTipsData): void {
        if (!data.emotion || !data.situation || data.intensity == null) {
            throw new AppError({
                code: 'invalid-argument',
                message: '감정, 상황, 강도는 필수 입력값 입니다.'
            });
        }

        if (data.intensity < 0 || data.intensity > 10) {
            throw new AppError({
                code: 'invalid-argument',
                message: '감정 강도는 0에서 10 사이의 값이어야 합니다.'
            });
        }
    }

    private createEmotionAnalysis(userData: UserData, data: UpdateDailyTipsData): EmotionAnalysis {
        return {
            gender: userData.gender,
            emotion: data.emotion,
            intensity: data.intensity,
            situation: data.situation,
            partnerBehavior: data.partnerBehavior
        };
    }

    private createNewTip(
        userData: UserData,
        emotionAnalysis: EmotionAnalysis,
        aiAdvice: AiAdvice,
        data: UpdateDailyTipsData
    ): Omit<DailyTip, 'id'> {
        return {
            coupleId: userData.coupleId!,
            fromGender: userData.gender,
            toGender: userData.gender === 'male' ? 'female' : 'male',
            userEmotion: emotionAnalysis,
            aiAdvice,
            category: data.category || 'general',
            isPrivate: data.isPrivate ?? false,
            createdAt: admin.firestore.Timestamp.now(),
            updatedAt: admin.firestore.Timestamp.now(),
        };
    }
}
