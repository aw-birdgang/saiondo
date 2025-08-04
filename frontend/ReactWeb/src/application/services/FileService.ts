import type { IMessageRepository } from '../../domain/repositories/IMessageRepository';
import type { IChannelRepository } from '../../domain/repositories/IChannelRepository';
import { MessageEntity } from '../../domain/entities/Message';
import { DomainErrorFactory } from '../../domain/errors/DomainError';

export interface FileUploadRequest {
  file: File;
  channelId: string;
  senderId: string;
  description?: string;
}

export interface FileUploadResponse {
  message: any;
  fileUrl: string;
  fileSize: number;
  fileName: string;
}

export interface FileDownloadRequest {
  fileUrl: string;
  fileName: string;
}

export interface FileDownloadResponse {
  success: boolean;
  downloadUrl: string;
  expiresAt: Date;
}

export class FileService {
  private readonly maxFileSize = 10 * 1024 * 1024; // 10MB
  private readonly allowedTypes = [
    'image/jpeg',
    'image/png', 
    'image/gif',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  constructor(
    private readonly messageRepository: IMessageRepository,
    private readonly channelRepository: IChannelRepository
  ) {}

  async uploadFile(request: FileUploadRequest): Promise<FileUploadResponse> {
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

    // Validate file size
    if (request.file.size > this.maxFileSize) {
      throw DomainErrorFactory.createMessageValidation('File size must be less than 10MB');
    }

    // Validate file type
    if (!this.allowedTypes.includes(request.file.type)) {
      throw DomainErrorFactory.createMessageValidation('File type not supported');
    }

    // Check if sender is member of the channel
    const isMember = await this.channelRepository.isMember(request.channelId, request.senderId);
    if (!isMember) {
      throw DomainErrorFactory.createMessageValidation('Sender is not a member of this channel');
    }

    // Upload file to storage
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
  }

  async downloadFile(request: FileDownloadRequest): Promise<FileDownloadResponse> {
    // Validate request
    if (!request.fileUrl || request.fileUrl.trim().length === 0) {
      throw DomainErrorFactory.createMessageValidation('File URL is required');
    }

    if (!request.fileName || request.fileName.trim().length === 0) {
      throw DomainErrorFactory.createMessageValidation('File name is required');
    }

    // Generate signed download URL (in real implementation, this would use cloud storage SDK)
    const downloadUrl = await this.generateSignedDownloadUrl(request.fileUrl);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    return {
      success: true,
      downloadUrl,
      expiresAt,
    };
  }

  async validateFile(file: File): Promise<{ isValid: boolean; error?: string }> {
    // Check file size
    if (file.size > this.maxFileSize) {
      return {
        isValid: false,
        error: 'File size must be less than 10MB',
      };
    }

    // Check file type
    if (!this.allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'File type not supported',
      };
    }

    // Check file name
    if (!file.name || file.name.trim().length === 0) {
      return {
        isValid: false,
        error: 'File name is required',
      };
    }

    return { isValid: true };
  }

  getSupportedFileTypes(): string[] {
    return [...this.allowedTypes];
  }

  getMaxFileSize(): number {
    return this.maxFileSize;
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
    if (mimeType === 'text/plain') {
      return 'text';
    }
    return 'file';
  }

  private async generateSignedDownloadUrl(fileUrl: string): Promise<string> {
    // In real implementation, this would generate a signed URL from cloud storage
    // For now, return the original URL
    return fileUrl;
  }
} 