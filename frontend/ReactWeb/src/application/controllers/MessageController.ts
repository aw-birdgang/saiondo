import { BaseController } from './BaseController';
import { UseCaseFactory } from '../usecases/UseCaseFactory';
import type { Message } from '../../domain/dto/MessageDto';

/**
 * 메시지 타입 정의
 */
type MessageType = 'text' | 'image' | 'file' | 'system';

/**
 * 메시지 권한 액션 정의
 */
type MessageAction = 'edit' | 'delete' | 'react';

/**
 * 메시지 전송 데이터 인터페이스
 */
interface SendMessageData {
  channelId: string;
  senderId: string;
  content: string;
  type?: MessageType;
  metadata?: Record<string, unknown>;
  replyTo?: string;
}

/**
 * 파일 업로드 데이터 인터페이스
 */
interface UploadFileData {
  channelId: string;
  senderId: string;
  file: File;
  description?: string;
}

/**
 * 메시지 검색 옵션 인터페이스
 */
interface MessageSearchOptions {
  limit?: number;
  offset?: number;
  dateFrom?: Date;
  dateTo?: Date;
}

/**
 * 메시지 통계 인터페이스
 */
interface MessageStats {
  totalMessages: number;
  userMessages: number;
  messagesWithFiles: number;
  averageMessageLength: number;
}

/**
 * MessageController - 메시지 관련 비즈니스 로직 조정
 */
export class MessageController extends BaseController {
  private sendMessageUseCase: any = null;
  private searchMessagesUseCase: any = null;
  private uploadFileUseCase: any = null;
  private fileDownloadUseCase: any = null;
  private userActivityLogUseCase: any = null;
  private userPermissionUseCase: any = null;
  private useCasesInitialized = false;

  constructor() {
    super('MessageController');
  }

  /**
   * UseCase 인스턴스 초기화
   */
  private async initializeUseCases(): Promise<void> {
    if (this.useCasesInitialized) return;

    try {
      this.sendMessageUseCase = UseCaseFactory.createSendMessageUseCase();
      this.searchMessagesUseCase = UseCaseFactory.createSearchMessagesUseCase();
      this.uploadFileUseCase = UseCaseFactory.createUploadFileUseCase();
      this.fileDownloadUseCase = UseCaseFactory.createFileDownloadUseCase();
      this.userActivityLogUseCase = UseCaseFactory.createUserActivityLogUseCase();
      this.userPermissionUseCase = UseCaseFactory.createUserPermissionUseCase();
      
      this.useCasesInitialized = true;
    } catch (error) {
      this.logger.error('Failed to initialize UseCases:', error);
      throw new Error('UseCase 초기화에 실패했습니다.');
    }
  }

  /**
   * UseCase가 초기화되었는지 확인하고 초기화
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.useCasesInitialized) {
      await this.initializeUseCases();
    }
  }

  /**
   * 메시지 권한 확인 헬퍼 함수
   */
  private async checkMessagePermissionHelper(
    userId: string,
    resource: string,
    action: string
  ): Promise<boolean> {
    try {
      if (this.userPermissionUseCase && typeof this.userPermissionUseCase.checkPermission === 'function') {
        const result = await this.userPermissionUseCase.checkPermission({
          userId,
          resource,
          action
        });
        return result?.hasPermission || false;
      }
      return true; // 권한 체크가 불가능한 경우 기본적으로 허용
    } catch (error) {
      this.logger.warn(`Failed to check message permission for user ${userId}:`, error);
      return true; // 에러 발생 시 기본적으로 허용
    }
  }

  /**
   * 메시지 활동 로그 기록 헬퍼 함수
   */
  private async logMessageActivity(
    userId: string,
    action: string,
    resource: string,
    resourceId: string,
    details: Record<string, unknown>
  ): Promise<void> {
    try {
      if (this.userActivityLogUseCase && typeof this.userActivityLogUseCase.logActivity === 'function') {
        await this.userActivityLogUseCase.logActivity({
          userId,
          action,
          resource,
          resourceId,
          details
        });
      }
    } catch (error) {
      this.logger.warn(`Failed to log message activity: ${action}`, error);
    }
  }

  /**
   * 메시지 전송
   */
  async sendMessage(data: SendMessageData): Promise<Message> {
    return this.executeWithTracking(
      'sendMessage',
      { channelId: data.channelId, senderId: data.senderId },
      async () => {
        await this.ensureInitialized();

        // 메시지 전송 권한 확인
        const hasPermission = await this.checkMessagePermissionHelper(
          data.senderId,
          data.channelId,
          'send_message'
        );

        if (!hasPermission) {
          throw new Error('메시지 전송 권한이 없습니다.');
        }

        const result = await this.sendMessageUseCase?.execute({
          content: data.content,
          channelId: data.channelId,
          senderId: data.senderId,
          type: data.type || 'text',
          metadata: data.metadata,
          replyTo: data.replyTo
        });

        if (!result?.message) {
          throw new Error('메시지 전송에 실패했습니다.');
        }
        
        // 메시지 전송 활동 로그 기록
        await this.logMessageActivity(
          data.senderId,
          'MESSAGE_SEND',
          'channel',
          data.channelId,
          { 
            messageId: result.message.id, 
            hasMetadata: !!data.metadata,
            messageType: data.type || 'text'
          }
        );
        
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
    options?: MessageSearchOptions
  ): Promise<Message[]> {
    return this.executeWithTracking(
      'searchMessages',
      { channelId, query, options },
      async () => {
        await this.ensureInitialized();

        if (this.searchMessagesUseCase && typeof this.searchMessagesUseCase.execute === 'function') {
          const result = await this.searchMessagesUseCase.execute({
            query,
            channelId,
            limit: options?.limit,
            offset: options?.offset,
            dateFrom: options?.dateFrom,
            dateTo: options?.dateTo
          });
          return result?.messages || [];
        }

        return [];
      }
    );
  }

  /**
   * 파일 업로드
   */
  async uploadFile(data: UploadFileData): Promise<{ message: Message; fileUrl: string }> {
    return this.executeWithTracking(
      'uploadFile',
      { channelId: data.channelId, senderId: data.senderId, fileName: data.file.name },
      async () => {
        await this.ensureInitialized();

        // 파일 업로드 권한 확인
        const hasPermission = await this.checkMessagePermissionHelper(
          data.senderId,
          data.channelId,
          'upload_file'
        );

        if (!hasPermission) {
          throw new Error('파일 업로드 권한이 없습니다.');
        }

        const result = await this.uploadFileUseCase?.execute(data);

        if (!result) {
          throw new Error('파일 업로드에 실패했습니다.');
        }
        
        // 파일 업로드 활동 로그 기록
        await this.logMessageActivity(
          data.senderId,
          'FILE_UPLOAD',
          'channel',
          data.channelId,
          { 
            fileName: data.file.name, 
            fileSize: data.file.size,
            fileType: data.file.type,
            fileUrl: result.fileUrl
          }
        );
        
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
        await this.ensureInitialized();

        if (this.fileDownloadUseCase && typeof this.fileDownloadUseCase.downloadFile === 'function') {
          const result = await this.fileDownloadUseCase.downloadFile({ fileId, userId });

          if (result) {
            // 파일 다운로드 활동 로그 기록
            await this.logMessageActivity(
              userId,
              'FILE_DOWNLOAD',
              'file',
              fileId,
              { fileName: result.fileName }
            );
          }
          
          return result;
        }

        throw new Error('파일 다운로드에 실패했습니다.');
      }
    );
  }

  /**
   * 메시지 통계 조회
   */
  async getMessageStats(channelId: string, userId: string): Promise<MessageStats> {
    return this.executeWithTracking(
      'getMessageStats',
      { channelId, userId },
      async () => {
        await this.ensureInitialized();

        // 최근 메시지 검색으로 통계 생성
        const recentMessages = await this.searchMessages(channelId, '', { limit: 100 });
        
        const totalMessages = recentMessages.length;
        const userMessages = recentMessages.filter(msg => msg.senderId === userId).length;
                 const messagesWithFiles = recentMessages.filter(msg => (msg as any).attachments?.length > 0).length;
        const averageMessageLength = totalMessages > 0 
          ? recentMessages.reduce((sum, msg) => sum + (msg.content?.length || 0), 0) / totalMessages 
          : 0;

        return {
          totalMessages,
          userMessages,
          messagesWithFiles,
          averageMessageLength
        };
      }
    );
  }

  /**
   * 메시지 권한 확인 (공개 메서드)
   */
  async checkMessagePermission(
    messageId: string,
    userId: string,
    action: MessageAction
  ): Promise<boolean> {
    return this.executeWithTracking(
      'checkMessagePermission',
      { messageId, userId, action },
      async () => {
        await this.ensureInitialized();

        return this.checkMessagePermissionHelper(userId, messageId, `message_${action}`);
      }
    );
  }

  /**
   * 메시지 삭제
   */
  async deleteMessage(messageId: string, userId: string): Promise<boolean> {
    return this.executeWithTracking(
      'deleteMessage',
      { messageId, userId },
      async () => {
        await this.ensureInitialized();

        // 메시지 삭제 권한 확인
        const hasPermission = await this.checkMessagePermission(messageId, userId, 'delete');
        if (!hasPermission) {
          throw new Error('메시지 삭제 권한이 없습니다.');
        }

        // 메시지 삭제 로직 (실제 구현은 UseCase에서 처리)
        if (this.sendMessageUseCase && typeof this.sendMessageUseCase.deleteMessage === 'function') {
          const result = await this.sendMessageUseCase.deleteMessage(messageId, userId);
          
          if (result) {
            await this.logMessageActivity(
              userId,
              'MESSAGE_DELETE',
              'message',
              messageId,
              { deletedAt: new Date().toISOString() }
            );
          }
          
          return result || false;
        }

        return false;
      }
    );
  }

  /**
   * 메시지 수정
   */
  async editMessage(
    messageId: string,
    userId: string,
    newContent: string
  ): Promise<Message | null> {
    return this.executeWithTracking(
      'editMessage',
      { messageId, userId },
      async () => {
        await this.ensureInitialized();

        // 메시지 수정 권한 확인
        const hasPermission = await this.checkMessagePermission(messageId, userId, 'edit');
        if (!hasPermission) {
          throw new Error('메시지 수정 권한이 없습니다.');
        }

        // 메시지 수정 로직 (실제 구현은 UseCase에서 처리)
        if (this.sendMessageUseCase && typeof this.sendMessageUseCase.editMessage === 'function') {
          const result = await this.sendMessageUseCase.editMessage(messageId, userId, newContent);
          
          if (result) {
            await this.logMessageActivity(
              userId,
              'MESSAGE_EDIT',
              'message',
              messageId,
              { 
                newContent,
                editedAt: new Date().toISOString()
              }
            );
          }
          
          return result || null;
        }

        return null;
      }
    );
  }
} 