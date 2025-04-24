import * as functions from 'firebase-functions';
import {AppErrorData, ErrorCode} from "../type/error";

export class AppError extends Error {
    public readonly code: ErrorCode;
    public readonly details?: any;

    constructor(errorData: AppErrorData) {
        super(errorData.message);
        this.code = errorData.code;
        this.details = errorData.details;
        Error.captureStackTrace(this, this.constructor);
    }

    toHttpsError(): functions.https.HttpsError {
        return new functions.https.HttpsError(this.code, this.message, this.details);
    }
}
