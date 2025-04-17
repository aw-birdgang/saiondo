// functions/src/emotions/updateEmotion.ts
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const updateEmotion = functions
    .region('asia-northeast3')
    .https.onCall(async (data, context) => {
    const { docId, userId, temperature, emoji, tags, note } = data;

    if (!docId || !userId) {
        throw new functions.https.HttpsError("invalid-argument", "docId와 userId는 필수입니다.");
    }

    const updates: any = {};
    if (temperature != null) updates.temperature = temperature;
    if (emoji != null) updates.emoji = emoji;
    if (Array.isArray(tags)) updates.tags = tags;
    if (note != null) updates.note = note;

    try {
        const docRef = admin.firestore().collection("emotions").doc(docId);
        const docSnap = await docRef.get();

        if (!docSnap.exists || docSnap.data()?.userId !== userId) {
            throw new functions.https.HttpsError("not-found", "기록을 찾을 수 없거나 권한이 없습니다.");
        }

        await docRef.update(updates);

        return { success: true, message: "감정 기록이 수정 되었습니다." };
    } catch (err) {
        console.error("감정 수정 오류:", err);
        throw new functions.https.HttpsError("internal", "감정 수정 중 오류가 발생했어요.");
    }
});
