import { Module } from '@nestjs/common';
import { RelationalPointRepository } from './repositories/point.repository';
import { PrismaService } from '@common/prisma/prisma.service';

@Module({
  providers: [PrismaService, RelationalPointRepository],
  exports: [RelationalPointRepository],
})
export class PointRelationalPersistenceModule {}
