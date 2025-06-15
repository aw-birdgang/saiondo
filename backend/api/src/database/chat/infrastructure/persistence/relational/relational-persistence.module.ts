import {Module} from '@nestjs/common';
import {PrismaService} from '@common/prisma/prisma.service';
import {RelationalChatRepository} from "./repositories/chat.repository";

@Module({
  providers: [RelationalChatRepository, PrismaService],
  exports: [RelationalChatRepository],
})
export class RelationalChatPersistenceModule {}
