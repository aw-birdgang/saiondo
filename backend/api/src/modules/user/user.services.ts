import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateUserDto} from '@modules/user/dto/user.dto';
import {WalletService} from '../wallet/wallet.service';
import {User} from "../../database/user/domain/user";
import {
  RelationalUserRepository
} from "../../database/user/infrastructure/persistence/relational/repositories/user.repository";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: RelationalUserRepository,
    private readonly walletService: WalletService,
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
    return this.userRepository.findById(userId);
  }

  async findAssistantsByUserId(userId: string): Promise<User | null> {
    const user = await this.userRepository.findWithRelations(userId, { assistants: true });
    return user;
  }

  async updateFcmToken(userId: string, fcmToken: string): Promise<User> {
    return this.userRepository.update(userId, { fcmToken });
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
