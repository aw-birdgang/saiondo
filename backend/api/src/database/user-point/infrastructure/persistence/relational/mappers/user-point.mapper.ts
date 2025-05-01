import {UserPoint} from "../../../../domain/user-point";
import {UserPointEntity} from "../entities/user-point.entity";

export class UserPointMapper {
  static toDomain(raw: UserPointEntity): UserPoint {
    const domainEntity = new UserPoint();
    domainEntity.id = raw.id;
    domainEntity.userId = raw.userId;
    domainEntity.activityType = raw.activityType;
    domainEntity.points = raw.points;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    return domainEntity;
  }

  static toPersistence(domainEntity: UserPoint): UserPointEntity {
    const persistenceEntity = new UserPointEntity();
    persistenceEntity.id = domainEntity.id;
    persistenceEntity.userId = domainEntity.userId;
    persistenceEntity.activityType = domainEntity.activityType;
    persistenceEntity.points = domainEntity.points;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    return persistenceEntity;
  }
}
