import { PartialType } from '@nestjs/swagger';
import { CreateBasicQuestionDto } from './create-basic-question.dto';

export class UpdateBasicQuestionDto extends PartialType(CreateBasicQuestionDto) {}
