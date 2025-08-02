import type { IMessageRepository } from '../repositories/IMessageRepository';
import type { IChannelRepository } from '../repositories/IChannelRepository';
import type { Message } from '../entities/Message';
import { MessageEntity } from '../entities/Message';
import { DomainErrorFactory } from '../errors/DomainError';

export interface FileUploadRequest {
  file: File;
  channelId: string;
  senderId: string;
  description?: string;
}

export interface FileUploadResponse {
  message: Message;
  fileUrl: string;
  fileSize: number;
  fileName: string;
}

export class UploadFileUseCase {
  constructor(
    private readonly messageRepository: IMessageRepository,
    private readonly channelRepository: IChannelRepository
  ) {}

  async execute(request: FileUploadRequest): Promise<FileUploadResponse> {
    try {
      // Validate request
      if (!request.file) {
        throw DomainErrorFactory.createMessageValidation('File is required');
      }

      if (!request.channelId || request.channelId.trim().length === 0) {
        throw DomainErrorFactory.createMessageValidation('Channel ID is required');
      }

      if (!request.senderId || request.senderId.trim().length === 0) {
        throw DomainErrorFactory.createMessageValidation('Sender ID is required');
      }

      // Validate file size (max 10MB)
      const maxFileSize = 10 * 1024 * 1024; // 10MB
      if (request.file.size > maxFileSize) {
        throw DomainErrorFactory.createMessageValidation('File size must be less than 10MB');
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
      if (!allowedTypes.includes(request.file.type)) {
        throw DomainErrorFactory.createMessageValidation('File type not supported');
      }

      // Check if sender is member of the channel
      const isMember = await this.channelRepository.isMember(request.channelId, request.senderId);
      if (!isMember) {
        throw DomainErrorFactory.createMessageValidation('Sender is not a member of this channel');
      }

      // Upload file (in real implementation, this would upload to cloud storage)
      const fileUrl = await this.uploadFileToStorage(request.file);
      const fileName = request.file.name;
      const fileSize = request.file.size;

      // Determine message type based on file type
      const messageType = this.getMessageTypeFromFile(request.file.type);

      // Create message with file metadata
      const messageEntity = MessageEntity.create({
        content: request.description || `Uploaded file: ${fileName}`,
        channelId: request.channelId,
        senderId: request.senderId,
        type: messageType,
        metadata: {
          fileUrl,
          fileName,
          fileSize,
          originalName: fileName,
          mimeType: request.file.type,
        },
      });

      // Save message
      const savedMessage = await this.messageRepository.save(messageEntity);

      // Update channel's last message timestamp
      await this.channelRepository.updateLastMessage(request.channelId);

      return {
        message: savedMessage.toJSON(),
        fileUrl,
        fileSize,
        fileName,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation('Failed to upload file');
    }
  }

  private async uploadFileToStorage(file: File): Promise<string> {
    // In real implementation, this would upload to cloud storage (AWS S3, Google Cloud Storage, etc.)
    // For now, we'll simulate the upload and return a mock URL
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate mock file URL
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    return `https://storage.example.com/files/${timestamp}_${randomId}_${file.name}`;
  }

  private getMessageTypeFromFile(mimeType: string): 'text' | 'image' | 'file' | 'system' {
    if (mimeType.startsWith('image/')) {
      return 'image';
    }
    return 'file';
  }
} 