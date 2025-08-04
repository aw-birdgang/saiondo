import { ChannelEntity } from '../entities/Channel';
import { UserEntity } from '../entities/User';
import { ChannelId } from '../value-objects/ChannelId';
import { UserId } from '../value-objects/UserId';
import { ChannelType } from '../types/ChannelType';

/**
 * 채널 도메인 서비스
 * 채널 관련 복잡한 비즈니스 로직을 처리하는 도메인 서비스
 */
export class ChannelDomainService {
  /**
   * 채널 생성이 가능한지 확인
   */
  canCreateChannel(user: UserEntity, channelType: ChannelType): boolean {
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

    // 특정 채널 타입에 대한 추가 권한 확인
    if (channelType === ChannelType.PRIVATE && !user.hasPermission('CREATE_PRIVATE_CHANNEL')) {
      return false;
    }

    return true;
  }

  /**
   * 채널 삭제가 가능한지 확인
   */
  canDeleteChannel(user: UserEntity, channel: ChannelEntity): boolean {
    // 사용자가 활성 상태인지 확인
    if (!user.isActive()) {
      return false;
    }

    // 사용자가 채널 소유자인지 확인
    if (channel.ownerId !== user.id) {
      return false;
    }

    // 사용자가 채널 삭제 권한이 있는지 확인
    if (!user.hasPermission('DELETE_CHANNEL')) {
      return false;
    }

    return true;
  }

  /**
   * 채널 설정 변경이 가능한지 확인
   */
  canModifyChannel(user: UserEntity, channel: ChannelEntity): boolean {
    // 사용자가 활성 상태인지 확인
    if (!user.isActive()) {
      return false;
    }

    // 사용자가 채널 소유자이거나 관리자인지 확인
    if (channel.ownerId !== user.id && !user.hasRole('ADMIN')) {
      return false;
    }

    // 사용자가 채널 수정 권한이 있는지 확인
    if (!user.hasPermission('MODIFY_CHANNEL')) {
      return false;
    }

    return true;
  }

  /**
   * 채널 멤버 관리가 가능한지 확인
   */
  canManageMembers(user: UserEntity, channel: ChannelEntity): boolean {
    // 사용자가 활성 상태인지 확인
    if (!user.isActive()) {
      return false;
    }

    // 사용자가 채널에 있는지 확인
    if (!channel.hasUser(user.id)) {
      return false;
    }

    // 사용자가 채널 소유자이거나 관리자인지 확인
    if (channel.ownerId !== user.id && !user.hasRole('ADMIN')) {
      return false;
    }

    // 사용자가 멤버 관리 권한이 있는지 확인
    if (!user.hasPermission('MANAGE_CHANNEL_MEMBERS')) {
      return false;
    }

    return true;
  }

  /**
   * 채널 초대가 가능한지 확인
   */
  canInviteToChannel(
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

    // 초대받는 사용자가 채널에서 차단되었는지 확인
    if (channel.isUserBlocked(invitee.id)) {
      return false;
    }

    // 채널이 가득 찼는지 확인
    if (channel.isFull()) {
      return false;
    }

    // 초대자가 초대 권한이 있는지 확인
    if (!inviter.hasPermission('INVITE_USERS')) {
      return false;
    }

    return true;
  }

  /**
   * 채널에서 사용자 차단이 가능한지 확인
   */
  canBlockUser(blocker: UserEntity, blockedUser: UserEntity, channel: ChannelEntity): boolean {
    // 차단하는 사용자가 활성 상태인지 확인
    if (!blocker.isActive()) {
      return false;
    }

    // 차단받는 사용자가 활성 상태인지 확인
    if (!blockedUser.isActive()) {
      return false;
    }

    // 차단하는 사용자가 채널에 있는지 확인
    if (!channel.hasUser(blocker.id)) {
      return false;
    }

    // 차단받는 사용자가 채널에 있는지 확인
    if (!channel.hasUser(blockedUser.id)) {
      return false;
    }

    // 차단하는 사용자가 채널 소유자이거나 관리자인지 확인
    if (channel.ownerId !== blocker.id && !blocker.hasRole('ADMIN')) {
      return false;
    }

    // 차단하는 사용자가 차단 권한이 있는지 확인
    if (!blocker.hasPermission('BLOCK_USERS')) {
      return false;
    }

    return true;
  }

  /**
   * 채널 타입별 최대 멤버 수 계산
   */
  calculateMaxMembers(channelType: ChannelType): number {
    switch (channelType) {
      case ChannelType.DIRECT:
        return 2;
      case ChannelType.PRIVATE:
        return 50;
      case ChannelType.PUBLIC:
        return 1000;
      default:
        return 100;
    }
  }

  /**
   * 채널 이름 유효성 검사
   */
  isValidChannelName(name: string): boolean {
    if (!name || name.trim().length === 0) {
      return false;
    }

    if (name.length > 50) {
      return false;
    }

    // 특수 문자 제한
    const invalidChars = /[<>:"/\\|?*]/;
    if (invalidChars.test(name)) {
      return false;
    }

    return true;
  }
} 