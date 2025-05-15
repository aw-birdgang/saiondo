import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRoomDto: CreateRoomDto) {
    return this.prisma.room.create({
      data: {
        relationshipId: createRoomDto.relationshipId,
      },
    });
  }

  async findAll() {
    return this.prisma.room.findMany({
      include: { relationship: true, chatHistories: true },
    });
  }

  async findOne(id: string) {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: { relationship: true, chatHistories: true },
    });
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  async findByRelationshipId(relationshipId: string) {
    return this.prisma.room.findUnique({
      where: { relationshipId },
      include: { relationship: true, chatHistories: true },
    });
  }

  async update(id: string, updateRoomDto: UpdateRoomDto) {
    return this.prisma.room.update({
      where: { id },
      data: updateRoomDto,
    });
  }

  async remove(id: string) {
    return this.prisma.room.delete({ where: { id } });
  }

  async getRoomParticipants(roomId: string) {
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
      include: {
        relationship: {
          include: {
            user1: true,
            user2: true,
          },
        },
      },
    });
    if (!room || !room.relationship) return [];
    const { user1, user2 } = room.relationship;
    return [user1, user2];
  }
}
