import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { PrismaService } from '@common/prisma/prisma.service';
import { EventOwnerGuard } from '../../common/guards/event-owner.guard';

@Module({
  controllers: [EventController],
  providers: [EventService, PrismaService, EventOwnerGuard],
})
export class EventModule {}
