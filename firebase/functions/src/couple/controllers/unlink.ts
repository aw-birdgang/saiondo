import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const db = admin.firestore();

export const unlinkCouple = functions
    .region('asia-northeast3')
    .https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
    }

    const { userUid } = req.body;

    if (!userUid) {
        res.status(400).json({ error: "Missing userUid" });
        return;
    }

    try {
        // 커플 문서에서 사용자 포함된 문서 찾기
        const coupleSnap = await db.collection("couples")
            .where("inviterUid", "==", userUid)
            .get();

        let coupleDoc = coupleSnap.docs[0];

        if (!coupleDoc) {
            const coupleSnap2 = await db.collection("couples")
                .where("inviteeUid", "==", userUid)
                .get();
            coupleDoc = coupleSnap2.docs[0];
        }

        if (!coupleDoc) {
            res.status(404).json({ error: "No couple relationship found" });
            return;
        }

        // 문서 업데이트 또는 삭제
        await coupleDoc.ref.update({
            status: "unlinked",
            unlinkedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        res.status(200).json({ message: "Couple unlinked", coupleId: coupleDoc.id });
    } catch (error) {
        console.error("Error unlinking couple:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
