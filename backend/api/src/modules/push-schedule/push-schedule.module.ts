import { Module } from '@nestjs/common';
import { PushScheduleService } from './push-schedule.service';
import { PushScheduleController } from './push-schedule.controller';

@Module({
    controllers: [PushScheduleController],
    providers: [PushScheduleService],
    exports: [PushScheduleService],
})
export class PushScheduleModule {}
