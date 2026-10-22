import type { ProcessedImage } from '../types/image-processing';

export function downloadPng(result: ProcessedImage): void {
  const url = URL.createObjectURL(result.blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = result.downloadName;
  link.style.display = 'none';
  document.body.append(link);
  try {
    link.click();
  } finally {
    link.remove();
  }
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function copyPngToClipboard(result: ProcessedImage): Promise<void> {
  if (
    !window.isSecureContext ||
    !navigator.clipboard ||
    typeof ClipboardItem === 'undefined'
  ) {
    throw new Error('Copiar imágenes requiere un navegador compatible y una conexión segura (HTTPS).');
  }

  await navigator.clipboard.write([
    new ClipboardItem({ 'image/png': result.blob }),
  ]);
}
