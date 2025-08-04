import { MessageEntity } from '../entities/Message';
import { UserEntity } from '../entities/User';
import { ChannelEntity } from '../entities/Channel';
import { DomainError } from '../errors/DomainError';

export class MessagePermissionError extends DomainError {
  constructor(userId: string, messageId: string) {
    super(`User ${userId} does not have permission to access message ${messageId}`, 'MESSAGE_PERMISSION_ERROR', { userId, messageId });
  }
}

export class MessageDomainService {
  /**
   * 메시지가 유효한지 검증
   */
  validateMessage(message: MessageEntity): boolean {
    return (
      message.content.trim().length > 0 &&
      message.content.length <= 1000 &&
      message.senderId !== null &&
      message.channelId !== null
    );
  }

  /**
   * 사용자가 메시지를 읽을 수 있는 권한이 있는지 확인
   */
  canUserReadMessage(user: UserEntity, message: MessageEntity, channel: ChannelEntity): boolean {
    // 채널에 속해있는지 확인
    if (!channel.hasUser(user.id)) {
      return false;
    }

    // 메시지가 공개 채널이거나 사용자가 메시지 작성자인 경우
    return channel.type === 'public' || message.senderId === user.id;
  }

  /**
   * 사용자가 메시지를 수정할 수 있는 권한이 있는지 확인
   */
  canUserEditMessage(user: UserEntity, message: MessageEntity): boolean {
    return message.senderId === user.id;
  }

  /**
   * 사용자가 메시지를 삭제할 수 있는 권한이 있는지 확인
   */
  canUserDeleteMessage(user: UserEntity, message: MessageEntity, channel: ChannelEntity): boolean {
    // 메시지 작성자이거나 채널 소유자인 경우
    return message.senderId === user.id || channel.ownerId === user.id;
  }

  /**
   * 메시지 검색을 위한 키워드 추출
   */
  extractSearchKeywords(content: string): string[] {
    return content
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length >= 2)
      .slice(0, 10); // 최대 10개 키워드
  }

  /**
   * 메시지 내용에서 멘션된 사용자 ID 추출
   */
  extractMentions(content: string): string[] {
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match;

    while ((match = mentionRegex.exec(content)) !== null) {
      mentions.push(match[1]);
    }

    return mentions;
  }

  /**
   * 메시지 내용에서 해시태그 추출
   */
  extractHashtags(content: string): string[] {
    const hashtagRegex = /#(\w+)/g;
    const hashtags: string[] = [];
    let match;

    while ((match = hashtagRegex.exec(content)) !== null) {
      hashtags.push(match[1].toLowerCase());
    }

    return hashtags;
  }

  /**
   * 메시지 내용 필터링 (부적절한 내용 제거)
   */
  filterInappropriateContent(content: string): string {
    const inappropriateWords = ['spam', 'inappropriate', 'banned'];
    let filteredContent = content;

    inappropriateWords.forEach(word => {
      const regex = new RegExp(word, 'gi');
      filteredContent = filteredContent.replace(regex, '*'.repeat(word.length));
    });

    return filteredContent;
  }

  /**
   * 메시지 우선순위 계산 (멘션, 해시태그, 길이 등 고려)
   */
  calculateMessagePriority(message: MessageEntity): number {
    let priority = 0;

    // 멘션이 있으면 우선순위 증가
    const mentions = this.extractMentions(message.content);
    priority += mentions.length * 10;

    // 해시태그가 있으면 우선순위 증가
    const hashtags = this.extractHashtags(message.content);
    priority += hashtags.length * 5;

    // 긴 메시지는 우선순위 증가
    if (message.content.length > 100) {
      priority += 3;
    }

    // 메타데이터가 있으면 우선순위 증가
    if (message.metadata && Object.keys(message.metadata).length > 0) {
      priority += 5;
    }

    return priority;
  }

  /**
   * 메시지 그룹화 (같은 사용자의 연속 메시지)
   */
  shouldGroupWithPreviousMessage(
    currentMessage: MessageEntity,
    previousMessage: MessageEntity | null
  ): boolean {
    if (!previousMessage) return false;

    const timeDiff = currentMessage.createdAt.getTime() - previousMessage.createdAt.getTime();
    const maxTimeDiff = 5 * 60 * 1000; // 5분

    return (
      currentMessage.senderId === previousMessage.senderId &&
      currentMessage.channelId === previousMessage.channelId &&
      timeDiff <= maxTimeDiff
    );
  }
} 