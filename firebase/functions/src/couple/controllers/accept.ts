import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const db = admin.firestore();

export const acceptCoupleInvite = functions
    .region('asia-northeast3')
    .https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
    }

    const { inviteCode, inviteeUid } = req.body;

    if (!inviteCode || !inviteeUid) {
        res.status(400).json({ error: "Missing inviteCode or inviteeUid" });
        return;
    }

    try {
        const inviteRef = db.collection("coupleInvites").doc(inviteCode);
        const inviteDoc = await inviteRef.get();

        if (!inviteDoc.exists) {
            res.status(404).json({ error: "Invalid invite code" });
            return;
        }

        const inviteData = inviteDoc.data();

        if (inviteData?.status === "accepted") {
            res.status(400).json({ error: "Invite already accepted" });
            return;
        }

        // 커플 관계 생성 (예: couples 컬렉션)
        const coupleRef = await db.collection("couples").add({
            inviterUid: inviteData?.inviterUid,
            inviteeUid: inviteeUid,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // 초대 상태 업데이트
        await inviteRef.update({
            status: "accepted",
            acceptedAt: admin.firestore.FieldValue.serverTimestamp(),
            coupleId: coupleRef.id,
        });

        res.status(200).json({ message: "Invite accepted", coupleId: coupleRef.id });
    } catch (error) {
        console.error("Error accepting invite:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
