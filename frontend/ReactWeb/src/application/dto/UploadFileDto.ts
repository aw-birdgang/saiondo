/**
 * UploadFile Use Case DTOs
 * 파일 업로드 관련 Request/Response 인터페이스
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

export interface FileValidationRequest {
  file: File;
  maxSize?: number;
  allowedTypes?: string[];
}

export interface FileValidationResponse {
  isValid: boolean;
  errors: string[];
  fileType: string;
  fileSize: number;
}

export interface FileUploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
} 