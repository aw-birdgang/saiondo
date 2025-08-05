import { BaseController } from './BaseController';
import { UseCaseFactory } from '../usecases/UseCaseFactory';

/**
 * 파일 업로드 데이터 인터페이스
 */
interface UploadFileData {
  file: File;
  userId: string;
  channelId?: string;
  description?: string;
  tags?: string[];
}

/**
 * 파일 검색 옵션 인터페이스
 */
interface FileSearchOptions {
  fileType?: string;
  tags?: string[];
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

/**
 * 파일 정보 인터페이스
 */
interface FileInfo {
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedBy: string;
  uploadedAt: Date;
  tags: string[];
  updatedAt?: Date;
  updatedBy?: string;
}

/**
 * 파일 통계 인터페이스
 */
interface FileStats {
  totalFiles: number;
  totalSize: number;
  byType: Record<string, number>;
  byMonth: Record<string, number>;
  averageFileSize: number;
}

/**
 * 파일 권한 액션 정의
 */
type FileAction = 'upload_file' | 'download_file' | 'view_file' | 'delete_file' | 'update_file' | 'search' | 'view_stats';

/**
 * FileController - 파일 관련 비즈니스 로직 조정
 */
export class FileController extends BaseController {
  private uploadFileUseCase: any = null;
  private fileDownloadUseCase: any = null;
  private userActivityLogUseCase: any = null;
  private userPermissionUseCase: any = null;
  private cacheUseCase: any = null;
  private useCasesInitialized = false;

  // 파일 관련 상수
  private readonly MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  private readonly ALLOWED_FILE_TYPES = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'text/plain', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  private readonly CACHE_TTL = 3600; // 1시간

  constructor() {
    super('FileController');
  }

  /**
   * UseCase 인스턴스 초기화
   */
  private async initializeUseCases(): Promise<void> {
    if (this.useCasesInitialized) return;

    try {
      this.uploadFileUseCase = UseCaseFactory.createUploadFileUseCase();
      this.fileDownloadUseCase = UseCaseFactory.createFileDownloadUseCase();
      this.userActivityLogUseCase = UseCaseFactory.createUserActivityLogUseCase();
      this.userPermissionUseCase = UseCaseFactory.createUserPermissionUseCase();
      this.cacheUseCase = UseCaseFactory.createCacheUseCase();
      
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
   * 파일 권한 확인 헬퍼 함수
   */
  private async checkFilePermission(
    userId: string,
    resource: string,
    action: FileAction
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
      this.logger.warn(`Failed to check file permission for user ${userId}:`, error);
      return true; // 에러 발생 시 기본적으로 허용
    }
  }

  /**
   * 파일 활동 로그 기록 헬퍼 함수
   */
  private async logFileActivity(
    userId: string,
    action: string,
    resourceId: string,
    details: Record<string, unknown>
  ): Promise<void> {
    try {
      if (this.userActivityLogUseCase && typeof this.userActivityLogUseCase.logActivity === 'function') {
        await this.userActivityLogUseCase.logActivity({
          userId,
          action,
          resource: 'file',
          resourceId,
          details
        });
      }
    } catch (error) {
      this.logger.warn(`Failed to log file activity: ${action}`, error);
    }
  }

  /**
   * 파일 유효성 검사 헬퍼 함수
   */
  private validateFile(file: File): void {
    // 파일 크기 제한 확인
    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error(`파일 크기가 너무 큽니다. (최대 ${this.MAX_FILE_SIZE / (1024 * 1024)}MB)`);
    }

    // 파일 타입 검증
    if (!this.ALLOWED_FILE_TYPES.includes(file.type)) {
      throw new Error('지원하지 않는 파일 형식입니다.');
    }
  }

  /**
   * 파일 메타데이터 캐싱 헬퍼 함수
   */
  private async cacheFileMetadata(
    fileId: string,
    fileInfo: Partial<FileInfo>
  ): Promise<void> {
    try {
      if (this.cacheUseCase && typeof this.cacheUseCase.set === 'function') {
        await this.cacheUseCase.set(`file:${fileId}`, fileInfo, this.CACHE_TTL);
      }
    } catch (error) {
      this.logger.warn(`Failed to cache file metadata for ${fileId}:`, error);
    }
  }

  /**
   * 파일 업로드
   */
  async uploadFile(data: UploadFileData): Promise<any> {
    return this.executeWithTracking(
      'uploadFile',
      { 
        userId: data.userId, 
        fileName: data.file.name, 
        fileSize: data.file.size,
        channelId: data.channelId 
      },
      async () => {
        await this.ensureInitialized();

        // 파일 업로드 권한 확인
        const hasPermission = await this.checkFilePermission(
          data.userId,
          data.channelId || 'global',
          'upload_file'
        );

        if (!hasPermission) {
          throw new Error('파일 업로드 권한이 없습니다.');
        }

        // 파일 유효성 검사
        this.validateFile(data.file);

        const result = await this.uploadFileUseCase?.execute({
          channelId: data.channelId || '',
          senderId: data.userId,
          file: data.file,
          description: data.description
        });

        if (!result?.message) {
          throw new Error('파일 업로드에 실패했습니다.');
        }
        
        // 파일 업로드 활동 로그 기록
        await this.logFileActivity(data.userId, 'FILE_UPLOAD', result.message.id, {
          fileName: data.file.name,
          fileSize: data.file.size,
          fileType: data.file.type,
          channelId: data.channelId
        });

        // 파일 메타데이터 캐싱
        await this.cacheFileMetadata(result.message.id, {
          fileName: data.file.name,
          fileSize: data.file.size,
          fileType: data.file.type,
          uploadedBy: data.userId,
          uploadedAt: new Date(),
          tags: data.tags || []
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
        await this.ensureInitialized();

        // 파일 다운로드 권한 확인
        const hasPermission = await this.checkFilePermission(userId, fileId, 'download_file');
        if (!hasPermission) {
          throw new Error('파일 다운로드 권한이 없습니다.');
        }

        // 캐시된 파일 정보 확인
        const cachedFileInfo = await this.cacheUseCase?.get(`file:${fileId}`);
        
        const result = await this.fileDownloadUseCase?.downloadFile({ fileId, userId });

        if (!result) {
          throw new Error('파일 다운로드에 실패했습니다.');
        }
        
        // 파일 다운로드 활동 로그 기록
        await this.logFileActivity(userId, 'FILE_DOWNLOAD', fileId, {
          fileName: result.fileName,
          fileSize: cachedFileInfo?.fileSize,
          downloadUrl: result.fileUrl
        });
        
        return result;
      }
    );
  }

  /**
   * 파일 정보 조회
   */
  async getFileInfo(fileId: string, userId: string): Promise<FileInfo> {
    return this.executeWithTracking(
      'getFileInfo',
      { fileId, userId },
      async () => {
        await this.ensureInitialized();

        // 파일 정보 조회 권한 확인
        const hasPermission = await this.checkFilePermission(userId, fileId, 'view_file');
        if (!hasPermission) {
          throw new Error('파일 정보 조회 권한이 없습니다.');
        }

        // 캐시에서 파일 정보 조회
        const cachedFileInfo = await this.cacheUseCase?.get(`file:${fileId}`);
        
        if (!cachedFileInfo) {
          throw new Error('파일 정보를 찾을 수 없습니다.');
        }

        return cachedFileInfo as FileInfo;
      }
    );
  }

  /**
   * 파일 삭제
   */
  async deleteFile(fileId: string, userId: string): Promise<void> {
    return this.executeWithTracking(
      'deleteFile',
      { fileId, userId },
      async () => {
        await this.ensureInitialized();

        // 파일 삭제 권한 확인
        const hasPermission = await this.checkFilePermission(userId, fileId, 'delete_file');
        if (!hasPermission) {
          throw new Error('파일 삭제 권한이 없습니다.');
        }

        // 캐시에서 파일 정보 조회
        const cachedFileInfo = await this.cacheUseCase?.get(`file:${fileId}`);
        
        // 실제 파일 삭제 로직 (UseCase에서 구현)
        // await this.fileDeleteUseCase?.execute({ fileId, userId });
        
        // 캐시에서 파일 정보 삭제
        if (this.cacheUseCase && typeof this.cacheUseCase.delete === 'function') {
          await this.cacheUseCase.delete(`file:${fileId}`);
        }
        
        // 파일 삭제 활동 로그 기록
        await this.logFileActivity(userId, 'FILE_DELETED', fileId, {
          fileName: cachedFileInfo?.fileName,
          deletedBy: userId
        });
      }
    );
  }

  /**
   * 파일 검색
   */
  async searchFiles(
    userId: string,
    query: string,
    options?: FileSearchOptions
  ): Promise<FileInfo[]> {
    return this.executeWithTracking(
      'searchFiles',
      { userId, query, options },
      async () => {
        await this.ensureInitialized();

        // 파일 검색 권한 확인
        const hasPermission = await this.checkFilePermission(userId, 'files', 'search');
        if (!hasPermission) {
          throw new Error('파일 검색 권한이 없습니다.');
        }

        // 캐시에서 파일 검색 (실제로는 데이터베이스 검색)
        const allFiles = await this.cacheUseCase?.get('files:all') || [];
        
        let filteredFiles = allFiles.filter((file: any) => {
          // 파일명 검색
          const nameMatch = file.fileName.toLowerCase().includes(query.toLowerCase());
          
          // 태그 검색
          const tagMatch = !options?.tags || options.tags.some(tag => 
            file.tags?.includes(tag)
          );
          
          // 파일 타입 필터
          const typeMatch = !options?.fileType || file.fileType === options.fileType;
          
          // 날짜 범위 필터
          const dateMatch = !options?.startDate || !options?.endDate || 
            (file.uploadedAt >= options.startDate && file.uploadedAt <= options.endDate);
          
          return nameMatch && tagMatch && typeMatch && dateMatch;
        });

        // 페이지네이션
        const limit = options?.limit || 20;
        const offset = options?.offset || 0;
        filteredFiles = filteredFiles.slice(offset, offset + limit);

        return filteredFiles as FileInfo[];
      }
    );
  }

  /**
   * 파일 통계 조회
   */
  async getFileStats(userId: string): Promise<FileStats> {
    return this.executeWithTracking(
      'getFileStats',
      { userId },
      async () => {
        await this.ensureInitialized();

        // 파일 통계 조회 권한 확인
        const hasPermission = await this.checkFilePermission(userId, 'files', 'view_stats');
        if (!hasPermission) {
          throw new Error('파일 통계 조회 권한이 없습니다.');
        }

        // 캐시에서 모든 파일 정보 조회
        const allFiles = await this.cacheUseCase?.get('files:all') || [];
        
        const userFiles = allFiles.filter((file: any) => file.uploadedBy === userId);
        
        const totalFiles = userFiles.length;
        const totalSize = userFiles.reduce((sum: number, file: any) => sum + (file.fileSize || 0), 0);
        const byType = userFiles.reduce((acc: any, file: any) => {
          const type = file.fileType?.split('/')[0] || 'unknown';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {});
        const byMonth = userFiles.reduce((acc: any, file: any) => {
          const month = new Date(file.uploadedAt).toISOString().slice(0, 7);
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, {});
        const averageFileSize = totalFiles > 0 ? totalSize / totalFiles : 0;

        return {
          totalFiles,
          totalSize,
          byType,
          byMonth,
          averageFileSize
        };
      }
    );
  }

  /**
   * 파일 태그 관리
   */
  async updateFileTags(fileId: string, userId: string, tags: string[]): Promise<void> {
    return this.executeWithTracking(
      'updateFileTags',
      { fileId, userId, tags },
      async () => {
        await this.ensureInitialized();

        // 파일 태그 수정 권한 확인
        const hasPermission = await this.checkFilePermission(userId, fileId, 'update_file');
        if (!hasPermission) {
          throw new Error('파일 태그 수정 권한이 없습니다.');
        }

        // 캐시에서 파일 정보 조회 및 업데이트
        const cachedFileInfo = await this.cacheUseCase?.get(`file:${fileId}`);
        
        if (!cachedFileInfo) {
          throw new Error('파일 정보를 찾을 수 없습니다.');
        }

        const updatedFileInfo = {
          ...cachedFileInfo,
          tags: tags,
          updatedAt: new Date(),
          updatedBy: userId
        };

        // 캐시 업데이트
        if (this.cacheUseCase && typeof this.cacheUseCase.set === 'function') {
          await this.cacheUseCase.set(`file:${fileId}`, updatedFileInfo, this.CACHE_TTL);
        }
        
        // 파일 태그 수정 활동 로그 기록
        await this.logFileActivity(userId, 'FILE_TAGS_UPDATED', fileId, {
          fileName: cachedFileInfo.fileName,
          oldTags: cachedFileInfo.tags,
          newTags: tags
        });
      }
    );
  }
} 