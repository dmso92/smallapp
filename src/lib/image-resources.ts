export function createPreviewUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}

export function releasePreviewUrl(url: string | null | undefined): void {
  if (url) {
    URL.revokeObjectURL(url);
  }
}

export function releaseImageUrls(...urls: Array<string | null | undefined>): void {
  for (const url of new Set(urls)) {
    releasePreviewUrl(url);
  }
}
