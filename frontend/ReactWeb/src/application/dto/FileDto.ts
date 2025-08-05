/**
 * File Use Case DTOs
 * 파일 관리 관련 Request/Response 인터페이스
 */

export interface FileUploadRequest {
  file: File;
  channelId: string;
  senderId: string;
  description?: string;
}

export interface FileUploadResponse {
  message: any; // Message DTO
  fileUrl: string;
  fileSize: number;
  fileName: string;
}

export interface FileDownloadRequest {
  fileId: string;
}

export interface FileDownloadResponse {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export interface GetFileRequest {
  fileId: string;
}

export interface GetFileResponse {
  file: FileProfile | null;
  success: boolean;
  error?: string;
  cached: boolean;
  fetchedAt: Date;
}

export interface GetFileStatsRequest {
  channelId?: string;
  userId?: string;
}

export interface GetFileStatsResponse {
  stats: FileStats | null;
  success: boolean;
  error?: string;
  cached: boolean;
  fetchedAt: Date;
}

export interface ValidateFileRequest {
  file: File;
}

export interface ValidateFileResponse {
  isValid: boolean;
  error?: string;
  success: boolean;
}

export interface FileProfile {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  fileUrl: string;
  channelId: string;
  senderId: string;
  uploadedAt: Date;
  lastAccessedAt?: Date;
  downloadCount: number;
  isPublic: boolean;
}

export interface FileStats {
  totalFiles: number;
  totalSize: number;
  filesByType: Record<string, number>;
  averageFileSize: number;
  lastUploadedAt: Date;
  channelId?: string;
  userId?: string;
}

export interface FileValidationSchema {
  fileName: { required: boolean; type: string; maxLength: number };
  fileSize: { required: boolean; type: string; maxSize: number };
  mimeType: { required: boolean; type: string; allowedTypes: string[] };
}

export interface FileServiceConfig {
  enableValidation?: boolean;
  enablePerformanceMonitoring?: boolean;
  enableSecurityChecks?: boolean;
  maxFileSize?: number;
  allowedTypes?: string[];
  enableVirusScan?: boolean;
  enableCompression?: boolean;
} 