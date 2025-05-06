import {User} from "../../../../domain/user";
import {UserEntity} from "../entities/user.entity";
import {Gender} from "@prisma/client";

export class UserMapper {
  /**
   * 영속성 엔티티(UserEntity)를 도메인 엔티티(User)로 변환
   */
  static toDomain(raw: UserEntity): User {
    const domainEntity = new User();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    domainEntity.birthDate = raw.birthDate;
    domainEntity.gender = raw.gender as Gender;
    domainEntity.mbti = raw.mbti;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  /**
   * 도메인 엔티티(User)를 영속성 엔티티(UserEntity)로 변환
   */
  static toPersistence(domainEntity: User): UserEntity {
    const persistenceEntity = new UserEntity();

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }

    persistenceEntity.name = domainEntity.name;
    persistenceEntity.birthDate = domainEntity.birthDate;
    persistenceEntity.gender = domainEntity.gender;
    persistenceEntity.mbti = domainEntity.mbti;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }

  /**
   * 도메인 엔티티 배열을 영속성 엔티티 배열로 변환
   */
  static toPersistenceList(domainEntities: User[]): UserEntity[] {
    return domainEntities.map(entity => this.toPersistence(entity));
  }

  /**
   * 영속성 엔티티 배열을 도메인 엔티티 배열로 변환
   */
  static toDomainList(persistenceEntities: UserEntity[]): User[] {
    return persistenceEntities.map(entity => this.toDomain(entity));
  }
}
