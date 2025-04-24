import * as admin from 'firebase-admin';
import { BaseRepository } from '../core/repository/base.repository';
import { Couple, CoupleInvite } from './types';
import { User } from '../auth/types';
import {AppError} from "../core/error/app-error";

export class CoupleRepository extends BaseRepository<Couple> {
    private static instance: CoupleRepository;
    private readonly userCollection = 'users';
    private readonly inviteCollection = 'coupleInvites';

    private constructor() {
        super('couples');
    }

    static getInstance(): CoupleRepository {
        if (!CoupleRepository.instance) {
            CoupleRepository.instance = new CoupleRepository();
        }
        return CoupleRepository.instance;
    }

    // User 관련 메서드들
    async findUserById(userId: string): Promise<User | null> {
        try {
            const doc = await this.db.collection(this.userCollection).doc(userId).get();
            if (!doc.exists) return null;
            return { id: doc.id, ...doc.data() } as User;
        } catch (error) {
            throw new AppError({
                code: 'internal',
                message: '사용자 조회 중 오류가 발생했습니다.',
                details: error
            });
        }
    }

    async findUserByEmail(email: string): Promise<User | null> {
        try {
            const snapshot = await this.db
                .collection(this.userCollection)
                .where('email', '==', email)
                .limit(1)
                .get();

            if (snapshot.empty) return null;
            const doc = snapshot.docs[0];
            return { id: doc.id, ...doc.data() } as User;
        } catch (error) {
            throw new AppError({
                code: 'internal',
                message: '사용자 조회 중 오류가 발생했습니다.',
                details: error
            });
        }
    }

    // Couple 관련 메서드들
    async findCoupleById(coupleId: string): Promise<Couple | null> {
        try {
            const doc = await this.db.collection(this.collection).doc(coupleId).get();
            if (!doc.exists) return null;
            return { id: doc.id, ...doc.data() } as Couple;
        } catch (error) {
            throw new AppError({
                code: 'internal',
                message: '커플 정보 조회 중 오류가 발생했습니다.',
                details: error
            });
        }
    }

    // Invite 관련 메서드들
    async createInvite(fromUserId: string, toUserId: string): Promise<string> {
        try {
            const existingInvite = await this.findExistingInvite(fromUserId, toUserId);
            if (existingInvite) {
                throw new AppError({
                    code: 'already-exists',
                    message: '이미 보낸 초대가 있습니다.'
                });
            }

            const invite: Omit<CoupleInvite, 'id'> = {
                fromUserId,
                toUserId,
                status: 'pending',
                createdAt: this.getTimestamp(),
                updatedAt: this.getTimestamp(),
                expiredAt: this.getExpirationTimestamp(),
            };

            const docRef = await this.db.collection(this.inviteCollection).add(invite);
            return docRef.id;
        } catch (error) {
            if (error instanceof AppError) throw error;

            throw new AppError({
                code: 'internal',
                message: '커플 초대 생성 중 오류가 발생했습니다.',
                details: error
            });
        }
    }

    private async findExistingInvite(fromUserId: string, toUserId: string): Promise<CoupleInvite | null> {
        const snapshot = await this.db
            .collection(this.inviteCollection)
            .where('fromUserId', '==', fromUserId)
            .where('toUserId', '==', toUserId)
            .where('status', '==', 'pending')
            .where('expiredAt', '>', this.getTimestamp())
            .limit(1)
            .get();

        if (snapshot.empty) return null;
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() } as CoupleInvite;
    }

    async createCouple(user1Id: string, user2Id: string): Promise<string> {
        try {
            const couple: Omit<Couple, 'id'> = {
                user1Id,
                user2Id,
                status: 'active',
                createdAt: this.getTimestamp(),
                updatedAt: this.getTimestamp(),
            };

            const docRef = await this.db.collection(this.collection).add(couple);

            // 사용자 정보 업데이트
            await this.updateUserCoupleInfo(user1Id, docRef.id, user2Id);
            await this.updateUserCoupleInfo(user2Id, docRef.id, user1Id);

            return docRef.id;
        } catch (error) {
            throw new AppError({
                code: 'internal',
                message: '커플 생성 중 오류가 발생했습니다.',
                details: error
            });
        }
    }

    private async updateUserCoupleInfo(
        userId: string,
        coupleId: string,
        partnerId: string
    ): Promise<void> {
        await this.db.collection(this.userCollection).doc(userId).update({
            coupleId,
            partnerId,
            updatedAt: this.getTimestamp()
        });
    }

    private getTimestamp(): admin.firestore.Timestamp {
        return admin.firestore.Timestamp.now();
    }

    private getExpirationTimestamp(): admin.firestore.Timestamp {
        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 24);
        return admin.firestore.Timestamp.fromDate(expirationDate);
    }
}
