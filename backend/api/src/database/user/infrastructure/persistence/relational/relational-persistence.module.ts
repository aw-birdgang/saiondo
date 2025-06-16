import {Module} from '@nestjs/common';
import {RelationalUserRepository} from './repositories/user.repository';
import {PrismaService} from "@common/prisma/prisma.service";

@Module({
  providers: [
    PrismaService,
    RelationalUserRepository,
  ],
  exports: [
    RelationalUserRepository,
  ],
})
export class RelationalUserPersistenceModule {}
