import * as functions from 'firebase-functions';
import {AppError} from "../error";

export const validateAuth = (context: functions.https.CallableContext): string => {
    if (!context.auth) {
        throw new AppError('unauthenticated', '로그인이 필요한 서비스입니다.');
    }
    return context.auth.uid;
};
