import * as functions from "firebase-functions";
import {RegisterData} from "../types";
import {BaseResponse} from "../../core/type/response";
import {AuthService} from "../service";
import {handleError} from "../../core/error/error-handler";

export const register = functions
    .region('asia-northeast3')
    .https.onCall(async (data: RegisterData, context): Promise<BaseResponse<{ uid: string }>> => {
        try {
            const service = new AuthService();
            const uid = await service.register(data);
            return {
                success: true,
                data: { uid }
            };
        } catch (error) {
            throw handleError(error);
        }
    });
