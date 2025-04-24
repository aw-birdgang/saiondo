import * as admin from 'firebase-admin';

export const initializeFirebase = () => {
    admin.initializeApp();
    const db = admin.firestore();
    db.settings({ databaseId: 'mcp-demo-database' });
    return { admin, db };
};
