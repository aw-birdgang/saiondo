import {Module} from '@nestjs/common';
import {NotificationService} from './notification.service';
import {PrismaModule} from '@common/prisma/prisma.module';
import {PushScheduleModule} from '../push-schedule/push-schedule.module';

@Module({
  imports: [PrismaModule, PushScheduleModule],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
