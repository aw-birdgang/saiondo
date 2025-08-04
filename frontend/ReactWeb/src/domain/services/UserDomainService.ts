import { UserEntity } from '../entities/User';
import { ChannelEntity } from '../entities/Channel';
import { UserId } from '../value-objects/UserId';
import { ChannelId } from '../value-objects/ChannelId';
import { UserStatus } from '../types/UserStatus';
import { ChannelType } from '../types/ChannelType';

/**
 * 사용자 도메인 서비스
 * 복잡한 비즈니스 로직을 처리하는 도메인 서비스
 */
export class UserDomainService {
  /**
   * 사용자가 채널에 참여할 수 있는지 확인
   */
  canUserJoinChannel(user: UserEntity, channel: ChannelEntity): boolean {
    // 사용자가 활성 상태인지 확인
    if (!user.isActive()) {
      return false;
    }

    // 채널이 공개 채널인지 확인
    if (channel.type !== ChannelType.PUBLIC) {
      return false;
    }

    // 사용자가 이미 채널에 있는지 확인
    if (channel.hasUser(user.id)) {
      return false;
    }

    // 채널이 가득 찼는지 확인 (최대 멤버 수 제한)
    if (channel.isFull()) {
      return false;
    }

    return true;
  }

  /**
   * 사용자가 메시지를 보낼 수 있는지 확인
   */
  canUserSendMessage(user: UserEntity, channel: ChannelEntity): boolean {
    // 사용자가 활성 상태인지 확인
    if (!user.isActive()) {
      return false;
    }

    // 사용자가 채널에 있는지 확인
    if (!channel.hasUser(user.id)) {
      return false;
    }

    // 사용자가 채널에서 차단되었는지 확인
    if (channel.isUserBlocked(user.id)) {
      return false;
    }

    return true;
  }

  /**
   * 사용자가 채널을 생성할 수 있는지 확인
   */
  canUserCreateChannel(user: UserEntity): boolean {
    // 사용자가 활성 상태인지 확인
    if (!user.isActive()) {
      return false;
    }

    // 사용자가 채널 생성 권한이 있는지 확인
    if (!user.hasPermission('CREATE_CHANNEL')) {
      return false;
    }

    // 사용자가 생성한 채널 수가 제한을 초과하지 않았는지 확인
    if (user.createdChannelsCount >= user.maxChannelsAllowed) {
      return false;
    }

    return true;
  }

  /**
   * 사용자가 다른 사용자를 초대할 수 있는지 확인
   */
  canUserInviteToChannel(
    inviter: UserEntity, 
    invitee: UserEntity, 
    channel: ChannelEntity
  ): boolean {
    // 초대자가 활성 상태인지 확인
    if (!inviter.isActive()) {
      return false;
    }

    // 초대받는 사용자가 활성 상태인지 확인
    if (!invitee.isActive()) {
      return false;
    }

    // 초대자가 채널에 있는지 확인
    if (!channel.hasUser(inviter.id)) {
      return false;
    }

    // 초대받는 사용자가 이미 채널에 있는지 확인
    if (channel.hasUser(invitee.id)) {
      return false;
    }

    // 초대자가 초대 권한이 있는지 확인
    if (!inviter.hasPermission('INVITE_USERS')) {
      return false;
    }

    return true;
  }

  /**
   * 사용자 상태를 업데이트할 수 있는지 확인
   */
  canUpdateUserStatus(user: UserEntity, newStatus: UserStatus): boolean {
    // 현재 상태와 동일한지 확인
    if (user.status === newStatus) {
      return false;
    }

    // 상태 변경이 허용되는지 확인
    if (!user.canChangeStatusTo(newStatus)) {
      return false;
    }

    return true;
  }

  /**
   * 사용자 프로필을 업데이트할 수 있는지 확인
   */
  canUpdateUserProfile(user: UserEntity): boolean {
    // 사용자가 활성 상태인지 확인
    if (!user.isActive()) {
      return false;
    }

    // 사용자가 프로필 업데이트 권한이 있는지 확인
    if (!user.hasPermission('UPDATE_PROFILE')) {
      return false;
    }

    return true;
  }

  /**
   * 사용자 간 친구 관계를 확인
   */
  areUsersFriends(user1: UserEntity, user2: UserEntity): boolean {
    return user1.isFriendWith(user2.id) && user2.isFriendWith(user1.id);
  }

  /**
   * 사용자가 관리자인지 확인
   */
  isUserAdmin(user: UserEntity): boolean {
    return user.hasRole('ADMIN') || user.hasRole('SUPER_ADMIN');
  }

  /**
   * 사용자가 모더레이터인지 확인
   */
  isUserModerator(user: UserEntity): boolean {
    return user.hasRole('MODERATOR') || this.isUserAdmin(user);
  }
} 