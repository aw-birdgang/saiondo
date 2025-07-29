import { Module, forwardRef } from '@nestjs/common';
import { PersonaProfileService } from './persona-profile.service';
import { PersonaProfileController } from './persona-profile.controller';
import { LlmModule } from '../llm/llm.module';
import { PrismaModule } from '@common/prisma/prisma.module';
import { PointModule } from '../point/point.module';
import { CoupleAnalysisModule } from '../couple-analysis/couple-analysis.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => CoupleAnalysisModule),
    forwardRef(() => LlmModule),
    forwardRef(() => PointModule),
  ],
  controllers: [PersonaProfileController],
  providers: [PersonaProfileService],
  exports: [PersonaProfileService],
})
export class PersonaProfileModule {}
