import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateUserDto} from '@modules/user/dto/user.dto';
import {WalletService} from '../wallet/wallet.service';
import {User} from "../../database/user/domain/user";
import {
  RelationalUserRepository
} from "../../database/user/infrastructure/persistence/relational/repositories/user.repository";
import { RedisService } from '@common/redis/redis.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: RelationalUserRepository,
    private readonly walletService: WalletService,
    private readonly redisService: RedisService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async createUser(data: CreateUserDto): Promise<User | null> {
    if (!data.name || !data.gender) {
      throw new BadRequestException('이름과 성별은 필수 입니다.');
    }
    const user = await this.userRepository.create({
      name: data.name,
      gender: data.gender,
      birthDate: data.birthDate ? new Date(data.birthDate) : new Date(),
      email: data.email,
      password: data.password,
      fcmToken: data.fcmToken,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      point: 0,
      walletId: null,
      wallet: null,
    });
    if (!user.id) throw new Error('User id is required for wallet creation');
    await this.walletService.createWalletForUser(user.id);
    return this.findById(user.id);
  }

  async findById(userId: string): Promise<User | null> {
    const client = this.redisService;
    const redisKey = `user:${userId}`;

    const cached = await client.get(redisKey);
    if (cached) return JSON.parse(cached);

    const user = await this.userRepository.findById(userId);
    if (user) {
      await client.set(redisKey, JSON.stringify(user), 'EX', 60 * 10); // 10분 캐시
      // await client.del(redisKey);
    }
    return user;
  }

  async findAssistantsByUserId(userId: string): Promise<User | null> {
    const user = await this.userRepository.findWithRelations(userId, { assistants: true });
    return user;
  }

  async updateFcmToken(userId: string, fcmToken: string): Promise<User> {
    const updated = await this.userRepository.update(userId, { fcmToken });
    const client = this.redisService;
    await client.del(`user:${userId}`);
    return updated;
  }

  async findUserWithPointHistory(userId: string): Promise<User | null> {
    const user = await this.userRepository.findWithRelations(userId, { pointHistories: true });
    if (user && user.pointHistories) {
      user.pointHistories.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
    }
    return user;
  }

  async deleteUser(userId: string): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    if (!user) return false;
    await this.userRepository.remove(userId);
    return true;
  }
}
