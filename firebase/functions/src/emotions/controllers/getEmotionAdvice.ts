import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { callClaude } from "../../services/claude";

const db = admin.firestore();

export const getEmotionAdvice = functions
    .region('asia-northeast3')
    .https.onCall(async (data, context) => {
    const { userId, partnerId } = data;

    if (!userId || !partnerId) {
        throw new functions.https.HttpsError("invalid-argument", "userId와 partnerId는 필수 입니다.");
    }

    try {
        const getLogs = async (id: string) => {
            const snapshot = await db
                .collection("emotion_logs")
                .where("userId", "==", id)
                .orderBy("date", "desc")
                .limit(5)
                .get();

            return snapshot.docs.map((doc) => doc.data());
        };

        const [userLogs, partnerLogs] = await Promise.all([
            getLogs(userId),
            getLogs(partnerId),
        ]);

        const prompt = `
당신은 따뜻하고 공감 가득한 커플 상담가입니다.

아래는 두 사람의 최근 감정 기록입니다.

[나의 기록]
${userLogs.map(log => `• ${log.date}: ${log.emoji} (${log.temperature}°) - ${log.note}`).join("\n")}

[상대방의 기록]
${partnerLogs.map(log => `• ${log.date}: ${log.emoji} (${log.temperature}°) - ${log.note}`).join("\n")}

위 내용을 바탕으로 관계 유지 및 감정 소통을 위한 조언을 따뜻한 말투로 3~4줄 정도 해주세요.
`;

        const result = await callClaude(prompt);

        return {
            success: true,
            message: result,
        };
    } catch (err) {
        console.error("AI 조언 실패:", err);
        throw new functions.https.HttpsError("internal", "감정 조언을 가져오는 데 실패했어요.");
    }
});
