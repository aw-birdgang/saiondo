import * as functions from 'firebase-functions';
import { DailyTipsService } from '../services/daily-tips.service';
import { UpdateDailyTipsData } from '../types';
import {handleError} from "../../core/error/error-handler";

export const updateDailyTips = functions
    .region('asia-northeast3')
    .https.onCall(async (data: UpdateDailyTipsData, context) => {
        const service = new DailyTipsService();

        try {
            if (!context.auth) {
                throw new functions.https.HttpsError(
                    'unauthenticated',
                    '로그인이 필요한 서비스 입니다.'
                );
            }

            const result = await service.createTip(context.auth.uid, data);

            return {
                success: true,
                data: result
            };
        } catch (error) {
            throw handleError(error);
        }
    });
