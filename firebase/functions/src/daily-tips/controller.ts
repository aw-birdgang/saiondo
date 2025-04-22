import * as functions from 'firebase-functions';
import {DailyTipsRepository} from './repository';
import {ClaudeService} from '../services/claude-daily-tips';
import {NotificationService} from '../services/notification-daily-tips';
import {generatePrompt} from './prompt';
import {DailyTip, EmotionAnalysis, RequiredInputField, UpdateDailyTipsData, UserData} from './types';
import * as admin from "firebase-admin";

class DailyTipsController {
    private readonly repository: DailyTipsRepository;
    private readonly claudeService: ClaudeService;
    private readonly notificationService: NotificationService;

    constructor() {
        this.repository = DailyTipsRepository.getInstance();
        this.claudeService = ClaudeService.getInstance();
        this.notificationService = NotificationService.getInstance();
    }

    private logInfo(message: string, data?: any) {
        console.log(`[DailyTips] ${message}`, data ? JSON.stringify(data, null, 2) : '');
    }

    private logError(message: string, error?: any) {
        console.error(`[DailyTips Error] ${message}`, error);
    }

    private validateAuth(context: functions.https.CallableContext) {
        if (!context.auth) {
            throw new functions.https.HttpsError(
                'unauthenticated',
                '로그인이 필요한 서비스입니다.'
            );
        }
        return context.auth.uid;
    }

    private async getUserData(userId: string): Promise<UserData> {
        const userData = await this.repository.getUserById(userId) as UserData;
        if (!userData) {
            throw new functions.https.HttpsError(
                'not-found',
                '사용자 정보를 찾을 수 없습니다.'
            );
        }
        return userData;
    }

    private validateUserData(userData: UserData) {
        const missingFields: Array<'coupleId' | 'gender'> = [];
        if (!userData.coupleId) missingFields.push('coupleId');
        if (!userData.gender) missingFields.push('gender');

        if (missingFields.length > 0) {
            throw new functions.https.HttpsError(
                'failed-precondition',
                `필수 사용자 정보(${missingFields.join(', ')})가 없습니다.`
            );
        }
    }

    private validateInputData(data: UpdateDailyTipsData) {
        const missingInputs: RequiredInputField[] = [];

        if (!data.emotion) missingInputs.push('emotion');
        if (!data.situation) missingInputs.push('situation');
        if (data.intensity == null) missingInputs.push('intensity');

        if (missingInputs.length > 0) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                `필수 입력값(${missingInputs.join(', ')})이 누락 되었습니다.`
            );
        }
    }

    private createEmotionAnalysis(userData: UserData, data: UpdateDailyTipsData): EmotionAnalysis {
        return {
            gender: userData.gender as 'male' | 'female',
            emotion: data.emotion,
            intensity: data.intensity,
            situation: data.situation,
            partnerBehavior: data.partnerBehavior || ''
        };
    }

    private createNewTip(
        userData: UserData,
        emotionAnalysis: EmotionAnalysis,
        aiAdvice: any,
        data: UpdateDailyTipsData
    ): Omit<DailyTip, 'id'> {
        return {
            coupleId: userData.coupleId!,
            fromGender: userData.gender as 'male' | 'female',
            toGender: userData.gender === 'male' ? 'female' : 'male',
            userEmotion: emotionAnalysis,
            aiAdvice: {
                content: aiAdvice.content || '',
                suggestedActions: aiAdvice.suggestedActions || [],
                explanation: aiAdvice.explanation || ''
            },
            createdAt: admin.firestore.Timestamp.now(),
            updatedAt: admin.firestore.Timestamp.now(),
            category: data.category || 'general',
            isPrivate: data.isPrivate ?? false
        };
    }

    async handleUpdateDailyTips(data: UpdateDailyTipsData, context: functions.https.CallableContext) {
        try {
            this.logInfo('함수 호출', { data, auth: context.auth });

            // 1. 인증 확인
            const userId = this.validateAuth(context);

            // 2. 사용자 정보 조회 및 검증
            const userData = await this.getUserData(userId);
            this.logInfo('사용자 정보 조회됨', userData);
            this.validateUserData(userData);

            // 3. 입력 데이터 검증
            this.validateInputData(data);

            // 4. 감정 분석 데이터 구성
            const emotionAnalysis = this.createEmotionAnalysis(userData, data);
            this.logInfo('감정 분석 데이터', emotionAnalysis);

            // 5. AI 조언 받기
            const prompt = generatePrompt(emotionAnalysis);
            this.logInfo('생성된 프롬프트', { prompt });

            const aiAdvice = await this.claudeService.getAdvice(prompt);
            this.logInfo('AI 응답', aiAdvice);

            // 6. 데이터 저장
            const newTip = this.createNewTip(userData, emotionAnalysis, aiAdvice, data);
            this.logInfo('저장할 데이터', newTip);

            const docRef = await this.repository.createTip(newTip);
            this.logInfo('데이터 저장 완료', { docId: docRef.id });

            // 7. 알림 전송
            if (!newTip.isPrivate && userData.partnerId) {
                this.logInfo('파트너 알림 전송', { partnerId: userData.partnerId });
                await this.notificationService.notifyPartner(
                    userData.coupleId!,
                    userData.partnerId,
                    emotionAnalysis
                );
            }

            const response = {
                success: true,
                data: {
                    id: docRef.id,
                    ...newTip
                }
            };
            this.logInfo('최종 응답', response);

            return response;

        } catch (error) {
            this.logError('처리 중 오류 발생', {
                error,
                stack: error instanceof Error ? error.stack : undefined,
                message: error instanceof Error ? error.message : '알 수 없는 오류'
            });

            if (error instanceof functions.https.HttpsError) {
                throw error;
            }

            throw new functions.https.HttpsError(
                'internal',
                error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
            );
        }
    }
}

// Firebase Function 정의
export const updateDailyTips = functions
    .region('asia-northeast3')
    .https.onCall(async (data: UpdateDailyTipsData, context) => {
        const controller = new DailyTipsController();
        return controller.handleUpdateDailyTips(data, context);
    });
