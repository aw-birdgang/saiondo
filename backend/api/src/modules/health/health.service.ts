import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async check() {
    // DB 연결 체크
    try {
      await this.prisma.$queryRaw`SELECT 1`;

      return { status: 'ok', db: 'ok' };
    } catch (e) {
      return { status: 'fail', db: 'fail', error: e.message };
    }
  }
}
