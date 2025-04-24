import * as admin from 'firebase-admin';
import {BaseService} from '../core/services/base.service';
import {UserRepository} from './repository';
import {RegisterData, User} from './types';
import {validateEmail} from '../utils/validation';
import {AppError} from "../core/error/app-error";

export class AuthService extends BaseService {
    private repository: UserRepository;

    constructor() {
        super();
        this.repository = UserRepository.getInstance();
    }

    async register(data: RegisterData): Promise<string> {
        try {
            await this.validateRegisterData(data);

            const userRecord = await admin.auth().createUser({
                email: data.email,
                password: data.password,
                displayName: data.name,
                disabled: false,
            });

            const userData: Omit<User, 'id'> = {
                email: data.email,
                name: data.name,
                mbti: data.mbti,
                gender: data.gender,
                emailVerified: false,
                disabled: false,
                createdAt: admin.firestore.Timestamp.now(),
                updatedAt: admin.firestore.Timestamp.now(),
            };

            const userId = await this.repository.createUser(userData);

            return userId;
        } catch (error) {
            if (error instanceof AppError) throw error;

            throw new AppError({
                code: 'internal',
                message: '회원가입 중 오류가 발생했습니다.',
                details: error
            });
        }
    }

    private async validateRegisterData(data: RegisterData): Promise<void> {
        const { name, email, password, mbti } = data;

        if (!name || !email || !password || !mbti) {
            throw new AppError({
                code: 'invalid-argument',
                message: '모든 필수 항목을 입력해주세요.'
            });
        }

        if (!validateEmail(email)) {
            throw new AppError({
                code: 'invalid-argument',
                message: '유효하지 않은 이메일 형식입니다.'
            });
        }

        const existingUser = await this.repository.findByEmail(email);
        if (existingUser) {
            throw new AppError({
                code: 'already-exists',
                message: '이미 등록된 이메일입니다.'
            });
        }
    }
}
