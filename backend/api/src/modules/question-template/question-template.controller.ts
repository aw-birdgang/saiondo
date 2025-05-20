import { Body, Controller, Get, Post } from '@nestjs/common';
import { QuestionTemplateService } from './question-template.service';
import { CreateQuestionTemplateDto } from './dto/create-question-template.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('QuestionTemplate')
@Controller('question-templates')
export class QuestionTemplateController {
  constructor(private readonly service: QuestionTemplateService) {}

  @Post()
  @ApiOperation({ summary: '질문 템플릿 생성' })
  @ApiBody({ type: CreateQuestionTemplateDto })
  @ApiResponse({ status: 201, description: '생성된 질문 템플릿 반환' })
  create(@Body() dto: CreateQuestionTemplateDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '모든 질문 템플릿 조회' })
  @ApiResponse({ status: 200, description: '질문 템플릿 목록 반환' })
  findAll() {
    return this.service.findAll();
  }
}
