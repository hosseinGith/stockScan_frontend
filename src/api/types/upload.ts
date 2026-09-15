// ============================================
// تایپ‌های Upload
// ============================================

export interface UploadedFile {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  size: number;
  mimetype: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UploadResponse {
  success: boolean;
  file: UploadedFile;
  message?: string;
}

export interface MultipleUploadResponse {
  success: boolean;
  files: UploadedFile[];
  message?: string;
}

export interface FileInfoResponse {
  exists: boolean;
  path: string;
  size: number;
  mimetype: string;
}

export interface UploadOptions {
  subFolder?: string;
  onProgress?: (percent: number) => void;
}

// ============================================
// تایپ‌های مفید
// ============================================

export interface FileWithPreview extends File {
  preview?: string;
  id?: string;
  progress?: number;
  status?: 'uploading' | 'success' | 'error' | 'idle';
}

export interface FileUploadState {
  files: FileWithPreview[];
  isUploading: boolean;
  progress: number;
  error: string | null;
}