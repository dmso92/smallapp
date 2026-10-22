export type ImageMimeType = 'image/png' | 'image/jpeg' | 'image/webp';

export type ProcessingStatus =
  | 'idle'
  | 'validating'
  | 'loading-model'
  | 'decoding'
  | 'removing-background'
  | 'encoding'
  | 'success'
  | 'error';

export interface ResourceProgress {
  current: number;
  total: number;
}

export interface InputImage {
  file: File;
  name: string;
  mimeType: ImageMimeType;
  width: number;
  height: number;
  previewUrl: string;
}

export interface ProcessedImage {
  blob: Blob;
  mimeType: 'image/png';
  width: number;
  height: number;
  previewUrl: string;
  downloadName: string;
}

export interface ProcessingState {
  status: ProcessingStatus;
  input: InputImage | null;
  result: ProcessedImage | null;
  progress: ResourceProgress | null;
  error: string | null;
}

export interface ValidatedImageFile {
  file: File;
  name: string;
  mimeType: ImageMimeType;
  width: number;
  height: number;
}
