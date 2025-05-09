import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Room')
@Controller('rooms')
export class RoomController {
  constructor(private readonly service: RoomService) {}

  @Post()
  @ApiOperation({ summary: 'Room 생성' })
  @ApiResponse({ status: 201, description: '생성된 Room 반환' })
  async create(@Body() dto: CreateRoomDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '모든 Room 조회' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Room 단건 조회' })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get('/by-relationship/:relationshipId')
  @ApiOperation({ summary: 'RelationshipId로 Room 조회' })
  async findByRelationshipId(@Param('relationshipId') relationshipId: string) {
    return this.service.findByRelationshipId(relationshipId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Room 정보 수정' })
  async update(@Param('id') id: string, @Body() dto: UpdateRoomDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Room 삭제' })
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}