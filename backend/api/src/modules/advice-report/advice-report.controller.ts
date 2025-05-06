import { Controller, Get, Post, Body } from '@nestjs/common';
import { AdviceReportService } from './advice-report.service';
import { CreateAdviceReportDto } from './dto/create-advice-report.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('AdviceReport')
@Controller('advice-reports')
export class AdviceReportController {
  constructor(private readonly service: AdviceReportService) {}

  @Get()
  @ApiOperation({ summary: '모든 리포트 조회' })
  @ApiResponse({ status: 200, description: '리포트 목록 반환' })
  async findAll() {
    return this.service.findAll();
  }

  @Post()
  @ApiOperation({ summary: '리포트 생성' })
  @ApiBody({ type: CreateAdviceReportDto })
  @ApiResponse({ status: 201, description: '생성된 리포트 반환' })
  async create(@Body() body: CreateAdviceReportDto) {
    return this.service.create(body);
  }
}
