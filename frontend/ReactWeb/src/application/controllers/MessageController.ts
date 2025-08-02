import { BaseController } from './BaseController';
import { UseCaseFactory } from '../usecases/UseCaseFactory';
import { SendMessageUseCase } from '../usecases/SendMessageUseCase';
import { SearchMessagesUseCase } from '../usecases/SearchMessagesUseCase';
import { UploadFileUseCase } from '../usecases/UploadFileUseCase';
import { FileDownloadUseCase } from '../usecases/FileDownloadUseCase';
import { UserActivityLogUseCase } from '../usecases/UserActivityLogUseCase';
import { UserPermissionUseCase } from '../usecases/UserPermissionUseCase';
import type { Message } from '../../domain/dto/MessageDto';

/**
 * MessageController - 메시지 관련 비즈니스 로직 조정
 */
export class MessageController extends BaseController {
  private readonly sendMessageUseCase: SendMessageUseCase;
  private readonly searchMessagesUseCase: SearchMessagesUseCase;
  private readonly uploadFileUseCase: UploadFileUseCase;
  private readonly fileDownloadUseCase: FileDownloadUseCase;
  private readonly userActivityLogUseCase: UserActivityLogUseCase;
  private readonly userPermissionUseCase: UserPermissionUseCase;

  constructor() {
    super('MessageController');
    
    // Use Case 인스턴스 생성
    this.sendMessageUseCase = UseCaseFactory.createSendMessageUseCase();
    this.searchMessagesUseCase = UseCaseFactory.createSearchMessagesUseCase();
    this.uploadFileUseCase = UseCaseFactory.createUploadFileUseCase();
    this.fileDownloadUseCase = UseCaseFactory.createFileDownloadUseCase();
    this.userActivityLogUseCase = UseCaseFactory.createUserActivityLogUseCase();
    this.userPermissionUseCase = UseCaseFactory.createUserPermissionUseCase();
  }

  /**
   * 메시지 전송
   */
  async sendMessage(data: {
    channelId: string;
    senderId: string;
    content: string;
    type?: 'text' | 'image' | 'file' | 'system';
    metadata?: Record<string, unknown>;
    replyTo?: string;
  }): Promise<any> {
    return this.executeWithTracking(
      'sendMessage',
      { channelId: data.channelId, senderId: data.senderId },
      async () => {
        // 메시지 전송 권한 확인
        const permissionResult = await this.userPermissionUseCase.checkPermission({
          userId: data.senderId,
          resource: data.channelId,
          action: 'send_message'
        });

        if (!permissionResult.hasPermission) {
          throw new Error('메시지 전송 권한이 없습니다.');
        }

        const result = await this.sendMessageUseCase.execute({
          content: data.content,
          channelId: data.channelId,
          senderId: data.senderId,
          type: data.type || 'text',
          metadata: data.metadata,
          replyTo: data.replyTo
        });
        
        // 메시지 전송 활동 로그 기록
        await this.userActivityLogUseCase.logActivity({
          userId: data.senderId,
          action: 'MESSAGE_SEND',
          resource: 'channel',
          resourceId: data.channelId,
          details: { messageId: result.message.id, hasMetadata: !!data.metadata }
        });
        
        return result.message;
      }
    );
  }

  /**
   * 메시지 검색
   */
  async searchMessages(
    channelId: string,
    query: string,
    options?: {
      limit?: number;
      offset?: number;
      dateFrom?: Date;
      dateTo?: Date;
    }
  ): Promise<any[]> {
    return this.executeWithTracking(
      'searchMessages',
      { channelId, query, options },
      async () => {
        const result = await this.searchMessagesUseCase.execute({
          query,
          channelId,
          limit: options?.limit,
          offset: options?.offset,
          dateFrom: options?.dateFrom,
          dateTo: options?.dateTo
        });
        return result.messages;
      }
    );
  }

  /**
   * 파일 업로드
   */
  async uploadFile(data: {
    channelId: string;
    senderId: string;
    file: File;
    description?: string;
  }): Promise<{ message: Message; fileUrl: string }> {
    return this.executeWithTracking(
      'uploadFile',
      { channelId: data.channelId, senderId: data.senderId, fileName: data.file.name },
      async () => {
        // 파일 업로드 권한 확인
        const permissionResult = await this.userPermissionUseCase.checkPermission({
          userId: data.senderId,
          resource: data.channelId,
          action: 'upload_file'
        });

        if (!permissionResult.hasPermission) {
          throw new Error('파일 업로드 권한이 없습니다.');
        }

        const result = await this.uploadFileUseCase.execute(data);
        
        // 파일 업로드 활동 로그 기록
        await this.userActivityLogUseCase.logActivity({
          userId: data.senderId,
          action: 'FILE_UPLOAD',
          resource: 'channel',
          resourceId: data.channelId,
          details: { 
            fileName: data.file.name, 
            fileSize: data.file.size,
            fileType: data.file.type 
          }
        });
        
        return result;
      }
    );
  }

  /**
   * 파일 다운로드
   */
  async downloadFile(fileId: string, userId: string): Promise<any> {
    return this.executeWithTracking(
      'downloadFile',
      { fileId, userId },
      async () => {
        const result = await this.fileDownloadUseCase.downloadFile({ fileId, userId });
        
        // 파일 다운로드 활동 로그 기록
        await this.userActivityLogUseCase.logActivity({
          userId,
          action: 'FILE_DOWNLOAD',
          resource: 'file',
          resourceId: fileId,
          details: { fileName: result.fileName }
        });
        
        return result;
      }
    );
  }

  /**
   * 메시지 통계 조회
   */
  async getMessageStats(channelId: string, userId: string) {
    return this.executeWithTracking(
      'getMessageStats',
      { channelId, userId },
      async () => {
        // 최근 메시지 검색으로 통계 생성
        const recentMessages = await this.searchMessages(channelId, '', { limit: 100 });
        
        const stats = {
          totalMessages: recentMessages.length,
          userMessages: recentMessages.filter(msg => msg.senderId === userId).length,
          messagesWithFiles: recentMessages.filter(msg => msg.attachments?.length > 0).length,
          averageMessageLength: recentMessages.length > 0 
            ? recentMessages.reduce((sum, msg) => sum + msg.content.length, 0) / recentMessages.length 
            : 0
        };
        
        return stats;
      }
    );
  }

  /**
   * 메시지 권한 확인
   */
  async checkMessagePermission(
    messageId: string,
    userId: string,
    action: 'edit' | 'delete' | 'react'
  ): Promise<boolean> {
    return this.executeWithTracking(
      'checkMessagePermission',
      { messageId, userId, action },
      async () => {
        const result = await this.userPermissionUseCase.checkPermission({
          userId,
          resource: messageId,
          action: `message_${action}`
        });
        return result.hasPermission;
      }
    );
  }
} 