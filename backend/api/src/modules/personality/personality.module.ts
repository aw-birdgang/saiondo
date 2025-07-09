import {forwardRef, Module} from '@nestjs/common';
import {PersonalityController} from './personality.controller';
import {LlmModule} from '../llm/llm.module';
import {PersonaProfileModule} from '../persona-profile/persona-profile.module';
import {CoupleAnalysisModule} from '../couple-analysis/couple-analysis.module';
import {AdviceModule} from '../advice/advice.module';
import {PersonalityService} from "@modules/personality/personality.service";

@Module({
  imports: [
    forwardRef(() => LlmModule),
    forwardRef(() => PersonaProfileModule),
    forwardRef(() => CoupleAnalysisModule),
    forwardRef(() => AdviceModule),
  ],
  controllers: [PersonalityController],
  providers: [PersonalityService],
})
export class PersonalityModule {}
