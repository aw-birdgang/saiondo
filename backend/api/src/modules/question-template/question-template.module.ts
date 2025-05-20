import { Module } from '@nestjs/common';
import { QuestionTemplateService } from './question-template.service';
import { QuestionTemplateController } from './question-template.controller';

@Module({
  controllers: [QuestionTemplateController],
  providers: [QuestionTemplateService],
  exports: [QuestionTemplateService],
})
export class QuestionTemplateModule {}
