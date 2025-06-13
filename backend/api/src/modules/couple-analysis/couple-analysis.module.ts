import {Module, forwardRef} from '@nestjs/common';
import {CoupleAnalysisController} from './couple-analysis.controller';
import {CoupleAnalysisService} from './couple-analysis.service';
import {PrismaModule} from '@common/prisma/prisma.module';
import {LlmModule} from '../llm/llm.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => LlmModule),
  ],
  controllers: [CoupleAnalysisController],
  providers: [CoupleAnalysisService],
})
export class CoupleAnalysisModule {}
