import type { IMessageRepository } from '../../domain/repositories/IMessageRepository';
import type { IChannelRepository } from '../../domain/repositories/IChannelRepository';
import { DomainErrorFactory } from '../../domain/errors/DomainError';
import { ApiClient } from '../api/ApiClient';

/**
 * FileInfrastructureService - 파일 관련 모든 기능을 통합한 Infrastructure Service
 * 파일 업로드, 다운로드, 관리 등을 포함
 */
export class FileInfrastructureService {
  private readonly apiClient: ApiClient;

  constructor(
    private readonly messageRepository: IMessageRepository,
    private readonly channelRepository: IChannelRepository
  ) {
    this.apiClient = new ApiClient();
  }

  // ==================== 파일 업로드 ====================

  /**
   * 파일 업로드
   */
  async uploadFile(file: File, channelId: string, userId: string): Promise<{
    fileId: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
  }> {
    try {
      // 파일 검증
      this.validateFile(file);

      // FormData 생성
      const formData = new FormData();
      formData.append('file', file);
      formData.append('channelId', channelId);
      formData.append('userId', userId);

      // 파일 업로드
      const response = await this.apiClient.post<{
        fileId: string;
        fileName: string;
        fileUrl: string;
        fileSize: number;
        mimeType: string;
      }>('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response;
    } catch (error) {
      throw DomainErrorFactory.createFileValidation('File upload failed');
    }
  }

  /**
   * 다중 파일 업로드
   */
  async uploadMultipleFiles(
    files: File[],
    channelId: string,
    userId: string
  ): Promise<Array<{
    fileId: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
  }>> {
    try {
      const uploadPromises = files.map(file => this.uploadFile(file, channelId, userId));
      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      throw DomainErrorFactory.createFileValidation('Multiple file upload failed');
    }
  }

  // ==================== 파일 다운로드 ====================

  /**
   * 파일 다운로드
   */
  async downloadFile(fileId: string): Promise<Blob> {
    try {
      const response = await this.apiClient.get(`/files/download/${fileId}`, {
        responseType: 'blob',
      });
      return response;
    } catch (error) {
      throw DomainErrorFactory.createFileNotFound('File download failed');
    }
  }

  /**
   * 파일 URL 가져오기
   */
  async getFileUrl(fileId: string): Promise<string> {
    try {
      const response = await this.apiClient.get<{ fileUrl: string }>(`/files/${fileId}/url`);
      return response.fileUrl;
    } catch (error) {
      throw DomainErrorFactory.createFileNotFound('File URL not found');
    }
  }

  // ==================== 파일 관리 ====================

  /**
   * 파일 정보 조회
   */
  async getFileInfo(fileId: string): Promise<{
    fileId: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    uploadedBy: string;
    uploadedAt: Date;
    channelId: string;
  }> {
    try {
      const response = await this.apiClient.get(`/files/${fileId}`);
      return response;
    } catch (error) {
      throw DomainErrorFactory.createFileNotFound('File info not found');
    }
  }

  /**
   * 채널의 파일 목록 조회
   */
  async getChannelFiles(channelId: string): Promise<Array<{
    fileId: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    uploadedBy: string;
    uploadedAt: Date;
  }>> {
    try {
      const response = await this.apiClient.get(`/files/channel/${channelId}`);
      return response;
    } catch (error) {
      throw DomainErrorFactory.createFileNotFound('Channel files not found');
    }
  }

  /**
   * 사용자의 파일 목록 조회
   */
  async getUserFiles(userId: string): Promise<Array<{
    fileId: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    uploadedAt: Date;
    channelId: string;
  }>> {
    try {
      const response = await this.apiClient.get(`/files/user/${userId}`);
      return response;
    } catch (error) {
      throw DomainErrorFactory.createFileNotFound('User files not found');
    }
  }

  /**
   * 파일 삭제
   */
  async deleteFile(fileId: string, userId: string): Promise<boolean> {
    try {
      await this.apiClient.delete(`/files/${fileId}`, {
        data: { userId },
      });
      return true;
    } catch (error) {
      throw DomainErrorFactory.createFileValidation('File deletion failed');
    }
  }

  // ==================== 파일 검색 ====================

  /**
   * 파일 검색
   */
  async searchFiles(query: string, limit: number = 20): Promise<Array<{
    fileId: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    uploadedBy: string;
    uploadedAt: Date;
    channelId: string;
  }>> {
    try {
      const response = await this.apiClient.get(`/files/search?q=${encodeURIComponent(query)}&limit=${limit}`);
      return response;
    } catch (error) {
      throw DomainErrorFactory.createFileNotFound('File search failed');
    }
  }

  /**
   * 파일 타입별 검색
   */
  async searchFilesByType(mimeType: string, limit: number = 20): Promise<Array<{
    fileId: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    uploadedBy: string;
    uploadedAt: Date;
    channelId: string;
  }>> {
    try {
      const response = await this.apiClient.get(`/files/type/${encodeURIComponent(mimeType)}?limit=${limit}`);
      return response;
    } catch (error) {
      throw DomainErrorFactory.createFileNotFound('File type search failed');
    }
  }

  // ==================== 파일 통계 ====================

  /**
   * 채널 파일 통계
   */
  async getChannelFileStats(channelId: string): Promise<{
    totalFiles: number;
    totalSize: number;
    fileTypes: Record<string, number>;
    recentUploads: Array<{
      fileId: string;
      fileName: string;
      uploadedBy: string;
      uploadedAt: Date;
    }>;
  }> {
    try {
      const files = await this.getChannelFiles(channelId);
      const totalFiles = files.length;
      const totalSize = files.reduce((sum, file) => sum + file.fileSize, 0);

      // 파일 타입별 통계
      const fileTypes: Record<string, number> = {};
      files.forEach(file => {
        const type = file.mimeType.split('/')[0];
        fileTypes[type] = (fileTypes[type] || 0) + 1;
      });

      // 최근 업로드
      const recentUploads = files
        .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
        .slice(0, 10)
        .map(file => ({
          fileId: file.fileId,
          fileName: file.fileName,
          uploadedBy: file.uploadedBy,
          uploadedAt: file.uploadedAt,
        }));

      return {
        totalFiles,
        totalSize,
        fileTypes,
        recentUploads,
      };
    } catch (error) {
      throw DomainErrorFactory.createFileNotFound('Failed to get file stats');
    }
  }

  /**
   * 사용자 파일 통계
   */
  async getUserFileStats(userId: string): Promise<{
    totalFiles: number;
    totalSize: number;
    fileTypes: Record<string, number>;
    favoriteChannels: Array<{ channelId: string; fileCount: number }>;
  }> {
    try {
      const files = await this.getUserFiles(userId);
      const totalFiles = files.length;
      const totalSize = files.reduce((sum, file) => sum + file.fileSize, 0);

      // 파일 타입별 통계
      const fileTypes: Record<string, number> = {};
      files.forEach(file => {
        const type = file.mimeType.split('/')[0];
        fileTypes[type] = (fileTypes[type] || 0) + 1;
      });

      // 선호 채널 (파일 업로드가 많은 채널)
      const channelFileCounts: Record<string, number> = {};
      files.forEach(file => {
        channelFileCounts[file.channelId] = (channelFileCounts[file.channelId] || 0) + 1;
      });

      const favoriteChannels = Object.entries(channelFileCounts)
        .map(([channelId, fileCount]) => ({ channelId, fileCount }))
        .sort((a, b) => b.fileCount - a.fileCount)
        .slice(0, 5);

      return {
        totalFiles,
        totalSize,
        fileTypes,
        favoriteChannels,
      };
    } catch (error) {
      throw DomainErrorFactory.createFileNotFound('Failed to get user file stats');
    }
  }

  // ==================== 파일 권한 ====================

  /**
   * 사용자가 파일을 삭제할 수 있는지 확인
   */
  async canUserDeleteFile(userId: string, fileId: string): Promise<boolean> {
    try {
      const fileInfo = await this.getFileInfo(fileId);
      
      // 파일 업로더인지 확인
      if (fileInfo.uploadedBy === userId) {
        return true;
      }

      // 채널 관리자 권한 확인
      const channel = await this.channelRepository.findById(fileInfo.channelId);
      if (channel?.ownerId === userId) {
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  // ==================== 유틸리티 ====================

  /**
   * 파일 검증
   */
  private validateFile(file: File): void {
    // 파일 크기 검증 (100MB 제한)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      throw DomainErrorFactory.createFileValidation('File size exceeds 100MB limit');
    }

    // 파일 타입 검증
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(file.type)) {
      throw DomainErrorFactory.createFileValidation('File type not allowed');
    }
  }

  /**
   * 파일 크기 포맷팅
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
} 