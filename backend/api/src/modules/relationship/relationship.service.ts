import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from '@common/prisma/prisma.service';
import {CreateRelationshipDto} from './dto/create-relationship.dto';
import {RelationshipStatus} from '@prisma/client';
import {InviteRelationshipDto} from './dto/invite-relationship.dto';

@Injectable()
export class RelationshipService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.relationship.findMany();
  }

  async create(dto: CreateRelationshipDto) {
    // 상태는 기본적으로 PENDING
    return this.prisma.relationship.create({
      data: {
        user1Id: dto.user1Id,
        user2Id: dto.user2Id,
        status: RelationshipStatus.PENDING,
        startedAt: new Date(),
      },
    });
  }

  async invite(dto: InviteRelationshipDto) {
    return this.prisma.relationship.create({
      data: {
        user1Id: dto.user1Id,
        user2Id: dto.user2Id,
        status: 'PENDING',
        startedAt: new Date(),
      },
    });
  }

  async accept(id: string) {
    // 상태 ACTIVE로 변경 + Room 자동 생성
    const relationship = await this.prisma.relationship.update({
      where: { id },
      data: { status: RelationshipStatus.ACTIVE },
    });

    // Room 자동 생성
    const existingRoom = await this.prisma.room.findUnique({ where: { relationshipId: id } });
    if (!existingRoom) {
      await this.prisma.room.create({ data: { relationshipId: id } });
    }
    return relationship;
  }

  async reject(id: string) {
    // 상태 ENDED(또는 REJECTED)로 변경
    return this.prisma.relationship.update({
      where: { id },
      data: { status: RelationshipStatus.ENDED },
    });
  }

  async updateStatus(id: string, status: RelationshipStatus) {
    // 상태 변경
    const relationship = await this.prisma.relationship.update({
      where: { id },
      data: { status },
    });

    // ACTIVE로 변경 시 Room 자동 생성
    if (status === RelationshipStatus.ACTIVE) {
      const existingRoom = await this.prisma.room.findUnique({
        where: { relationshipId: id },
      });
      if (!existingRoom) {
        await this.prisma.room.create({
          data: { relationshipId: id },
        });
      }
    }
    return relationship;
  }

  async findOne(id: string) {
    const relationship = await this.prisma.relationship.findUnique({
      where: { id },
      include: { room: true },
    });
    if (!relationship) throw new NotFoundException('Not found');
    return relationship;
  }
}
