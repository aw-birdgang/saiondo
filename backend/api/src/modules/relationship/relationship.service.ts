import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { CreateRelationshipDto } from './dto/create-relationship.dto';
import { RelationshipStatus } from '@prisma/client';

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
}
