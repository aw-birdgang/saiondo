import { BaseController } from './BaseController';
import { UseCaseFactory } from '../usecases/UseCaseFactory';
import { UploadFileUseCase } from '../usecases/UploadFileUseCase';
import { FileDownloadUseCase } from '../usecases/FileDownloadUseCase';
import { UserActivityLogUseCase } from '../usecases/UserActivityLogUseCase';
import { UserPermissionUseCase } from '../usecases/UserPermissionUseCase';
import { CacheUseCase } from '../usecases/CacheUseCase';

/**
 * FileController - 파일 관련 비즈니스 로직 조정
 */
export class FileController extends BaseController {
  private readonly uploadFileUseCase: UploadFileUseCase;
  private readonly fileDownloadUseCase: FileDownloadUseCase;
  private readonly userActivityLogUseCase: UserActivityLogUseCase;
  private readonly userPermissionUseCase: UserPermissionUseCase;
  private readonly cacheUseCase: CacheUseCase;

  constructor() {
    super('FileController');
    
    // Use Case 인스턴스 생성
    this.uploadFileUseCase = UseCaseFactory.createUploadFileUseCase();
    this.fileDownloadUseCase = UseCaseFactory.createFileDownloadUseCase();
    this.userActivityLogUseCase = UseCaseFactory.createUserActivityLogUseCase();
    this.userPermissionUseCase = UseCaseFactory.createUserPermissionUseCase();
    this.cacheUseCase = UseCaseFactory.createCacheUseCase();
  }

  /**
   * 파일 업로드
   */
  async uploadFile(data: {
    file: File;
    userId: string;
    channelId?: string;
    description?: string;
    tags?: string[];
  }): Promise<any> {
    return this.executeWithTracking(
      'uploadFile',
      { 
        userId: data.userId, 
        fileName: data.file.name, 
        fileSize: data.file.size,
        channelId: data.channelId 
      },
      async () => {
        // 파일 업로드 권한 확인
        const permissionResult = await this.userPermissionUseCase.checkPermission({
          userId: data.userId,
          resource: data.channelId || 'global',
          action: 'upload_file'
        });

        if (!permissionResult.hasPermission) {
          throw new Error('파일 업로드 권한이 없습니다.');
        }

        // 파일 크기 제한 확인 (예: 50MB)
        const maxFileSize = 50 * 1024 * 1024; // 50MB
        if (data.file.size > maxFileSize) {
          throw new Error('파일 크기가 너무 큽니다. (최대 50MB)');
        }

        // 파일 타입 검증
        const allowedTypes = [
          'image/jpeg', 'image/png', 'image/gif', 'image/webp',
          'application/pdf', 'text/plain', 'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        
        if (!allowedTypes.includes(data.file.type)) {
          throw new Error('지원하지 않는 파일 형식입니다.');
        }

        const result = await this.uploadFileUseCase.execute({
          channelId: data.channelId || '',
          senderId: data.userId,
          file: data.file,
          description: data.description
        });
        
        // 파일 업로드 활동 로그 기록
        await this.userActivityLogUseCase.logActivity({
          userId: data.userId,
          action: 'FILE_UPLOAD',
          resource: 'file',
          resourceId: result.message.id,
          details: { 
            fileName: data.file.name, 
            fileSize: data.file.size,
            fileType: data.file.type,
            channelId: data.channelId
          }
        });

        // 파일 메타데이터 캐싱
        await this.cacheUseCase.set(
          `file:${result.message.id}`,
          {
            fileName: data.file.name,
            fileSize: data.file.size,
            fileType: data.file.type,
            uploadedBy: data.userId,
            uploadedAt: new Date(),
            tags: data.tags || []
          },
          3600 // 1시간 캐시
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
        // 파일 다운로드 권한 확인
        const permissionResult = await this.userPermissionUseCase.checkPermission({
          userId,
          resource: fileId,
          action: 'download_file'
        });

        if (!permissionResult.hasPermission) {
          throw new Error('파일 다운로드 권한이 없습니다.');
        }

        // 캐시된 파일 정보 확인
        const cachedFileInfo = await this.cacheUseCase.get(`file:${fileId}`);
        
        const result = await this.fileDownloadUseCase.downloadFile({ fileId, userId });
        
        // 파일 다운로드 활동 로그 기록
        await this.userActivityLogUseCase.logActivity({
          userId,
          action: 'FILE_DOWNLOAD',
          resource: 'file',
          resourceId: fileId,
          details: { 
            fileName: result.fileName,
            fileSize: cachedFileInfo?.fileSize,
            downloadUrl: result.fileUrl
          }
        });
        
        return result;
      }
    );
  }

  /**
   * 파일 정보 조회
   */
  async getFileInfo(fileId: string, userId: string): Promise<any> {
    return this.executeWithTracking(
      'getFileInfo',
      { fileId, userId },
      async () => {
        // 파일 정보 조회 권한 확인
        const permissionResult = await this.userPermissionUseCase.checkPermission({
          userId,
          resource: fileId,
          action: 'view_file'
        });

        if (!permissionResult.hasPermission) {
          throw new Error('파일 정보 조회 권한이 없습니다.');
        }

        // 캐시에서 파일 정보 조회
        const cachedFileInfo = await this.cacheUseCase.get(`file:${fileId}`);
        
        if (!cachedFileInfo) {
          throw new Error('파일 정보를 찾을 수 없습니다.');
        }

        return cachedFileInfo;
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
        // 파일 삭제 권한 확인
        const permissionResult = await this.userPermissionUseCase.checkPermission({
          userId,
          resource: fileId,
          action: 'delete_file'
        });

        if (!permissionResult.hasPermission) {
          throw new Error('파일 삭제 권한이 없습니다.');
        }

        // 캐시에서 파일 정보 조회
        const cachedFileInfo = await this.cacheUseCase.get(`file:${fileId}`);
        
        // 실제 파일 삭제 로직 (UseCase에서 구현)
        // await this.fileDeleteUseCase.execute({ fileId, userId });
        
        // 캐시에서 파일 정보 삭제
        await this.cacheUseCase.delete(`file:${fileId}`);
        
        // 파일 삭제 활동 로그 기록
        await this.userActivityLogUseCase.logActivity({
          userId,
          action: 'FILE_DELETED',
          resource: 'file',
          resourceId: fileId,
          details: { 
            fileName: cachedFileInfo?.fileName,
            deletedBy: userId
          }
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
    options?: {
      fileType?: string;
      tags?: string[];
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
    }
  ): Promise<any[]> {
    return this.executeWithTracking(
      'searchFiles',
      { userId, query, options },
      async () => {
        // 파일 검색 권한 확인
        const permissionResult = await this.userPermissionUseCase.checkPermission({
          userId,
          resource: 'files',
          action: 'search'
        });

        if (!permissionResult.hasPermission) {
          throw new Error('파일 검색 권한이 없습니다.');
        }

        // 캐시에서 파일 검색 (실제로는 데이터베이스 검색)
        const allFiles = await this.cacheUseCase.get('files:all') || [];
        
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

        return filteredFiles;
      }
    );
  }

  /**
   * 파일 통계 조회
   */
  async getFileStats(userId: string): Promise<any> {
    return this.executeWithTracking(
      'getFileStats',
      { userId },
      async () => {
        // 파일 통계 조회 권한 확인
        const permissionResult = await this.userPermissionUseCase.checkPermission({
          userId,
          resource: 'files',
          action: 'view_stats'
        });

        if (!permissionResult.hasPermission) {
          throw new Error('파일 통계 조회 권한이 없습니다.');
        }

        // 캐시에서 모든 파일 정보 조회
        const allFiles = await this.cacheUseCase.get('files:all') || [];
        
        const userFiles = allFiles.filter((file: any) => file.uploadedBy === userId);
        
        const stats = {
          totalFiles: userFiles.length,
          totalSize: userFiles.reduce((sum: number, file: any) => sum + (file.fileSize || 0), 0),
          byType: userFiles.reduce((acc: any, file: any) => {
            const type = file.fileType?.split('/')[0] || 'unknown';
            acc[type] = (acc[type] || 0) + 1;
            return acc;
          }, {}),
          byMonth: userFiles.reduce((acc: any, file: any) => {
            const month = new Date(file.uploadedAt).toISOString().slice(0, 7);
            acc[month] = (acc[month] || 0) + 1;
            return acc;
          }, {}),
          averageFileSize: userFiles.length > 0 
            ? userFiles.reduce((sum: number, file: any) => sum + (file.fileSize || 0), 0) / userFiles.length 
            : 0
        };
        
        return stats;
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
        // 파일 태그 수정 권한 확인
        const permissionResult = await this.userPermissionUseCase.checkPermission({
          userId,
          resource: fileId,
          action: 'update_file'
        });

        if (!permissionResult.hasPermission) {
          throw new Error('파일 태그 수정 권한이 없습니다.');
        }

        // 캐시에서 파일 정보 조회 및 업데이트
        const cachedFileInfo = await this.cacheUseCase.get(`file:${fileId}`);
        
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
        await this.cacheUseCase.set(`file:${fileId}`, updatedFileInfo, 3600);
        
        // 파일 태그 수정 활동 로그 기록
        await this.userActivityLogUseCase.logActivity({
          userId,
          action: 'FILE_TAGS_UPDATED',
          resource: 'file',
          resourceId: fileId,
          details: { 
            fileName: cachedFileInfo.fileName,
            oldTags: cachedFileInfo.tags,
            newTags: tags
          }
        });
      }
    );
  }
} 