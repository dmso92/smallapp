import type { ImageMimeType, ValidatedImageFile } from '../types/image-processing';

const acceptedMimeTypes = new Set<string>([
  'image/png',
  'image/jpeg',
  'image/webp',
]);

export class ImageValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImageValidationError';
  }
}

export function detectImageMimeType(bytes: Uint8Array): ImageMimeType | null {
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return 'image/png';
  }

  if (
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  ) {
    return 'image/jpeg';
  }

  if (
    bytes.length >= 12 &&
    String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' &&
    String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP'
  ) {
    return 'image/webp';
  }

  return null;
}

export async function validateImageFile(file: File): Promise<ValidatedImageFile> {
  const prefix = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const detectedMimeType = detectImageMimeType(prefix);

  if (!detectedMimeType || !acceptedMimeTypes.has(detectedMimeType)) {
    throw new ImageValidationError('El archivo no es una imagen PNG, JPG o WebP válida.');
  }

  if (file.type && file.type !== detectedMimeType) {
    throw new ImageValidationError(
      'El tipo de archivo no coincide con su contenido. Elige una imagen PNG, JPG o WebP válida.',
    );
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new ImageValidationError(
      'No se pudo abrir esta imagen. Prueba con otro archivo PNG, JPG o WebP.',
    );
  }

  const { width, height } = bitmap;
  bitmap.close();

  if (width < 1 || height < 1) {
    throw new ImageValidationError('La imagen no tiene dimensiones válidas.');
  }

  return {
    file,
    name: file.name || `imagen.${detectedMimeType.split('/')[1]}`,
    mimeType: detectedMimeType,
    width,
    height,
  };
}

export async function getImageDimensions(blob: Blob): Promise<{
  width: number;
  height: number;
}> {
  const bitmap = await createImageBitmap(blob);
  const dimensions = { width: bitmap.width, height: bitmap.height };
  bitmap.close();
  return dimensions;
}

export function firstImageFile(files: FileList | readonly File[]): File | null {
  const availableFiles = Array.from(files);
  for (const file of availableFiles) {
    if (!file.type || acceptedMimeTypes.has(file.type)) {
      return file;
    }
  }
  return availableFiles[0] ?? null;
}
