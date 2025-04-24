import { BaseService } from '../core/services/base.service';
import { CoupleInviteData } from './types';
import { CoupleRepository } from './repository';
import {AppError} from "../core/error/app-error";

export class CoupleService extends BaseService {
    private repository: CoupleRepository;

    constructor() {
        super();
        this.repository = CoupleRepository.getInstance();
    }

    async invite(userId: string, data: CoupleInviteData): Promise<void> {
        try {
            const user = await this.repository.findUserById(userId);
            if (!user) {
                throw new AppError({
                    code: 'not-found',
                    message: '사용자를 찾을 수 없습니다.'
                });
            }

            if (user.coupleId) {
                throw new AppError({
                    code: 'already-exists',
                    message: '이미 커플 연결이 되어있습니다.'
                });
            }

            const partner = await this.repository.findUserByEmail(data.partnerEmail);
            if (!partner) {
                throw new AppError({
                    code: 'not-found',
                    message: '상대방을 찾을 수 없습니다.'
                });
            }

            if (partner.coupleId) {
                throw new AppError({
                    code: 'already-exists',
                    message: '상대방이 이미 커플 연결이 되어있습니다.'
                });
            }

            await this.repository.createInvite(userId, partner.id);

            this.logger.info('커플 초대 생성 완료', {
                fromUserId: userId,
                toUserId: partner.id
            });
        } catch (error) {
            this.logger.error('커플 초대 생성 실패', error);
            throw error;
        }
    }
}
