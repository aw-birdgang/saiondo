import type { IMessageRepository } from '../repositories/IMessageRepository';
import type { IUserRepository } from '../repositories/IUserRepository';
import { DomainErrorFactory } from '../errors/DomainError';

export interface FileDownloadRequest {
  messageId: string;
  userId: string;
}

export interface FileDownloadResponse {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  downloadToken: string;
  expiresAt: number;
}

export interface FileInfo {
  messageId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface DownloadHistory {
  userId: string;
  messageId: string;
  downloadedAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

export class FileDownloadUseCase {
  private downloadTokens = new Map<string, { expiresAt: number; fileInfo: FileInfo }>();
  private downloadHistory: DownloadHistory[] = [];

  constructor(
    private readonly messageRepository: IMessageRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async getFileInfo(messageId: string): Promise<FileInfo | null> {
    try {
      const message = await this.messageRepository.findById(messageId);
      if (!message) {
        return null;
      }

      const messageData = message.toJSON();
      const metadata = messageData.metadata as any;

      if (!metadata || !metadata.fileUrl) {
        return null;
      }

      return {
        messageId,
        fileName: metadata.fileName || 'Unknown file',
        fileSize: metadata.fileSize || 0,
        mimeType: metadata.mimeType || 'application/octet-stream',
        uploadedAt: new Date(messageData.createdAt),
        uploadedBy: messageData.senderId,
      };
    } catch (error) {
      console.error('Failed to get file info:', error);
      return null;
    }
  }

  async requestDownload(request: FileDownloadRequest): Promise<FileDownloadResponse> {
    try {
      // Validate request
      if (!request.messageId || request.messageId.trim().length === 0) {
        throw DomainErrorFactory.createMessageValidation('Message ID is required');
      }

      if (!request.userId || request.userId.trim().length === 0) {
        throw DomainErrorFactory.createMessageValidation('User ID is required');
      }

      // Get message and validate it's a file message
      const message = await this.messageRepository.findById(request.messageId);
      if (!message) {
        throw DomainErrorFactory.createMessageNotFound(request.messageId);
      }

      const messageData = message.toJSON();
      const metadata = messageData.metadata as any;

      if (!metadata || !metadata.fileUrl) {
        throw DomainErrorFactory.createMessageValidation('Message does not contain a file');
      }

      // Check if user has permission to download (in real implementation, check channel membership)
      // For now, we'll allow any authenticated user to download

      // Generate download token
      const downloadToken = this.generateDownloadToken();
      const expiresAt = Date.now() + 30 * 60 * 1000; // 30 minutes

      // Store token with file info
      const fileInfo: FileInfo = {
        messageId: request.messageId,
        fileName: metadata.fileName || 'Unknown file',
        fileSize: metadata.fileSize || 0,
        mimeType: metadata.mimeType || 'application/octet-stream',
        uploadedAt: new Date(messageData.createdAt),
        uploadedBy: messageData.senderId,
      };

      this.downloadTokens.set(downloadToken, { expiresAt, fileInfo });

      // Log download request
      this.logDownloadRequest(request.userId, request.messageId);

      return {
        fileUrl: metadata.fileUrl,
        fileName: fileInfo.fileName,
        fileSize: fileInfo.fileSize,
        mimeType: fileInfo.mimeType,
        downloadToken,
        expiresAt,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation('Failed to request download');
    }
  }

  async validateDownloadToken(token: string): Promise<FileInfo | null> {
    try {
      const tokenData = this.downloadTokens.get(token);
      if (!tokenData) {
        return null;
      }

      // Check if token has expired
      if (Date.now() > tokenData.expiresAt) {
        this.downloadTokens.delete(token);
        return null;
      }

      return tokenData.fileInfo;
    } catch (error) {
      console.error('Failed to validate download token:', error);
      return null;
    }
  }

  async getDownloadHistory(userId: string, limit = 50): Promise<DownloadHistory[]> {
    try {
      // In real implementation, this would query the database
      return this.downloadHistory
        .filter(history => history.userId === userId)
        .sort((a, b) => b.downloadedAt.getTime() - a.downloadedAt.getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Failed to get download history:', error);
      return [];
    }
  }

  async getPopularFiles(channelId: string, limit = 10): Promise<FileInfo[]> {
    try {
      // Get all file messages from the channel
      const messages = await this.messageRepository.findByChannelId(channelId, 100, 0);
      const fileMessages = messages.filter(message => {
        const metadata = (message.toJSON() as any).metadata;
        return metadata && metadata.fileUrl;
      });

      // Count downloads for each file (in real implementation, this would be from database)
      const fileStats = new Map<string, { fileInfo: FileInfo; downloadCount: number }>();

      for (const message of fileMessages) {
        const messageData = message.toJSON();
        const metadata = messageData.metadata as any;
        const downloadCount = this.getDownloadCount(messageData.id);

        const fileInfo: FileInfo = {
          messageId: messageData.id,
          fileName: metadata.fileName || 'Unknown file',
          fileSize: metadata.fileSize || 0,
          mimeType: metadata.mimeType || 'application/octet-stream',
          uploadedAt: new Date(messageData.createdAt),
          uploadedBy: messageData.senderId,
        };

        fileStats.set(messageData.id, { fileInfo, downloadCount });
      }

      // Sort by download count and return top files
      return Array.from(fileStats.values())
        .sort((a, b) => b.downloadCount - a.downloadCount)
        .slice(0, limit)
        .map(item => item.fileInfo);
    } catch (error) {
      console.error('Failed to get popular files:', error);
      return [];
    }
  }

  async cleanupExpiredTokens(): Promise<void> {
    try {
      const now = Date.now();
      const expiredTokens: string[] = [];

      for (const [token, data] of this.downloadTokens.entries()) {
        if (now > data.expiresAt) {
          expiredTokens.push(token);
        }
      }

      expiredTokens.forEach(token => this.downloadTokens.delete(token));

      if (expiredTokens.length > 0) {
        console.log(`Cleaned up ${expiredTokens.length} expired download tokens`);
      }
    } catch (error) {
      console.error('Failed to cleanup expired tokens:', error);
    }
  }

  private generateDownloadToken(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `download_${timestamp}_${random}`;
  }

  private logDownloadRequest(userId: string, messageId: string): void {
    const history: DownloadHistory = {
      userId,
      messageId,
      downloadedAt: new Date(),
      // In real implementation, you would capture IP address and user agent
    };

    this.downloadHistory.push(history);

    // Keep only last 1000 download records
    if (this.downloadHistory.length > 1000) {
      this.downloadHistory = this.downloadHistory.slice(-1000);
    }
  }

  private getDownloadCount(messageId: string): number {
    // In real implementation, this would query the database
    return this.downloadHistory.filter(history => history.messageId === messageId).length;
  }
} 