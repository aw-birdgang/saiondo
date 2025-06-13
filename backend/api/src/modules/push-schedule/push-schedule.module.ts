import {Module} from '@nestjs/common';
import {PushScheduleService} from './push-schedule.service';
import {PushScheduleController} from './push-schedule.controller';
import {PushService} from './push.service';
import {FirebaseService} from '@common/firebase/firebase.service';
import {PushController} from '@modules/push-schedule/push.controller';
import {ChatModule} from "@modules/chat/chat.module";

@Module({
  imports: [ChatModule],
  controllers: [PushController, PushScheduleController],
  providers: [PushScheduleService, PushService, FirebaseService],
  exports: [PushScheduleService, PushService],
})
export class PushScheduleModule {}
