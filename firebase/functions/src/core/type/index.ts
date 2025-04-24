import * as functions from 'firebase-functions';

export interface BaseResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}
