import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoryCodeService } from './category-code.service';
import { CreateCategoryCodeDto } from './dto/create-category-code.dto';
import { UpdateCategoryCodeDto } from './dto/update-category-code.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('CategoryCode')
@Controller('category-codes')
export class CategoryCodeController {
  constructor(private readonly service: CategoryCodeService) {}

  @Post()
  create(@Body() dto: CreateCategoryCodeDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCategoryCodeDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}