// functions/src/emotions/deleteEmotion.ts
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const deleteEmotion = functions
    .region('asia-northeast3')
    .https.onCall(async (data, context) => {
    const { docId, userId } = data;

    if (!docId || !userId) {
        throw new functions.https.HttpsError("invalid-argument", "docId와 userId는 필수입니다.");
    }

    try {
        const docRef = admin.firestore().collection("emotions").doc(docId);
        const docSnap = await docRef.get();

        if (!docSnap.exists || docSnap.data()?.userId !== userId) {
            throw new functions.https.HttpsError("not-found", "삭제할 기록이 없거나 권한이 없습니다.");
        }

        await docRef.delete();

        return { success: true, message: "감정 기록이 삭제되었습니다." };
    } catch (err) {
        console.error("감정 삭제 오류:", err);
        throw new functions.https.HttpsError("internal", "감정 삭제 중 오류가 발생했어요.");
    }
});
