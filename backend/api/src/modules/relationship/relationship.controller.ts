import { Controller, Get, Post, Body } from '@nestjs/common';
import { RelationshipService } from './relationship.service';
import { CreateRelationshipDto } from './dto/create-relationship.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

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
  @ApiOperation({ summary: '관계 생성' })
  @ApiBody({ type: CreateRelationshipDto })
  @ApiResponse({ status: 201, description: '생성된 관계 반환' })
  async create(@Body() body: CreateRelationshipDto) {
    return this.service.create(body);
  }
}
