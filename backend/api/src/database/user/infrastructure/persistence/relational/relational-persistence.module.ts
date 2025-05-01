import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {UserEntity} from "./entities/user.entity";
import { UserRepository } from "../user.repository";
import {UserRelationalRepository} from "./repositories/user.repository";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    {
      provide: UserRepository,
      useClass: UserRelationalRepository,
    },
  ],
  exports: [UserRepository],
})
export class RelationalUserPersistenceModule {}
