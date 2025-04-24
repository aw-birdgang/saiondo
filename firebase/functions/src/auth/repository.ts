import {BaseRepository} from '../core/repository/base.repository';
import {User} from './types';
import {AppError} from "../core/error/app-error";
import * as admin from 'firebase-admin';

export class UserRepository extends BaseRepository<User> {
    private static instance: UserRepository;

    private constructor() {
        super('users');
    }

    static getInstance(): UserRepository {
        if (!UserRepository.instance) {
            UserRepository.instance = new UserRepository();
        }
        return UserRepository.instance;
    }

    async findByEmail(email: string): Promise<User | null> {
        const snapshot = await this.db
            .collection(this.collection)
            .where('email', '==', email)
            .limit(1)
            .get();

        if (snapshot.empty) return null;
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() } as User;
    }

    async createUser(data: Omit<User, 'id'>): Promise<string> {
        try {
            const docRef = await this.db.collection(this.collection).add({
                ...data,
                createdAt: this.timestamp(),
                updatedAt: this.timestamp(),
            });
            return docRef.id;
        } catch (error) {
            throw new AppError({
                code: 'internal',
                message: '사용자 생성 중 오류가 발생 했습니다.',
                details: error
            });
        }
    }

    private timestamp() {
        return admin.firestore.FieldValue.serverTimestamp();
    }
}
