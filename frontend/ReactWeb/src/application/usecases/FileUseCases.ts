import { FileUseCaseService } from './services/file/FileUseCaseService';
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
} from '../dto/FileDto';

/**
 * FileUseCases - FileUseCaseService를 사용하여 파일 관련 애플리케이션 로직 조율
 * 새로운 UseCase Service 구조를 활용
 */
export class FileUseCases {
  constructor(private readonly fileUseCaseService: FileUseCaseService) {}

  /**
   * 파일 업로드
   */
  async uploadFile(request: FileUploadRequest): Promise<FileUploadResponse> {
    try {
      const response = await this.fileUseCaseService.uploadFile(request);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to upload file');
    }
  }

  /**
   * 파일 다운로드
   */
  async downloadFile(request: FileDownloadRequest): Promise<FileDownloadResponse> {
    try {
      const response = await this.fileUseCaseService.downloadFile(request);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to download file');
    }
  }

  /**
   * 파일 정보 조회
   */
  async getFile(request: GetFileRequest): Promise<GetFileResponse> {
    const response = await this.fileUseCaseService.getFile(request);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to get file');
    }
    
    return response;
  }

  /**
   * 파일 통계 조회
   */
  async getFileStats(request: GetFileStatsRequest): Promise<GetFileStatsResponse> {
    const response = await this.fileUseCaseService.getFileStats(request);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to get file stats');
    }
    
    return response;
  }

  /**
   * 파일 검증
   */
  async validateFile(request: ValidateFileRequest): Promise<ValidateFileResponse> {
    const response = await this.fileUseCaseService.validateFile(request);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to validate file');
    }
    
    return response;
  }

  /**
   * 지원되는 파일 타입 조회
   */
  getSupportedFileTypes(): string[] {
    return this.fileUseCaseService.getSupportedFileTypes();
  }

  /**
   * 최대 파일 크기 조회
   */
  getMaxFileSize(): number {
    return this.fileUseCaseService.getMaxFileSize();
  }

  /**
   * 파일 존재 확인
   */
  async fileExists(fileId: string): Promise<boolean> {
    return await this.fileUseCaseService.fileExists(fileId);
  }

  /**
   * 파일 캐시 통계 조회
   */
  async getFileCacheStats(): Promise<any> {
    return await this.fileUseCaseService.getFileCacheStats();
  }
} 