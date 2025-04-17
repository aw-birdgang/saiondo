import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const db = admin.firestore();

export const inviteCouple = functions
    .region('asia-northeast3')
    .https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
    }

    const { inviterUid, inviteeEmail } = req.body;

    if (!inviterUid || !inviteeEmail) {
        res.status(400).json({ error: "Missing inviterUid or inviteeEmail" });
        return;
    }

    try {
        const inviteCode = crypto.randomUUID();
        await db.collection("coupleInvites").doc(inviteCode).set({
            inviterUid,
            inviteeEmail,
            inviteCode,
            status: "pending",
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        res.status(200).json({ message: "Invite sent", inviteCode });
    } catch (error) {
        console.error("Error sending invite:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
