import { Injectable } from '@nestjs/common';
import { NullableType } from '../../../../../../common/utils/types/nullable.type';
import { User } from '../../../../domain/user';
import { UserMapper } from '../mappers/user.mapper';
import { PrismaService } from '@common/prisma/prisma.service';
import { UserRepository } from '../../user.repository';
import { createWinstonLogger } from '@common/logger/winston.logger';

@Injectable()
export class RelationalUserRepository extends UserRepository {
  private readonly logger = createWinstonLogger(RelationalUserRepository.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: User): Promise<User> {
    this.logger.log(`create>> data ::${JSON.stringify(data)}`);
    const created = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        birthDate: data.birthDate,
        gender: data.gender,
        walletId: data.walletId ?? null,
        // createdAt, updatedAt, deletedAt 등은 Prisma가 자동 처리
      },
    });

    return UserMapper.fromPrisma(created);
  }

  async findById(id: string): Promise<NullableType<User>> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    return user ? UserMapper.fromPrisma(user) : null;
  }

  async findByEmail(email: string): Promise<NullableType<User>> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    return user ? UserMapper.fromPrisma(user) : null;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();

    return users.map(u => UserMapper.fromPrisma(u));
  }

  async update(id: string, payload: Partial<User>): Promise<User> {
    // Only include fields that exist in the Prisma schema
    const updateData: any = {};

    if (payload.name !== undefined) updateData.name = payload.name;
    if (payload.email !== undefined) updateData.email = payload.email;
    if (payload.password !== undefined) updateData.password = payload.password;
    if (payload.birthDate !== undefined) updateData.birthDate = payload.birthDate;
    if (payload.gender !== undefined) updateData.gender = payload.gender;
    if (payload.fcmToken !== undefined) updateData.fcmToken = payload.fcmToken;
    if (payload.point !== undefined) updateData.point = payload.point;
    if (payload.walletId !== undefined) updateData.walletId = payload.walletId;
    if (payload.isSubscribed !== undefined) updateData.isSubscribed = payload.isSubscribed;
    if (payload.subscriptionUntil !== undefined)
      updateData.subscriptionUntil = payload.subscriptionUntil;

    const updated = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    return UserMapper.fromPrisma(updated);
  }

  async remove(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  // 관계 포함 조회 등은 필요시 아래처럼 구현
  async findWithRelations(id: string, relations: any = {}): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: relations,
    });

    return user ? UserMapper.fromPrisma(user) : null;
  }

  async softRemove(id: string): Promise<void> {
    // Note: deletedAt field might not exist in current schema
    // Using delete instead of soft delete for now
    await this.prisma.user.delete({ where: { id } });
  }
}
