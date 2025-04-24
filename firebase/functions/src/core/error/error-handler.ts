import {AppError} from './app-error';
import * as functions from 'firebase-functions';

export const handleError = (error: unknown): functions.https.HttpsError => {
    console.error('Error occurred:', error);

    if (error instanceof AppError) {
        return error.toHttpsError();
    }

    if (error instanceof Error) {
        return new functions.https.HttpsError('internal', error.message);
    }

    return new functions.https.HttpsError('internal', 'An unexpected error occurred');
};
