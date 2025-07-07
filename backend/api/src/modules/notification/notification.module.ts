import {Module} from '@nestjs/common';
import {NotificationService} from './notification.service';
import {PushScheduleModule} from '../push-schedule/push-schedule.module';
import {
  RelationalNotificationRepository
} from '../../database/notification/infrastructure/persistence/relational/repositories/notification.repository';
import {NotificationRepository} from '../../database/notification/infrastructure/persistence/notification.repository';
import {
  RelationalNotificationPersistenceModule
} from '../../database/notification/infrastructure/persistence/relational/relational-persistence.module';
import {NotificationController} from "@modules/notification/notification.controller";

@Module({
  imports: [PushScheduleModule, RelationalNotificationPersistenceModule],
  controllers: [NotificationController,],
  providers: [
    NotificationService,
    {
      provide: NotificationRepository,
      useClass: RelationalNotificationRepository,
    },
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
