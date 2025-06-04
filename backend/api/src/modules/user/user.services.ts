import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { CreateUserDto } from '@modules/user/dto/user.dto';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletService: WalletService,
  ) {}

  async findAll() {
    return this.prisma.user.findMany();
  }

  async createUser(data: CreateUserDto) {
    if (!data.name || !data.gender) {
      throw new BadRequestException('이름과 성별은 필수 입니다.');
    }
    // 1. 유저 생성
    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        gender: data.gender,
        birthDate: new Date(),
        email: data.email,
        password: data.password,
      },
    });
    // 2. 지갑 생성 및 연결
    await this.walletService.createWalletForUser(user.id);
    // 3. 유저+지갑 반환
    return this.findById(user.id);
  }

  async findById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  // 또는 user와 assistants를 함께 조회하고 싶다면:
  async findAssistantsByUserId(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { assistants: true },
    });
  }

  async updateFcmToken(userId: string, fcmToken: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { fcmToken },
    });
  }

  async findUserWithPointHistory(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        pointHistories: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }
}
