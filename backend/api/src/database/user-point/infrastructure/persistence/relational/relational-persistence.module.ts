import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {UserPointEntity} from "./entities/user-point.entity";
import { UserPointRepository } from "../user-point.repository";
import {UserPointRelationalRepository} from "./repositories/user-point.repository";

@Module({
  imports: [TypeOrmModule.forFeature([UserPointEntity])],
  providers: [
    {
      provide: UserPointRepository,
      useClass: UserPointRelationalRepository,
    },
  ],
  exports: [UserPointRepository],
})
export class RelationalUserPointPersistenceModule {}
