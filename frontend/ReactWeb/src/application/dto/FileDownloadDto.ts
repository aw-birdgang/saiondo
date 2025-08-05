/**
 * FileDownload Use Case DTOs
 * 파일 다운로드 관련 Request/Response 인터페이스
 */

export interface FileDownloadRequest {
  fileId: string;
  userId: string;
  channelId?: string;
}

export interface FileDownloadResponse {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  expiresAt?: Date;
}

export interface FileDownloadProgress {
  fileId: string;
  progress: number;
  status: 'pending' | 'downloading' | 'completed' | 'error';
  error?: string;
}
