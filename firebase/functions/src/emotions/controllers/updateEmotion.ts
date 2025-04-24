import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const db = admin.firestore();

export const updateEmotion = functions
    .region('asia-northeast3')
    .https.onCall(async (data, context) => {

    console.log('updateEmotion 함수 호출됨');
    console.log('요청 데이터:', JSON.stringify(data, null, 2));
    console.log('인증 컨텍스트:', context.auth ? {
        uid: context.auth.uid,
        token: context.auth.token
    } : 'Not authenticated');

    const { docId, userId, temperature, emoji, tags, note } = data;
    if (!docId || !userId) {
        console.error('필수 파라미터 누락:', { docId, userId });
        throw new functions.https.HttpsError(
            "invalid-argument",
            "docId와 userId는 필수 입니다."
        );
    }

    const updates: any = {};
    if (temperature != null) updates.temperature = temperature;
    if (emoji != null) updates.emoji = emoji;
    if (Array.isArray(tags)) updates.tags = tags;
    if (note != null) updates.note = note;

    updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();
    console.log('업데이트 할 데이터:', JSON.stringify(updates, null, 2));

    try {
        const docRef = db.collection("emotions").doc(docId);
        const docSnap = await docRef.get();
        if (!docSnap.exists) {
            console.error('문서를 찾을 수 없음:', docId);
            throw new functions.https.HttpsError("not-found", "감정 기록을 찾을 수 없습니다.");
        }

        const docData = docSnap.data();
        if (docData?.userId !== userId) {
            console.error('권한 없음:', {documentUserId: docData?.userId, requestUserId: userId
            });
            throw new functions.https.HttpsError("permission-denied", "이 기록에 대한 수정 권한이 없습니다.");
        }

        // 5. 문서 업데이트
        console.log('문서 업데이트 시작:', docId);
        await docRef.update(updates);
        console.log('문서 업데이트 완료');

        // 6. 성공 응답
        const response = {
            success: true,
            message: "감정 기록이 수정 되었습니다.",
            updatedFields: Object.keys(updates)
        };
        console.log('응답 데이터:', JSON.stringify(response, null, 2));

        return response;
    } catch (err) {
        console.error("감정 수정 중 오류 발생:", {
            error: err,
            stack: err instanceof Error ? err.stack : undefined,
            docId,
            userId
        });
        if (err instanceof functions.https.HttpsError) {
            throw err;
        }
        throw new functions.https.HttpsError(
            "internal",
            "감정 수정 중 오류가 발생 했습니다. 잠시 후 다시 시도 해 주세요."
        );
    }
});
