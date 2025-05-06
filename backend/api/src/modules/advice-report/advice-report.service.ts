import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { CreateAdviceReportDto } from './dto/create-advice-report.dto';

@Injectable()
export class AdviceReportService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.adviceReport.findMany();
  }

  async create(data: CreateAdviceReportDto) {
    return this.prisma.adviceReport.create({ data });
  }
}
