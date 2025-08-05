import { FileService } from '../services/FileService';
import type {
  FileUploadRequest,
  FileUploadResponse,
} from '../dto/UploadFileDto';

export class UploadFileUseCase {
  constructor(private readonly fileService: FileService) {}

  async execute(request: FileUploadRequest): Promise<FileUploadResponse> {
    return await this.fileService.uploadFile(request);
  }

  async validateFile(
    file: File
  ): Promise<{ isValid: boolean; error?: string }> {
    return await this.fileService.validateFile(file);
  }

  getSupportedFileTypes(): string[] {
    return this.fileService.getSupportedFileTypes();
  }

  getMaxFileSize(): number {
    return this.fileService.getMaxFileSize();
  }
}
