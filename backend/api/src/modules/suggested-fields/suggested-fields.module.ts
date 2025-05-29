import { Module } from '@nestjs/common';
import { SuggestedFieldsService } from './suggested-fields.service';
import { SuggestedFieldsController } from './suggested-fields.controller';
import {PrismaService} from "@common/prisma/prisma.service";

@Module({
  controllers: [SuggestedFieldsController],
  providers: [SuggestedFieldsService, PrismaService],
  exports: [SuggestedFieldsService],
})
export class SuggestedFieldsModule {}
