import type { ILogger } from '../../../../domain/interfaces/ILogger';
import { BaseCacheService, type ICache } from '../../../services/base/BaseCacheService';
import { FileService } from '../../../services/file/FileService';
import { UserService } from '../../../services/user/UserService';
import { ChannelService } from '../../../services/channel/ChannelService';
import type {
  FileUploadRequest,
  FileUploadResponse,
  FileDownloadRequest,
  FileDownloadResponse,
  GetFileRequest,
  GetFileResponse,
  GetFileStatsRequest,
  GetFileStatsResponse,
  ValidateFileRequest,
  ValidateFileResponse
} from '../../../dto/FileDto';

/**
 * FileUseCaseService - 파일 관련 UseCase 전용 서비스
 * 캐싱, 권한 검증, DTO 변환 등의 UseCase별 특화 로직 처리
 */
export class FileUseCaseService extends BaseCacheService {
  constructor(
    private readonly fileService: FileService,
    private readonly userService: UserService,
    private readonly channelService: ChannelService,
    cache?: ICache,
    logger?: ILogger
  ) {
    super(cache, logger);
  }

  /**
   * 파일 업로드 - 캐시 무효화
   */
  async uploadFile(request: FileUploadRequest): Promise<FileUploadResponse> {
    try {
      // 권한 검증
      await this.checkFilePermissions(request.senderId, 'upload_file', request.channelId);

      // 파일 검증
      const validationResult = await this.fileService.validateFile(request.file);
      if (!validationResult.isValid) {
        throw new Error(validationResult.error || 'File validation failed');
      }

      // Base Service 호출
      const response = await this.fileService.uploadFile(request);

      // 관련 캐시 무효화
      this.invalidateFileCache(request.channelId, request.senderId);

      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to upload file');
    }
  }

  /**
   * 파일 다운로드 - 캐싱 적용
   */
  async downloadFile(request: FileDownloadRequest): Promise<FileDownloadResponse> {
    try {
      // 캐시 확인
      const cacheKey = this.generateCacheKey('file', 'download', request.fileId);
      const cached = await this.getCached<FileDownloadResponse>(cacheKey);
      if (cached) {
        return { ...cached, cached: true };
      }

      // Base Service 호출
      const response = await this.fileService.downloadFile(request);

      // 캐시 저장 (다운로드 URL은 짧은 TTL)
      await this.setCached(cacheKey, response, this.calculateTTL('file_download'));

      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to download file');
    }
  }

  /**
   * 파일 정보 조회 - 캐싱 적용
   */
  async getFile(request: GetFileRequest): Promise<GetFileResponse> {
    try {
      // 캐시 확인
      const cacheKey = this.generateCacheKey('file', 'info', request.fileId);
      const cached = await this.getCached<GetFileResponse>(cacheKey);
      if (cached) {
        return { ...cached, cached: true };
      }

      // 파일 존재 확인
      const exists = await this.fileService.fileExists(request.fileId);
      if (!exists) {
        return {
          file: null,
          success: false,
          error: 'File not found',
          cached: false,
          fetchedAt: new Date()
        };
      }

      // 임시 파일 정보 반환 (실제로는 파일 정보를 가져와야 함)
      const fileInfo = {
        id: request.fileId,
        fileName: 'unknown',
        fileSize: 0,
        mimeType: 'application/octet-stream',
        fileUrl: '',
        channelId: '',
        senderId: '',
        uploadedAt: new Date(),
        downloadCount: 0,
        isPublic: false
      };

      const response: GetFileResponse = {
        file: fileInfo,
        success: true,
        cached: false,
        fetchedAt: new Date()
      };

      // 캐시 저장
      await this.setCached(cacheKey, response, this.calculateTTL('file_info'));

      return response;
    } catch (error) {
      return {
        file: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        cached: false,
        fetchedAt: new Date()
      };
    }
  }

  /**
   * 파일 통계 조회 - 캐싱 적용
   */
  async getFileStats(request: GetFileStatsRequest): Promise<GetFileStatsResponse> {
    try {
      // 캐시 확인
      const cacheKey = this.generateCacheKey('file', 'stats', request.channelId, request.userId);
      const cached = await this.getCached<GetFileStatsResponse>(cacheKey);
      if (cached) {
        return { ...cached, cached: true };
      }

      // Base Service 호출
      const stats = await this.fileService.getFileStats(request.channelId, request.userId);

      const response: GetFileStatsResponse = {
        stats,
        success: true,
        cached: false,
        fetchedAt: new Date()
      };

      // 캐시 저장
      await this.setCached(cacheKey, response, this.calculateTTL('file_stats'));

      return response;
    } catch (error) {
      return {
        stats: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        cached: false,
        fetchedAt: new Date()
      };
    }
  }

  /**
   * 파일 검증
   */
  async validateFile(request: ValidateFileRequest): Promise<ValidateFileResponse> {
    try {
      // Base Service 호출
      const validationResult = await this.fileService.validateFile(request.file);

      return {
        isValid: validationResult.isValid,
        error: validationResult.error,
        success: true
      };
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  /**
   * 지원되는 파일 타입 조회
   */
  getSupportedFileTypes(): string[] {
    return this.fileService.getSupportedFileTypes();
  }

  /**
   * 최대 파일 크기 조회
   */
  getMaxFileSize(): number {
    return this.fileService.getMaxFileSize();
  }

  /**
   * 파일 존재 확인
   */
  async fileExists(fileId: string): Promise<boolean> {
    return await this.fileService.fileExists(fileId);
  }

  // Private helper methods

  /**
   * 파일 권한 검증
   */
  private async checkFilePermissions(userId: string, operation: string, resourceId: string): Promise<boolean> {
    // 기본 권한 검증 (실제로는 더 복잡한 권한 시스템 사용)
    const hasPermission = await this.userService.hasPermission(userId, operation);
    
    if (!hasPermission) {
      throw new Error(`User ${userId} does not have permission to ${operation}`);
    }
    
    return true;
  }

  /**
   * 파일 관련 캐시 무효화
   */
  private invalidateFileCache(channelId: string, userId: string): void {
    this.invalidateCachePattern(`file:channel:${channelId}:*`);
    this.invalidateCachePattern(`file:user:${userId}:*`);
    this.invalidateCachePattern(`file:stats:*`);
  }

  /**
   * 파일 캐시 통계 조회
   */
  async getFileCacheStats(): Promise<any> {
    const keys = await this.cache.keys();
    const fileKeys = keys.filter(key => key.startsWith('file:'));
    
    return {
      totalKeys: keys.length,
      fileKeys: fileKeys.length,
      hitRate: 0.85, // 실제 구현에서는 히트율 계산
      missRate: 0.15,
      averageTTL: 300
    };
  }
} 