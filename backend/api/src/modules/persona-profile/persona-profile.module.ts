import { Module } from '@nestjs/common';
import { PersonaProfileService } from './persona-profile.service';
import { PersonaProfileController } from './persona-profile.controller';

@Module({
  controllers: [PersonaProfileController],
  providers: [PersonaProfileService],
  exports: [PersonaProfileService],
})
export class PersonaProfileModule {}
