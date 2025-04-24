import * as functions from 'firebase-functions';

export class AppError extends Error {
    constructor(
        public code: functions.https.FunctionsErrorCode,
        message: string
    ) {
        super(message);
    }
}
