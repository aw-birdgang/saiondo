import type { FileService } from '../services/FileService';
import { DomainErrorFactory } from '../../domain/errors/DomainError';
import type { FileDownloadProgress, FileDownloadRequest, FileDownloadResponse } from '../dto/FileDownloadDto';
import type { IUseCase } from './interfaces/IUseCase';

export class FileDownloadUseCase implements IUseCase<FileDownloadRequest, FileDownloadResponse> {
  constructor(private readonly fileService: FileService) {}

  async execute(request: FileDownloadRequest): Promise<FileDownloadResponse> {
    return this.downloadFile(request);
  }

  async downloadFile(request: FileDownloadRequest): Promise<FileDownloadResponse> {
    try {
      // Validate request
      if (!request.fileId || request.fileId.trim().length === 0) {
        throw DomainErrorFactory.createMessageValidation('File ID is required');
      }

      if (!request.userId || request.userId.trim().length === 0) {
        throw DomainErrorFactory.createUserValidation('User ID is required');
      }

      // Use FileService to download file
      const downloadResponse = await this.fileService.downloadFile({
        fileUrl: request.fileId, // Assuming fileId is the file URL
        fileName: 'download.file'
      });

      return {
        fileUrl: downloadResponse.downloadUrl,
        fileName: 'download.file',
        fileSize: 0, // FileService doesn't provide file size in response
        contentType: 'application/octet-stream',
        expiresAt: downloadResponse.expiresAt,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation('Failed to download file');
    }
  }

  async getDownloadProgress(fileId: string, userId: string): Promise<FileDownloadProgress> {
    try {
      // In real implementation, this would track download progress
      // For now, return a mock progress
      return {
        fileId,
        progress: 100,
        status: 'completed',
      };
    } catch (error) {
      return {
        fileId,
        progress: 0,
        status: 'error',
        error: 'Failed to get download progress',
      };
    }
  }
}
