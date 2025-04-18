// functions/src/auth/register.ts
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const db = admin.firestore();

export const register = functions
    .region('asia-northeast3')
    .https.onCall(async (data, context) => {
    const { name, email, password, mbti } = data;

    if (!name || !email || !password || !mbti) {
        throw new functions.https.HttpsError("invalid-argument", "모든 항목을 입력해주세요.");
    }

    try {
        // Firebase Auth에 계정 생성
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: name,
        });

        // Firestore에 유저 정보 저장
        await db.collection("users").doc(userRecord.uid).set({
            uid: userRecord.uid,
            name,
            email,
            mbti,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        return { success: true, uid: userRecord.uid };
    } catch (error: any) {
        console.error("회원가입 실패", error);
        throw new functions.https.HttpsError("internal", error.message || "회원가입 중 오류 발생");
    }
});
