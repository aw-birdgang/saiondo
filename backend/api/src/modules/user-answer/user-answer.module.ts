import { Module } from '@nestjs/common';
import { UserAnswerService } from './user-answer.service';

@Module({
    providers: [UserAnswerService],
    exports: [UserAnswerService],
})
export class UserAnswerModule {}
