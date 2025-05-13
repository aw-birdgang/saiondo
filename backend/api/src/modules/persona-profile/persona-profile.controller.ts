import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PersonaProfileService } from './persona-profile.service';
import { CreatePersonaProfileDto } from './dto/create-persona-profile.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

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

  @Post()
  @ApiOperation({ summary: '페르소나 프로필 생성' })
  @ApiBody({ type: CreatePersonaProfileDto })
  @ApiResponse({ status: 201, description: '생성된 페르소나 프로필 반환' })
  async create(@Body() body: CreatePersonaProfileDto) {
    return this.service.create(body);
  }

  @Post('analyze/:userId')
  async analyzePersona(@Param('userId') userId: string) {
    return this.service.analyzeAndSavePersona(userId);
  }
}
