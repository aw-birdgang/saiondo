import * as admin from 'firebase-admin';
import { FirestoreDataConverter } from '@google-cloud/firestore';

export abstract class BaseRepository<T> {
    protected constructor(
        protected collection: string,
        protected db = admin.firestore(),
        protected converter?: FirestoreDataConverter<T>
    ) {}

    async findById(id: string): Promise<T | null> {
        const doc = await this.db.collection(this.collection).doc(id).get();
        return doc.exists ? (doc.data() as T) : null;
    }

    async create(data: Omit<T, 'id'>): Promise<T> {
        const docRef = await this.db.collection(this.collection).add({
            ...data,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        return {
            id: docRef.id,
            ...data
        } as T;
    }
}
