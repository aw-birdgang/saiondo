import { toast } from 'react-hot-toast';

export interface FileUploadConfig {
  maxFileSize: number; // bytes
  allowedTypes: string[];
  uploadUrl: string;
  token: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResult {
  success: boolean;
  fileUrl?: string;
  fileId?: string;
  error?: string;
}

export class FileUploadService {
  private config: FileUploadConfig;

  constructor(config: FileUploadConfig) {
    this.config = config;
  }

  /**
   * 파일 유효성 검사
   */
  validateFile(file: File): { isValid: boolean; error?: string } {
    // 파일 크기 검사
    if (file.size > this.config.maxFileSize) {
      const maxSizeMB = this.config.maxFileSize / (1024 * 1024);
      return {
        isValid: false,
        error: `파일 크기는 ${maxSizeMB}MB 이하여야 합니다.`
      };
    }

    // 파일 타입 검사
    if (!this.config.allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: '지원하지 않는 파일 형식입니다.'
      };
    }

    return { isValid: true };
  }

  /**
   * 단일 파일 업로드
   */
  async uploadFile(
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResult> {
    try {
      // 파일 유효성 검사
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error
        };
      }

      // FormData 생성
      const formData = new FormData();
      formData.append('file', file);

      // XMLHttpRequest를 사용하여 진행률 추적
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // 진행률 이벤트
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable && onProgress) {
            const progress: UploadProgress = {
              loaded: event.loaded,
              total: event.total,
              percentage: Math.round((event.loaded / event.total) * 100)
            };
            onProgress(progress);
          }
        });

        // 완료 이벤트
        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve({
                success: true,
                fileUrl: response.fileUrl,
                fileId: response.fileId
              });
            } catch (error) {
              resolve({
                success: false,
                error: '서버 응답을 파싱할 수 없습니다.'
              });
            }
          } else {
            resolve({
              success: false,
              error: `업로드 실패: ${xhr.status} ${xhr.statusText}`
            });
          }
        });

        // 에러 이벤트
        xhr.addEventListener('error', () => {
          resolve({
            success: false,
            error: '네트워크 오류가 발생했습니다.'
          });
        });

        // 요청 설정 및 전송
        xhr.open('POST', this.config.uploadUrl);
        xhr.setRequestHeader('Authorization', `Bearer ${this.config.token}`);
        xhr.send(formData);
      });

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      };
    }
  }

  /**
   * 다중 파일 업로드
   */
  async uploadMultipleFiles(
    files: File[],
    onProgress?: (fileIndex: number, progress: UploadProgress) => void
  ): Promise<UploadResult[]> {
    const results: UploadResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // 파일별 진행률 콜백
      const fileProgressCallback = onProgress 
        ? (progress: UploadProgress) => onProgress(i, progress)
        : undefined;

      const result = await this.uploadFile(file, fileProgressCallback);
      results.push(result);

      // 실패한 파일이 있으면 중단
      if (!result.success) {
        break;
      }
    }

    return results;
  }

  /**
   * 이미지 리사이징 및 압축
   */
  async compressImage(
    file: File,
    maxWidth: number = 1920,
    maxHeight: number = 1080,
    quality: number = 0.8
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // 이미지 크기 계산
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        // 캔버스 크기 설정
        canvas.width = width;
        canvas.height = height;

        // 이미지 그리기
        ctx?.drawImage(img, 0, 0, width, height);

        // 압축된 이미지 생성
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              });
              resolve(compressedFile);
            } else {
              reject(new Error('이미지 압축에 실패했습니다.'));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('이미지를 로드할 수 없습니다.'));
      };

      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * 파일 미리보기 URL 생성
   */
  createPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  /**
   * 미리보기 URL 해제
   */
  revokePreviewUrl(url: string): void {
    URL.revokeObjectURL(url);
  }
}

// 기본 설정
const defaultConfig: FileUploadConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  uploadUrl: process.env.REACT_APP_FILE_UPLOAD_URL || '/api/upload',
  token: ''
};

// 전역 인스턴스
let fileUploadService: FileUploadService | null = null;

/**
 * 파일 업로드 서비스 초기화
 */
export const initializeFileUploadService = (token: string): FileUploadService => {
  const config = { ...defaultConfig, token };
  fileUploadService = new FileUploadService(config);
  return fileUploadService;
};

/**
 * 파일 업로드 서비스 가져오기
 */
export const getFileUploadService = (): FileUploadService | null => {
  return fileUploadService;
};

/**
 * 파일 업로드 훅
 */
export const useFileUpload = () => {
  const uploadFile = async (
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResult> => {
    const service = getFileUploadService();
    if (!service) {
      return {
        success: false,
        error: '파일 업로드 서비스가 초기화되지 않았습니다.'
      };
    }

    return service.uploadFile(file, onProgress);
  };

  const uploadMultipleFiles = async (
    files: File[],
    onProgress?: (fileIndex: number, progress: UploadProgress) => void
  ): Promise<UploadResult[]> => {
    const service = getFileUploadService();
    if (!service) {
      return files.map(() => ({
        success: false,
        error: '파일 업로드 서비스가 초기화되지 않았습니다.'
      }));
    }

    return service.uploadMultipleFiles(files, onProgress);
  };

  const compressImage = async (
    file: File,
    maxWidth?: number,
    maxHeight?: number,
    quality?: number
  ): Promise<File> => {
    const service = getFileUploadService();
    if (!service) {
      throw new Error('파일 업로드 서비스가 초기화되지 않았습니다.');
    }

    return service.compressImage(file, maxWidth, maxHeight, quality);
  };

  return {
    uploadFile,
    uploadMultipleFiles,
    compressImage
  };
}; 