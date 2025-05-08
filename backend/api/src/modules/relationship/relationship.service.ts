import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { CreateRelationshipDto } from './dto/create-relationship.dto';
import { RelationshipStatus } from '@prisma/client';
import { InviteRelationshipDto } from './dto/invite-relationship.dto';

@Injectable()
export class RelationshipService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.relationship.findMany();
  }

  async create(data: CreateRelationshipDto) {
    return this.prisma.relationship.create({
      data: {
        ...data,
        status: data.status as RelationshipStatus,
      },
    });
  }

  async invite(dto: InviteRelationshipDto) {
    return this.prisma.relationship.create({
      data: {
        user1Id: dto.user1Id,
        user2Id: dto.user2Id,
        status: 'PENDING',
      },
    });
  }

  async accept(id: string) {
    // 1. 관계 상태 ACTIVE로 변경
    const relationship = await this.prisma.relationship.update({
      where: { id },
      data: { status: 'ACTIVE', startedAt: new Date() },
    });
    // 2. Room 생성
    const room = await this.prisma.room.create({
      data: { relationshipId: id },
    });
    // 3. 관계에 room 연결 (Prisma 1:1 관계에서는 relation connect 사용)
    await this.prisma.relationship.update({
      where: { id },
      data: { room: { connect: { id: room.id } } },
    });
    return { relationship, room };
  }

  async reject(id: string) {
    return this.prisma.relationship.update({
      where: { id },
      data: { status: 'ENDED', endedAt: new Date() },
    });
  }
}
