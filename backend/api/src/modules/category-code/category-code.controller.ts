import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { CategoryCodeService } from './category-code.service';
import { CreateCategoryCodeDto } from './dto/create-category-code.dto';
import { UpdateCategoryCodeDto } from './dto/update-category-code.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('CategoryCode')
@Controller('category-codes')
export class CategoryCodeController {
  constructor(private readonly service: CategoryCodeService) {}

  @Post()
  @ApiOperation({ summary: '카테고리 코드 생성' })
  @ApiBody({ type: CreateCategoryCodeDto })
  @ApiResponse({ status: 201, description: '생성된 카테고리 코드 반환' })
  create(@Body() dto: CreateCategoryCodeDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '모든 카테고리 코드 조회' })
  @ApiResponse({ status: 200, description: '카테고리 코드 목록 반환' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '카테고리 코드 수정' })
  @ApiBody({ type: UpdateCategoryCodeDto })
  @ApiResponse({ status: 200, description: '수정된 카테고리 코드 반환' })
  update(@Param('id') id: string, @Body() dto: UpdateCategoryCodeDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '카테고리 코드 삭제' })
  @ApiResponse({ status: 200, description: '삭제된 카테고리 코드 반환' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
