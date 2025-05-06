import {Module} from '@nestjs/common';
import {UserRepository} from "../user.repository";

@Module({
  exports: [UserRepository],
})
export class DocumentUserPersistenceModule {}
