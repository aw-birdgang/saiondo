import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PersonaProfileService } from './persona-profile.service';
import { CreatePersonaProfileDto } from './dto/create-persona-profile.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { UpdatePersonaProfileDto } from './dto/update-persona-profile.dto';

@ApiTags('PersonaProfile')
@Controller('persona-profiles')
export class PersonaProfileController {
  constructor(private readonly service: PersonaProfileService) {}

  @Get()
  @ApiOperation({ summary: '모든 페르소나 프로필 조회' })
  @ApiResponse({ status: 200, description: '페르소나 프로필 목록 반환' })
  async findAll() {
    return this.service.findAll();
  }

  @Post('user/:userId')
  @ApiOperation({ summary: '페르소나 프로필 생성' })
  @ApiBody({ type: CreatePersonaProfileDto })
  @ApiResponse({ status: 201, description: '생성된 페르소나 프로필 반환' })
  async create(
    @Param('userId') userId: string,
    @Body() body: CreatePersonaProfileDto
  ) {
    return this.service.create({ ...body, userId });
  }

  @Post('analyze/:userId')
  @ApiOperation({ summary: '유저의 페르소나 자동 분석 및 저장' })
  @ApiParam({ name: 'userId', description: '유저 ID' })
  @ApiResponse({ status: 201, description: '분석 및 저장된 페르소나 프로필 반환' })
  async analyzePersona(@Param('userId') userId: string) {
    return this.service.analyzeAndSavePersona(userId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'userId로 페르소나 프로필 목록 조회' })
  @ApiParam({ name: 'userId', description: '유저 ID' })
  @ApiResponse({ status: 200, description: '해당 유저의 페르소나 프로필 목록 반환' })
  async findByUserId(@Param('userId') userId: string) {
    return this.service.findByUserId(userId);
  }

  @Get('user/:userId/unique')
  @ApiOperation({ summary: 'userId로 단일(대표) 페르소나 프로필 조회' })
  @ApiParam({ name: 'userId', description: '유저 ID' })
  @ApiResponse({ status: 200, description: '해당 유저의 대표 페르소나 프로필 반환' })
  async getPersonaByUserId(@Param('userId') userId: string) {
    return this.service.getPersonaByUserId(userId);
  }

  @Put('user/:userId/category/:categoryCodeId')
  @ApiOperation({ summary: 'userId+categoryCodeId로 페르소나 프로필 수정' })
  @ApiBody({ type: UpdatePersonaProfileDto })
  @ApiResponse({ status: 200, description: '수정된 페르소나 프로필 반환' })
  async updateForUser(
    @Param('userId') userId: string,
    @Param('categoryCodeId') categoryCodeId: string,
    @Body() body: UpdatePersonaProfileDto
  ) {
    return this.service.update(userId, categoryCodeId, body);
  }

  @Delete('user/:userId/category/:categoryCodeId')
  @ApiOperation({ summary: 'userId+categoryCodeId로 페르소나 프로필 삭제' })
  @ApiResponse({ status: 204, description: '삭제 성공' })
  async deleteForUser(
    @Param('userId') userId: string,
    @Param('categoryCodeId') categoryCodeId: string,
  ) {
    return this.service.delete(userId, categoryCodeId);
  }
}
