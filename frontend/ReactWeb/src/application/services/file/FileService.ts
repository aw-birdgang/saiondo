import type { IMessageRepository } from '../../../domain/repositories/IMessageRepository';
import type { IChannelRepository } from '../../../domain/repositories/IChannelRepository';
import { MessageEntity } from '../../../domain/entities/Message';
import { DomainErrorFactory } from '../../../domain/errors/DomainError';
import { BaseService } from '../base/BaseService';
import type { ILogger } from '../../../domain/interfaces/ILogger';
import type {
  FileUploadRequest,
  FileUploadResponse
} from '../../dto/UploadFileDto';
import type {
  FileDownloadRequest,
  FileDownloadResponse
} from '../../dto/FileDownloadDto';
import type {
  FileStats,
  FileServiceConfig
} from '../../dto/FileDto';

/**
 * FileService - BaseService를 상속하여 파일 관련 도메인 로직 처리
 * 성능 측정, 에러 처리, 검증 등의 공통 기능은 BaseService에서 제공
 */
export class FileService extends BaseService<IMessageRepository> {
  protected repository: IMessageRepository;
  private readonly config: FileServiceConfig;
  private readonly maxFileSize: number;
  private readonly allowedTypes: string[];

  constructor(
    messageRepository: IMessageRepository,
    private readonly channelRepository: IChannelRepository,
    logger?: ILogger,
    config: FileServiceConfig = {}
  ) {
    super(logger);
    this.repository = messageRepository;
    this.config = config;
    this.maxFileSize = config.maxFileSize || 10 * 1024 * 1024; // 10MB
    this.allowedTypes = config.allowedTypes || [
      'image/jpeg',
      'image/png', 
      'image/gif',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
  }

  /**
   * 파일 업로드
   */
  async uploadFile(request: FileUploadRequest): Promise<FileUploadResponse> {
    return await this.measurePerformance(
      'upload_file',
      async () => {
        // 입력 검증
        this.validateFileUploadRequest(request);

        // 비즈니스 규칙 검증
        const businessRules = [
          {
            name: 'file_required',
            validate: () => !!request.file,
            message: 'File is required'
          },
          {
            name: 'channel_required',
            validate: () => request.channelId && request.channelId.trim().length > 0,
            message: 'Channel ID is required'
          },
          {
            name: 'sender_required',
            validate: () => request.senderId && request.senderId.trim().length > 0,
            message: 'Sender ID is required'
          },
          {
            name: 'file_size_valid',
            validate: () => request.file && request.file.size <= this.maxFileSize,
            message: `File size must be less than ${this.maxFileSize / (1024 * 1024)}MB`
          },
          {
            name: 'file_type_valid',
            validate: () => request.file && this.allowedTypes.includes(request.file.type),
            message: 'File type not supported'
          },
          {
            name: 'sender_is_member',
            validate: async () => await this.channelRepository.isMember(request.channelId, request.senderId),
            message: 'Sender is not a member of this channel'
          }
        ];

        const validationResult = this.validateBusinessRules(request, businessRules);
        if (!validationResult.isValid) {
          throw new Error(validationResult.violations[0].message);
        }

        // 파일 업로드 처리
        const fileUrl = await this.uploadFileToStorage(request.file!);
        const fileName = request.file!.name;
        const fileSize = request.file!.size;

        // 메시지 타입 결정
        const messageType = this.getMessageTypeFromFile(request.file!.type);

        // 파일 메시지 생성
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
            mimeType: request.file!.type,
          },
        });

        // 메시지 저장
        const savedMessage = await this.repository.save(messageEntity);

        // 채널의 마지막 메시지 타임스탬프 업데이트
        await this.channelRepository.updateLastMessage(request.channelId);

        return {
          message: savedMessage.toJSON(),
          fileUrl,
          fileSize,
          fileName,
        };
      },
      { request }
    );
  }

  /**
   * 파일 다운로드
   */
  async downloadFile(request: FileDownloadRequest): Promise<FileDownloadResponse> {
    return await this.measurePerformance(
      'download_file',
      async () => {
        // 입력 검증
        if (!request.fileId || request.fileId.trim().length === 0) {
          throw new Error('File ID is required');
        }

        // 파일 정보 조회
        const message = await this.repository.findById(request.fileId);
        if (!message) {
          throw DomainErrorFactory.createMessageNotFound(request.fileId);
        }

        // 파일 메시지인지 확인
        if (!message.metadata?.fileUrl) {
          throw new Error('This message does not contain a file');
        }

        // 서명된 다운로드 URL 생성
        const signedUrl = await this.generateSignedDownloadUrl(message.metadata.fileUrl);

        return {
          fileUrl: signedUrl,
          fileName: message.metadata.fileName || 'unknown',
          fileSize: message.metadata.fileSize || 0,
          mimeType: message.metadata.mimeType || 'application/octet-stream'
        };
      },
      { request }
    );
  }

  /**
   * 파일 검증
   */
  async validateFile(file: File): Promise<{ isValid: boolean; error?: string }> {
    return await this.measurePerformance(
      'validate_file',
      async () => {
        // 파일 크기 검증
        if (file.size > this.maxFileSize) {
          return {
            isValid: false,
            error: `File size must be less than ${this.maxFileSize / (1024 * 1024)}MB`
          };
        }

        // 파일 타입 검증
        if (!this.allowedTypes.includes(file.type)) {
          return {
            isValid: false,
            error: 'File type not supported'
          };
        }

        // 파일 이름 검증
        if (!file.name || file.name.trim().length === 0) {
          return {
            isValid: false,
            error: 'File name is required'
          };
        }

        return { isValid: true };
      },
      { fileName: file.name, fileSize: file.size, fileType: file.type }
    );
  }

  /**
   * 지원되는 파일 타입 조회
   */
  getSupportedFileTypes(): string[] {
    return [...this.allowedTypes];
  }

  /**
   * 최대 파일 크기 조회
   */
  getMaxFileSize(): number {
    return this.maxFileSize;
  }

  /**
   * 파일 통계 조회
   */
  async getFileStats(channelId?: string, userId?: string): Promise<FileStats> {
    return await this.measurePerformance(
      'get_file_stats',
      async () => {
        // 임시 통계 반환 (실제로는 repository에서 통계를 가져와야 함)
        return {
          totalFiles: 0,
          totalSize: 0,
          filesByType: {},
          averageFileSize: 0,
          lastUploadedAt: new Date(),
          channelId,
          userId
        };
      },
      { channelId, userId }
    );
  }

  /**
   * 파일 존재 확인
   */
  async fileExists(fileId: string): Promise<boolean> {
    return await this.measurePerformance(
      'file_exists',
      async () => {
        const message = await this.repository.findById(fileId);
        return !!(message && message.metadata?.fileUrl);
      },
      { fileId }
    );
  }

  // Private helper methods

  /**
   * 파일 업로드 요청 검증
   */
  private validateFileUploadRequest(request: FileUploadRequest): void {
    // 기본 검증
    if (!request.file) {
      throw new Error('File is required');
    }

    if (!request.channelId || request.channelId.trim().length === 0) {
      throw new Error('Channel ID is required');
    }

    if (!request.senderId || request.senderId.trim().length === 0) {
      throw new Error('Sender ID is required');
    }

    // 파일 크기 검증
    if (request.file.size > this.maxFileSize) {
      throw new Error(`File size must be less than ${this.maxFileSize / (1024 * 1024)}MB`);
    }

    // 파일 타입 검증
    if (!this.allowedTypes.includes(request.file.type)) {
      throw new Error('File type not supported');
    }

    // 파일 이름 검증
    if (!request.file.name || request.file.name.trim().length === 0) {
      throw new Error('File name is required');
    }
  }

  /**
   * 파일을 스토리지에 업로드
   */
  private async uploadFileToStorage(file: File): Promise<string> {
    // 임시 구현 (실제로는 클라우드 스토리지에 업로드)
    // 예: AWS S3, Google Cloud Storage, Azure Blob Storage 등
    
    // 파일을 FormData로 변환
    const formData = new FormData();
    formData.append('file', file);
    
    // 업로드 API 호출 (실제 구현에서는 적절한 스토리지 서비스 사용)
    // const response = await fetch('/api/upload', {
    //   method: 'POST',
    //   body: formData
    // });
    // const result = await response.json();
    // return result.fileUrl;
    
    // 임시로 더미 URL 반환
    return `https://storage.example.com/files/${Date.now()}-${file.name}`;
  }

  /**
   * 파일 타입에 따른 메시지 타입 결정
   */
  private getMessageTypeFromFile(mimeType: string): 'text' | 'image' | 'file' | 'system' {
    if (mimeType.startsWith('image/')) {
      return 'image';
    }
    if (mimeType === 'text/plain') {
      return 'text';
    }
    return 'file';
  }

  /**
   * 서명된 다운로드 URL 생성
   */
  private async generateSignedDownloadUrl(fileUrl: string): Promise<string> {
    // 임시 구현 (실제로는 서명된 URL 생성)
    // 예: AWS S3 presigned URL, Google Cloud Storage signed URL 등
    
    // const signedUrl = await this.storageService.generateSignedUrl(fileUrl, 3600); // 1시간 유효
    // return signedUrl;
    
    // 임시로 원본 URL 반환
    return fileUrl;
  }
} 