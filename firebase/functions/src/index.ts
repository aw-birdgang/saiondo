import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();
db.settings({ databaseId: 'mcp-demo-database' });

export { inviteCouple } from "./couple/invite";
export { acceptCoupleInvite } from "./couple/accept";
export { unlinkCouple } from "./couple/unlink";
export { register } from "./auth/register";
export { login } from "./auth/login";
export { createEmotion } from "./emotions/createEmotion";
export { updateEmotion } from "./emotions/updateEmotion";
export { deleteEmotion } from "./emotions/deleteEmotion";
export { getEmotionAdvice } from "./emotions/getEmotionAdvice";
export { updateDailyTips } from './daily-tips/controller';
