import { Module } from '@nestjs/common';
import { BasicQuestionWithAnswerService } from './basic-question-with-answer.service';
import { BasicQuestionWithAnswerController } from './basic-question-with-answer.controller';

@Module({
  controllers: [BasicQuestionWithAnswerController],
  providers: [BasicQuestionWithAnswerService],
})
export class BasicQuestionWithAnswerModule {}
