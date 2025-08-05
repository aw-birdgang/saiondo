import { MessageDomainService } from '../../domain/services/MessageDomainService';
import { MessageEntity } from '../../domain/entities/Message';
import { UserEntity } from '../../domain/entities/User';
import { ChannelEntity } from '../../domain/entities/Channel';

describe('MessageDomainService', () => {
  let messageService: MessageDomainService;
  let mockUser: UserEntity;
  let mockChannel: ChannelEntity;
  let mockMessage: MessageEntity;

  beforeEach(() => {
    messageService = new MessageDomainService();

    // Mock entities 생성
    mockUser = UserEntity.create({
      email: 'test@example.com',
      name: 'Test User',
    });

    mockChannel = ChannelEntity.create({
      name: 'Test Channel',
      type: 'public',
      ownerId: mockUser.id,
      members: [mockUser.id],
      maxMembers: 100,
    });

    mockMessage = MessageEntity.create({
      content: 'Test message content',
      channelId: mockChannel.id,
      senderId: mockUser.id,
      type: 'text',
    });
  });

  describe('validateMessage', () => {
    it('should return true for valid message', () => {
      const isValid = messageService.validateMessage(mockMessage);
      expect(isValid).toBe(true);
    });

    it('should return false for empty content', () => {
      const emptyMessage = MessageEntity.create({
        content: '',
        channelId: mockChannel.id,
        senderId: mockUser.id,
        type: 'text',
      });

      const isValid = messageService.validateMessage(emptyMessage);
      expect(isValid).toBe(false);
    });

    it('should return false for message with only whitespace', () => {
      const whitespaceMessage = MessageEntity.create({
        content: '   ',
        channelId: mockChannel.id,
        senderId: mockUser.id,
        type: 'text',
      });

      const isValid = messageService.validateMessage(whitespaceMessage);
      expect(isValid).toBe(false);
    });

    it('should return false for message exceeding 1000 characters', () => {
      const longContent = 'a'.repeat(1001);
      const longMessage = MessageEntity.create({
        content: longContent,
        channelId: mockChannel.id,
        senderId: mockUser.id,
        type: 'text',
      });

      const isValid = messageService.validateMessage(longMessage);
      expect(isValid).toBe(false);
    });
  });

  describe('canUserReadMessage', () => {
    it('should return true for channel member', () => {
      const canRead = messageService.canUserReadMessage(
        mockUser,
        mockMessage,
        mockChannel
      );
      expect(canRead).toBe(true);
    });

    it('should return false for non-channel member', () => {
      const otherUser = UserEntity.create({
        email: 'other@example.com',
        name: 'Other User',
      });

      const canRead = messageService.canUserReadMessage(
        otherUser,
        mockMessage,
        mockChannel
      );
      expect(canRead).toBe(false);
    });

    it('should return true for message sender even in private channel', () => {
      const privateChannel = ChannelEntity.create({
        name: 'Private Channel',
        type: 'private',
        ownerId: mockUser.id,
        members: [mockUser.id],
        maxMembers: 100,
      });

      const canRead = messageService.canUserReadMessage(
        mockUser,
        mockMessage,
        privateChannel
      );
      expect(canRead).toBe(true);
    });
  });

  describe('canUserEditMessage', () => {
    it('should return true for message sender', () => {
      const canEdit = messageService.canUserEditMessage(mockUser, mockMessage);
      expect(canEdit).toBe(true);
    });

    it('should return false for non-sender', () => {
      const otherUser = UserEntity.create({
        email: 'other@example.com',
        name: 'Other User',
      });

      const canEdit = messageService.canUserEditMessage(otherUser, mockMessage);
      expect(canEdit).toBe(false);
    });
  });

  describe('canUserDeleteMessage', () => {
    it('should return true for message sender', () => {
      const canDelete = messageService.canUserDeleteMessage(
        mockUser,
        mockMessage,
        mockChannel
      );
      expect(canDelete).toBe(true);
    });

    it('should return true for channel owner', () => {
      const otherUser = UserEntity.create({
        email: 'other@example.com',
        name: 'Other User',
      });

      const messageFromOther = MessageEntity.create({
        content: 'Message from other user',
        channelId: mockChannel.id,
        senderId: otherUser.id,
        type: 'text',
      });

      const canDelete = messageService.canUserDeleteMessage(
        mockUser,
        messageFromOther,
        mockChannel
      );
      expect(canDelete).toBe(true);
    });

    it('should return false for regular user', () => {
      const otherUser = UserEntity.create({
        email: 'other@example.com',
        name: 'Other User',
      });

      const messageFromOther = MessageEntity.create({
        content: 'Message from other user',
        channelId: mockChannel.id,
        senderId: otherUser.id,
        type: 'text',
      });

      const regularUser = UserEntity.create({
        email: 'regular@example.com',
        name: 'Regular User',
      });

      const canDelete = messageService.canUserDeleteMessage(
        regularUser,
        messageFromOther,
        mockChannel
      );
      expect(canDelete).toBe(false);
    });
  });

  describe('extractSearchKeywords', () => {
    it('should extract keywords from content', () => {
      const content = 'Hello world this is a test message';
      const keywords = messageService.extractSearchKeywords(content);

      expect(keywords).toEqual([
        'hello',
        'world',
        'this',
        'is',
        'a',
        'test',
        'message',
      ]);
    });

    it('should filter out short words', () => {
      const content = 'a b c hello world test';
      const keywords = messageService.extractSearchKeywords(content);

      expect(keywords).toEqual(['hello', 'world', 'test']);
    });

    it('should limit to 10 keywords', () => {
      const content =
        'one two three four five six seven eight nine ten eleven twelve';
      const keywords = messageService.extractSearchKeywords(content);

      expect(keywords).toHaveLength(10);
    });

    it('should handle empty content', () => {
      const keywords = messageService.extractSearchKeywords('');
      expect(keywords).toEqual([]);
    });
  });

  describe('extractMentions', () => {
    it('should extract user mentions', () => {
      const content = 'Hello @user1 and @user2, how are you?';
      const mentions = messageService.extractMentions(content);

      expect(mentions).toEqual(['user1', 'user2']);
    });

    it('should handle no mentions', () => {
      const content = 'Hello world, how are you?';
      const mentions = messageService.extractMentions(content);

      expect(mentions).toEqual([]);
    });

    it('should handle multiple mentions of same user', () => {
      const content = 'Hello @user1, @user1 again!';
      const mentions = messageService.extractMentions(content);

      expect(mentions).toEqual(['user1', 'user1']);
    });
  });

  describe('extractHashtags', () => {
    it('should extract hashtags', () => {
      const content = 'Hello world #react #typescript #testing';
      const hashtags = messageService.extractHashtags(content);

      expect(hashtags).toEqual(['react', 'typescript', 'testing']);
    });

    it('should convert hashtags to lowercase', () => {
      const content = 'Hello #React #TypeScript #TESTING';
      const hashtags = messageService.extractHashtags(content);

      expect(hashtags).toEqual(['react', 'typescript', 'testing']);
    });

    it('should handle no hashtags', () => {
      const content = 'Hello world, how are you?';
      const hashtags = messageService.extractHashtags(content);

      expect(hashtags).toEqual([]);
    });
  });

  describe('filterInappropriateContent', () => {
    it('should filter inappropriate words', () => {
      const content = 'This is a spam message with inappropriate content';
      const filtered = messageService.filterInappropriateContent(content);

      expect(filtered).toBe(
        'This is a **** message with *************** content'
      );
    });

    it('should handle case insensitive filtering', () => {
      const content = 'This is a SPAM message with INAPPROPRIATE content';
      const filtered = messageService.filterInappropriateContent(content);

      expect(filtered).toBe(
        'This is a **** message with *************** content'
      );
    });

    it('should return original content if no inappropriate words', () => {
      const content = 'This is a normal message';
      const filtered = messageService.filterInappropriateContent(content);

      expect(filtered).toBe(content);
    });
  });

  describe('calculateMessagePriority', () => {
    it('should calculate priority based on mentions', () => {
      const messageWithMentions = MessageEntity.create({
        content: 'Hello @user1 @user2',
        channelId: mockChannel.id,
        senderId: mockUser.id,
        type: 'text',
      });

      const priority =
        messageService.calculateMessagePriority(messageWithMentions);
      expect(priority).toBe(20); // 2 mentions * 10
    });

    it('should calculate priority based on hashtags', () => {
      const messageWithHashtags = MessageEntity.create({
        content: 'Hello #react #typescript',
        channelId: mockChannel.id,
        senderId: mockUser.id,
        type: 'text',
      });

      const priority =
        messageService.calculateMessagePriority(messageWithHashtags);
      expect(priority).toBe(10); // 2 hashtags * 5
    });

    it('should calculate priority for long message', () => {
      const longContent = 'a'.repeat(101);
      const longMessage = MessageEntity.create({
        content: longContent,
        channelId: mockChannel.id,
        senderId: mockUser.id,
        type: 'text',
      });

      const priority = messageService.calculateMessagePriority(longMessage);
      expect(priority).toBe(3); // long message bonus
    });

    it('should calculate combined priority', () => {
      const complexMessage = MessageEntity.create({
        content: 'Hello @user1 @user2 #react #typescript ' + 'a'.repeat(101),
        channelId: mockChannel.id,
        senderId: mockUser.id,
        type: 'text',
      });

      const priority = messageService.calculateMessagePriority(complexMessage);
      expect(priority).toBe(33); // 2 mentions * 10 + 2 hashtags * 5 + 3 for long message
    });
  });

  describe('shouldGroupWithPreviousMessage', () => {
    it('should return true for consecutive messages from same user', () => {
      const previousMessage = MessageEntity.create({
        content: 'First message',
        channelId: mockChannel.id,
        senderId: mockUser.id,
        type: 'text',
      });

      const currentMessage = MessageEntity.create({
        content: 'Second message',
        channelId: mockChannel.id,
        senderId: mockUser.id,
        type: 'text',
      });

      const shouldGroup = messageService.shouldGroupWithPreviousMessage(
        currentMessage,
        previousMessage
      );
      expect(shouldGroup).toBe(true);
    });

    it('should return false for messages from different users', () => {
      const otherUser = UserEntity.create({
        email: 'other@example.com',
        name: 'Other User',
      });

      const previousMessage = MessageEntity.create({
        content: 'First message',
        channelId: mockChannel.id,
        senderId: mockUser.id,
        type: 'text',
      });

      const currentMessage = MessageEntity.create({
        content: 'Second message',
        channelId: mockChannel.id,
        senderId: otherUser.id,
        type: 'text',
      });

      const shouldGroup = messageService.shouldGroupWithPreviousMessage(
        currentMessage,
        previousMessage
      );
      expect(shouldGroup).toBe(false);
    });

    it('should return false for messages in different channels', () => {
      const otherChannel = ChannelEntity.create({
        name: 'Other Channel',
        type: 'public',
        ownerId: mockUser.id,
        members: [mockUser.id],
        maxMembers: 100,
      });

      const previousMessage = MessageEntity.create({
        content: 'First message',
        channelId: mockChannel.id,
        senderId: mockUser.id,
        type: 'text',
      });

      const currentMessage = MessageEntity.create({
        content: 'Second message',
        channelId: otherChannel.id,
        senderId: mockUser.id,
        type: 'text',
      });

      const shouldGroup = messageService.shouldGroupWithPreviousMessage(
        currentMessage,
        previousMessage
      );
      expect(shouldGroup).toBe(false);
    });

    it('should return false when no previous message', () => {
      const shouldGroup = messageService.shouldGroupWithPreviousMessage(
        mockMessage,
        null
      );
      expect(shouldGroup).toBe(false);
    });
  });
});
