import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { RelationshipService } from './relationship.service';
import { CreateRelationshipDto } from './dto/create-relationship.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { InviteRelationshipDto } from './dto/invite-relationship.dto';
import { RelationshipStatus } from '@prisma/client';

@ApiTags('Relationship')
@Controller('relationships')
export class RelationshipController {
  constructor(private readonly service: RelationshipService) {}

  @Get()
  @ApiOperation({ summary: '모든 관계 조회' })
  @ApiResponse({ status: 200, description: '관계 목록 반환' })
  async findAll() {
    return this.service.findAll();
  }

  @Post()
  @ApiOperation({ summary: '커플 초대(생성)' })
  @ApiBody({ type: CreateRelationshipDto })
  @ApiResponse({ status: 201, description: '생성된 관계 반환' })
  async create(@Body() dto: CreateRelationshipDto) {
    return this.service.create(dto);
  }

  @Post('invite')
  @ApiOperation({ summary: '관계 초대', description: '상대방을 초대(PENDING 상태)' })
  @ApiResponse({ status: 201, description: '초대된 관계 반환' })
  async invite(@Body() dto: InviteRelationshipDto) {
    return this.service.invite(dto);
  }

  @Post(':id/accept')
  @ApiOperation({ summary: '관계 수락', description: '상대방이 수락하면 ACTIVE 상태 및 룸 생성' })
  @ApiResponse({ status: 200, description: '수락된 관계와 생성된 룸 반환' })
  async accept(@Param('id') id: string) {
    return this.service.accept(id);
  }

  @Post(':id/reject')
  @ApiOperation({ summary: '관계 거절', description: '상대방이 거절하면 ENDED 상태' })
  @ApiResponse({ status: 200, description: '거절된 관계 반환' })
  async reject(@Param('id') id: string) {
    return this.service.reject(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: '커플 상태 변경(수락/종료 등) 및 Room 자동 생성' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: RelationshipStatus,
  ) {
    return this.service.updateStatus(id, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Relationship 단건 조회' })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
