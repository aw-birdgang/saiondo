import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { SuggestedFieldsService } from './suggested-fields.service';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('SuggestedFields')
@Controller('suggested-fields')
export class SuggestedFieldsController {
  constructor(private readonly service: SuggestedFieldsService) {}

  @Post()
  @ApiOperation({ summary: '필드 제안 생성' })
  @ApiBody({ description: '제안할 필드 정보', type: Object })
  @ApiResponse({ status: 201, description: '생성된 필드 제안 반환' })
  create(@Body() body) {
    return this.service.createSuggestedField(body);
  }

  @Post(':id/approve')
  @ApiOperation({ summary: '필드 제안 승인' })
  @ApiParam({ name: 'id', required: true, description: '제안 ID' })
  @ApiResponse({ status: 200, description: '승인된 필드 제안 반환' })
  approve(@Param('id') id: string) {
    return this.service.approveSuggestedField(id);
  }

  @Post(':id/reject')
  @ApiOperation({ summary: '필드 제안 거절' })
  @ApiParam({ name: 'id', required: true, description: '제안 ID' })
  @ApiResponse({ status: 200, description: '거절된 필드 제안 반환' })
  reject(@Param('id') id: string) {
    return this.service.rejectSuggestedField(id);
  }

  @Get('pending/:userId')
  @ApiOperation({ summary: '유저의 대기 중인 필드 제안 목록 조회' })
  @ApiParam({ name: 'userId', required: true, description: '유저 ID' })
  @ApiResponse({ status: 200, description: '대기 중인 필드 제안 목록 반환' })
  getPending(@Param('userId') userId: string) {
    return this.service.getPendingSuggestedFields(userId);
  }
}
