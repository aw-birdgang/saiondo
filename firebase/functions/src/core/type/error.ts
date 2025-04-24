import * as functions from 'firebase-functions';

export type ErrorCode = functions.https.FunctionsErrorCode;

export interface AppErrorData {
    code: ErrorCode;
    message: string;
    details?: any;
}
