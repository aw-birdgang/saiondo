import type { Message } from '../dto/MessageDto';

export class MessageEntity {
  private constructor(
    private readonly _id: string,
    private readonly _content: string,
    private readonly _channelId: string,
    private readonly _senderId: string,
    private readonly _type: 'text' | 'image' | 'file' | 'system',
    private readonly _metadata: Record<string, unknown> | undefined,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date,
    private readonly _isEdited: boolean,
    private readonly _replyTo: string | undefined
  ) {
    this.validate();
  }

  // Factory method
  static create(
    messageData: Omit<Message, 'id' | 'createdAt' | 'updatedAt' | 'isEdited'>
  ): MessageEntity {
    return new MessageEntity(
      crypto.randomUUID(),
      messageData.content,
      messageData.channelId,
      messageData.senderId,
      messageData.type,
      messageData.metadata,
      new Date(),
      new Date(),
      false,
      messageData.replyTo
    );
  }

  static fromData(messageData: Message): MessageEntity {
    return new MessageEntity(
      messageData.id,
      messageData.content,
      messageData.channelId,
      messageData.senderId,
      messageData.type,
      messageData.metadata,
      messageData.createdAt,
      messageData.updatedAt,
      messageData.isEdited,
      messageData.replyTo
    );
  }

  // Validation
  private validate(): void {
    if (!this._id || this._id.trim().length === 0) {
      throw new Error('Message ID is required');
    }

    if (!this._content || this._content.trim().length === 0) {
      throw new Error('Message content is required');
    }

    if (this._content.length > 2000) {
      throw new Error('Message content must be less than 2000 characters');
    }

    if (!this._channelId || this._channelId.trim().length === 0) {
      throw new Error('Channel ID is required');
    }

    if (!this._senderId || this._senderId.trim().length === 0) {
      throw new Error('Sender ID is required');
    }

    if (!['text', 'image', 'file', 'system'].includes(this._type)) {
      throw new Error('Invalid message type');
    }
  }

  // Business methods
  editContent(newContent: string): MessageEntity {
    if (newContent.trim().length === 0) {
      throw new Error('Message content cannot be empty');
    }

    if (newContent.length > 2000) {
      throw new Error('Message content must be less than 2000 characters');
    }

    return new MessageEntity(
      this._id,
      newContent,
      this._channelId,
      this._senderId,
      this._type,
      this._metadata,
      this._createdAt,
      new Date(),
      true,
      this._replyTo
    );
  }

  addMetadata(key: string, value: unknown): MessageEntity {
    const newMetadata = { ...this._metadata, [key]: value };

    return new MessageEntity(
      this._id,
      this._content,
      this._channelId,
      this._senderId,
      this._type,
      newMetadata,
      this._createdAt,
      new Date(),
      this._isEdited,
      this._replyTo
    );
  }

  isFromUser(userId: string): boolean {
    return this._senderId === userId;
  }

  isSystemMessage(): boolean {
    return this._type === 'system';
  }

  isEditable(): boolean {
    return this._type === 'text' && !this.isSystemMessage();
  }

  // Getters
  get id(): string {
    return this._id;
  }
  get content(): string {
    return this._content;
  }
  get channelId(): string {
    return this._channelId;
  }
  get senderId(): string {
    return this._senderId;
  }
  get type(): 'text' | 'image' | 'file' | 'system' {
    return this._type;
  }
  get metadata(): Record<string, unknown> | undefined {
    return this._metadata;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }
  get isEdited(): boolean {
    return this._isEdited;
  }
  get replyTo(): string | undefined {
    return this._replyTo;
  }

  // Data transfer
  toJSON(): Message {
    return {
      id: this._id,
      content: this._content,
      channelId: this._channelId,
      senderId: this._senderId,
      type: this._type,
      metadata: this._metadata,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      isEdited: this._isEdited,
      replyTo: this._replyTo,
    };
  }
}
