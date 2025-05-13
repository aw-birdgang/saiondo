import { Module } from '@nestjs/common';
import { PersonaProfileService } from './persona-profile.service';
import { PersonaProfileController } from './persona-profile.controller';
import { LlmModule } from '../llm/llm.module';
import {PrismaService} from "@common/prisma/prisma.service";

@Module({
  imports: [LlmModule],
  controllers: [PersonaProfileController],
  providers: [PersonaProfileService, PrismaService],
  exports: [PersonaProfileService],
})
export class PersonaProfileModule {}
