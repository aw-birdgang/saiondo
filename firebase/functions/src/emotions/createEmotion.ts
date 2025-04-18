// functions/src/emotions/createEmotion.ts
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const db = admin.firestore();

export const createEmotion = functions
    .region('asia-northeast3')
    .https.onCall(async (data, context) => {
    const { userId, temperature, emoji, tags, note } = data;

    if (!userId || temperature == null || !emoji || !tags || !Array.isArray(tags)) {
        throw new functions.https.HttpsError("invalid-argument", "필수 항목이 누락되었어요.");
    }

    const doc = {
        userId,
        temperature,
        emoji,
        tags,
        note: note || "",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    try {
        const ref = await db.collection("emotions").add(doc);

        return {
            success: true,
            id: ref.id,
            message: "감정 기록이 저장 되었습니다.",
        };
    } catch (err) {
        console.error("감정 기록 저장 실패:", err);
        throw new functions.https.HttpsError("internal", "감정 기록 저장 중 오류가 발생했어요.");
    }
});
