import type { IFileRepository } from '../../domain/repositories/IFileRepository';
import { DomainErrorFactory } from '../../domain/errors/DomainError';
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
  ValidateFileResponse,
} from '../dto/FileDto';

/**
 * FileUseCase - 파일 관련 모든 기능을 통합한 Use Case
 * 파일 업로드, 다운로드, 관리, 검색 등을 포함
 */
export class FileUseCase {
  constructor(
    private readonly fileRepository: IFileRepository
  ) {}

  // ==================== 파일 업로드 ====================

  /**
   * 파일 업로드
   */
  async uploadFile(
    file: File,
    options: any = {}
  ): Promise<FileUploadResponse> {
    try {
      // 파일 검증
      this.validateFile(file);

      // 파일 업로드
      const fileInfo = await this.fileRepository.uploadFile(file, options);

      return {
        fileInfo,
        success: true,
        uploadedAt: new Date(),
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to upload file');
    }
  }

  /**
   * 다중 파일 업로드
   */
  async uploadMultipleFiles(
    files: File[],
    options: any = {}
  ): Promise<FileUploadResponse[]> {
    try {
      const uploadPromises = files.map(file => this.uploadFile(file, options));
      return await Promise.all(uploadPromises);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to upload multiple files');
    }
  }

  // ==================== 파일 다운로드 ====================

  /**
   * 파일 다운로드
   */
  async downloadFile(fileId: string): Promise<Blob> {
    try {
      return await this.fileRepository.downloadFile(fileId);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to download file');
    }
  }

  /**
   * 파일 정보 조회
   */
  async getFileInfo(fileId: string): Promise<GetFileResponse> {
    try {
      const fileInfo = await this.fileRepository.getFileInfo(fileId);

      if (!fileInfo) {
        throw DomainErrorFactory.createUserValidation('File not found');
      }

      return {
        fileInfo,
        success: true,
        fetchedAt: new Date(),
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to get file info');
    }
  }

  // ==================== 파일 관리 ====================

  /**
   * 파일 삭제
   */
  async deleteFile(fileId: string): Promise<void> {
    try {
      await this.fileRepository.deleteFile(fileId);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to delete file');
    }
  }

  /**
   * 파일 정보 업데이트
   */
  async updateFileInfo(
    fileId: string,
    fileInfo: any
  ): Promise<GetFileResponse> {
    try {
      const updatedFileInfo = await this.fileRepository.updateFileInfo(fileId, fileInfo);

      return {
        fileInfo: updatedFileInfo,
        success: true,
        updatedAt: new Date(),
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to update file info');
    }
  }

  // ==================== 파일 검색 ====================

  /**
   * 파일 검색
   */
  async searchFiles(
    query: string,
    options: any = {}
  ): Promise<GetFileResponse[]> {
    try {
      const files = await this.fileRepository.searchFiles(query, options);

      return files.map(fileInfo => ({
        fileInfo,
        success: true,
        fetchedAt: new Date(),
      }));
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to search files');
    }
  }

  /**
   * 사용자별 파일 조회
   */
  async getFilesByUser(userId: string): Promise<GetFileResponse[]> {
    try {
      const files = await this.fileRepository.getFilesByUser(userId);

      return files.map(fileInfo => ({
        fileInfo,
        success: true,
        fetchedAt: new Date(),
      }));
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to get files by user');
    }
  }

  /**
   * 채널별 파일 조회
   */
  async getFilesByChannel(channelId: string): Promise<GetFileResponse[]> {
    try {
      const files = await this.fileRepository.getFilesByChannel(channelId);

      return files.map(fileInfo => ({
        fileInfo,
        success: true,
        fetchedAt: new Date(),
      }));
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to get files by channel');
    }
  }

  // ==================== 결제 관련 ====================

  /**
   * 파일 결제 처리
   */
  async processFilePayment(
    fileId: string,
    paymentData: any
  ): Promise<any> {
    try {
      return await this.fileRepository.processFilePayment(fileId, paymentData);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to process file payment');
    }
  }

  /**
   * 파일 결제 히스토리 조회
   */
  async getFilePaymentHistory(fileId: string): Promise<any[]> {
    try {
      return await this.fileRepository.getFilePaymentHistory(fileId);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to get file payment history');
    }
  }

  // ==================== 파일 권한 ====================

  /**
   * 파일 권한 확인
   */
  async checkFilePermission(
    fileId: string,
    userId: string
  ): Promise<boolean> {
    try {
      return await this.fileRepository.checkFilePermission(fileId, userId);
    } catch (error) {
      console.error('Failed to check file permission:', error);
      return false;
    }
  }

  /**
   * 파일 권한 설정
   */
  async setFilePermission(
    fileId: string,
    userId: string,
    permission: string
  ): Promise<void> {
    try {
      await this.fileRepository.setFilePermission(fileId, userId, permission);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to set file permission');
    }
  }

  // ==================== 파일 통계 ====================

  /**
   * 파일 통계 조회
   */
  async getFileStats(request: GetFileStatsRequest): Promise<GetFileStatsResponse> {
    try {
      // 실제 구현에서는 Repository에 통계 메서드 추가 필요
      const stats = {
        fileId: request.fileId,
        downloadCount: 0,
        uploadDate: new Date(),
        fileSize: 0,
        fileType: 'unknown',
      };

      return {
        stats,
        success: true,
        fetchedAt: new Date(),
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to get file stats');
    }
  }

  // ==================== 파일 검증 ====================

  /**
   * 파일 검증
   */
  async validateFile(request: ValidateFileRequest): Promise<ValidateFileResponse> {
    try {
      const file = request.file;
      const isValid = this.validateFileType(file) && this.validateFileSize(file);

      return {
        isValid,
        errors: isValid ? [] : ['Invalid file type or size'],
        success: true,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to validate file');
    }
  }

  // ==================== 유틸리티 메서드 ====================

  /**
   * 지원되는 파일 타입 조회
   */
  getSupportedFileTypes(): string[] {
    return [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
  }

  /**
   * 최대 파일 크기 조회
   */
  getMaxFileSize(): number {
    return 10 * 1024 * 1024; // 10MB
  }

  /**
   * 파일 존재 여부 확인
   */
  async fileExists(fileId: string): Promise<boolean> {
    try {
      const fileInfo = await this.fileRepository.getFileInfo(fileId);
      return !!fileInfo;
    } catch (error) {
      return false;
    }
  }

  // ==================== 검증 메서드 ====================



  /**
   * 파일 타입 검증
   */
  private validateFileType(file: File): boolean {
    const supportedTypes = this.getSupportedFileTypes();
    return supportedTypes.includes(file.type);
  }

  /**
   * 파일 크기 검증
   */
  private validateFileSize(file: File): boolean {
    const maxSize = this.getMaxFileSize();
    return file.size <= maxSize;
  }
} 