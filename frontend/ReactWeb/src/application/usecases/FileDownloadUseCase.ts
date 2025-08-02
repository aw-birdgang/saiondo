import type { IMessageRepository } from '../../domain/repositories/IMessageRepository';
import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import { DomainErrorFactory } from '../../domain/errors/DomainError';
import type { FileDownloadRequest, FileDownloadResponse, FileDownloadProgress } from '../dto/FileDownloadDto';

export class FileDownloadUseCase {
  constructor(
    private readonly messageRepository: IMessageRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async downloadFile(request: FileDownloadRequest): Promise<FileDownloadResponse> {
    try {
      // Validate request
      if (!request.fileId || request.fileId.trim().length === 0) {
        throw DomainErrorFactory.createMessageValidation('File ID is required');
      }

      if (!request.userId || request.userId.trim().length === 0) {
        throw DomainErrorFactory.createUserValidation('User ID is required');
      }

      // Check if user exists
      const user = await this.userRepository.findById(request.userId);
      if (!user) {
        throw DomainErrorFactory.createUserNotFound(request.userId);
      }

      // Get file metadata from message
      const message = await this.messageRepository.findById(request.fileId);
      if (!message) {
        throw DomainErrorFactory.createMessageNotFound(request.fileId);
      }

      // Check if message is a file type
      if (message.type !== 'file') {
        throw DomainErrorFactory.createMessageValidation('Message is not a file');
      }

      // Check if user has access to the channel
      if (request.channelId) {
        // In real implementation, you would check channel membership here
        // For now, we'll assume access is granted
      }

      // Generate download URL (in real implementation, this would be a signed URL)
      const fileUrl = await this.generateDownloadUrl(request.fileId, request.userId);
      const metadata = message.metadata as any;
      const fileName = metadata?.fileName || 'download.file';
      const fileSize = metadata?.fileSize || 0;
      const contentType = metadata?.contentType || 'application/octet-stream';

      return {
        fileUrl,
        fileName,
        fileSize,
        contentType,
        expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation('Failed to download file');
    }
  }

  async getDownloadProgress(fileId: string, userId: string): Promise<FileDownloadProgress> {
    try {
      // In real implementation, this would track download progress
      // For now, return a mock progress
      return {
        fileId,
        progress: 100,
        status: 'completed',
      };
    } catch (error) {
      return {
        fileId,
        progress: 0,
        status: 'error',
        error: 'Failed to get download progress',
      };
    }
  }

  private async generateDownloadUrl(fileId: string, userId: string): Promise<string> {
    // In real implementation, this would generate a signed URL
    // For now, return a mock URL
    return `https://api.example.com/files/${fileId}/download?user=${userId}&token=mock_token`;
  }
} 