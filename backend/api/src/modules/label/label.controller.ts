import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { LabelService } from './label.service';
import { CreateLabelCategoryDto } from '@modules/label/dto/create-label-category.dto';
import { CreateLabelDto } from '@modules/label/dto/create-label.dto';
import { CreateMessageLabelDto } from '@modules/label/dto/create-message-label.dto';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Label')
@Controller('label')
export class LabelController {
  constructor(private readonly service: LabelService) {}

  @Get('categories')
  @ApiOperation({ summary: '라벨 카테고리 전체 조회' })
  @ApiResponse({ status: 200, description: '라벨 카테고리 목록 반환' })
  getCategories() {
    return this.service.getCategories();
  }

  @Post('categories')
  @ApiOperation({ summary: '라벨 카테고리 생성' })
  @ApiBody({ type: CreateLabelCategoryDto })
  @ApiResponse({ status: 201, description: '생성된 라벨 카테고리 반환' })
  createCategory(@Body() dto: CreateLabelCategoryDto) {
    return this.service.createCategory(dto);
  }

  @Get('categories/:categoryId/labels')
  @ApiOperation({ summary: '카테고리별 라벨 목록 조회' })
  @ApiParam({ name: 'categoryId', required: true, description: '카테고리 ID' })
  @ApiResponse({ status: 200, description: '라벨 목록 반환' })
  getLabelsByCategory(@Param('categoryId') categoryId: string) {
    return this.service.getLabelsByCategory(categoryId);
  }

  @Post('labels')
  @ApiOperation({ summary: '라벨 생성' })
  @ApiBody({ type: CreateLabelDto })
  @ApiResponse({ status: 201, description: '생성된 라벨 반환' })
  createLabel(@Body() dto: CreateLabelDto) {
    return this.service.createLabel(dto);
  }

  @Post('message-labels')
  @ApiOperation({ summary: '메시지에 라벨 부여' })
  @ApiBody({ type: CreateMessageLabelDto })
  @ApiResponse({ status: 201, description: '메시지-라벨 연결 생성' })
  createMessageLabel(@Body() dto: CreateMessageLabelDto) {
    return this.service.createMessageLabel(dto);
  }

  @Get('message-labels')
  @ApiOperation({ summary: '메시지별 라벨 조회' })
  @ApiQuery({ name: 'messageId', required: true, description: '메시지 ID' })
  @ApiResponse({ status: 200, description: '메시지에 부여된 라벨 목록 반환' })
  getMessageLabels(@Query('messageId') messageId: string) {
    return this.service.getMessageLabels(messageId);
  }
}
