// import * as admin from "firebase-admin";
//
// admin.initializeApp();
// const db = admin.firestore();
// db.settings({ databaseId: 'mcp-demo-database' });
//
// export { inviteCouple } from "./couple/invite";
// export { acceptCoupleInvite } from "./couple/accept";
// export { unlinkCouple } from "./couple/unlink";
// export { register } from "./auth/register";
// export { login } from "./auth/login";
// export { createEmotion } from "./emotions/createEmotion";
// export { updateEmotion } from "./emotions/updateEmotion";
// export { deleteEmotion } from "./emotions/deleteEmotion";
// export { getEmotionAdvice } from "./emotions/getEmotionAdvice";
// export { updateDailyTips } from './daily-tips/controller';


import * as admin from "firebase-admin";
import { config } from './config';

// Firebase 초기화
const initializeFirebase = () => {
    try {
        admin.initializeApp();
        const db = admin.firestore();
        db.settings({
            databaseId: config.firebase.databaseId,
            ignoreUndefinedProperties: true
        });

        console.log('Firebase 초기화 완료');
    } catch (error) {
        console.error('Firebase 초기화 실패:', error);
        throw error;
    }
};

// 앱 초기화
initializeFirebase();

// Auth 관련 Functions
export { register } from "./auth/controllers/register";
export { login } from "./auth/controllers/login";

// Couple 관련 Functions
export {
    inviteCouple,
    acceptCoupleInvite,
    unlinkCouple
} from "./couple/controllers";

// Emotion 관련 Functions
export {
    createEmotion,
    updateEmotion,
    deleteEmotion,
    getEmotionAdvice
} from "./emotions/controllers";

// Daily Tips 관련 Functions
export { updateDailyTips } from './daily-tips/controllers';
