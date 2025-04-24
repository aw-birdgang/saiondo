// functions/src/auth/login.ts
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const db = admin.firestore();

export const login = functions
    .region('asia-northeast3')
    .https.onCall(async (data, context) => {
    const { email, password } = data;

    if (!email || !password) {
        throw new functions.https.HttpsError("invalid-argument", "이메일과 비밀번호를 입력해주세요.");
    }

    try {
        // Firebase Auth SDK 자체는 서버에서 직접 비밀번호 로그인은 불가능
        // 그러므로 Firestore에서 유저 존재 여부만 확인하고,
        // 실제 로그인은 클라이언트 SDK로 처리하는 방식

        const usersRef = db.collection("users");
        const snapshot = await usersRef.where("email", "==", email).limit(1).get();

        if (snapshot.empty) {
            throw new functions.https.HttpsError("not-found", "등록된 이메일이 없습니다.");
        }

        const user = snapshot.docs[0].data();

        // 비밀번호는 클라이언트 SDK에서 처리되어야 하고,
        // 서버에서 저장하는 경우는 커스텀 인증이 필요한 상황만 해당됨

        return {
            success: true,
            uid: user.uid,
            name: user.name,
            email: user.email,
            mbti: user.mbti,
        };
    } catch (error: any) {
        console.error("로그인 실패", error);
        throw new functions.https.HttpsError("internal", error.message || "로그인 중 오류 발생");
    }
});
