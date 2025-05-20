import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { CreateUserDto } from '@modules/user/dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany();
  }

  async createUser(data: CreateUserDto) {
    if (!data.name || !data.gender) {
      throw new BadRequestException('이름과 성별은 필수 입니다.');
    }
    return this.prisma.user.create({
      data: {
        name: data.name,
        gender: data.gender,
        birthDate: new Date(),
        email: data.email,
        password: data.password,
      },
    });
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
}
