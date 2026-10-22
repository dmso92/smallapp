import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  detectImageMimeType,
  validateImageFile,
} from '../../src/lib/image-input';

function bytes(values: number[]): Uint8Array {
  return Uint8Array.from(values);
}

function imageFile(content: Uint8Array, name: string, type: string): File {
  return new File([content.buffer], name, { type });
}

describe('detectImageMimeType', () => {
  it('recognizes PNG, JPEG, and WebP signatures', () => {
    expect(
      detectImageMimeType(bytes([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
    ).toBe('image/png');
    expect(detectImageMimeType(bytes([0xff, 0xd8, 0xff, 0xe0]))).toBe('image/jpeg');
    expect(
      detectImageMimeType(
        bytes([0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50]),
      ),
    ).toBe('image/webp');
  });

  it('rejects unsupported and truncated signatures', () => {
    expect(detectImageMimeType(bytes([0x47, 0x49, 0x46, 0x38]))).toBeNull();
    expect(detectImageMimeType(bytes([0x52, 0x49, 0x46, 0x46]))).toBeNull();
  });
});

describe('validateImageFile', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns dimensions for a decodable image with a matching signature and MIME type', async () => {
    const close = vi.fn();
    vi.stubGlobal(
      'createImageBitmap',
      vi.fn().mockResolvedValue({ width: 640, height: 480, close }),
    );
    const file = imageFile(
      bytes([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      'portrait.png',
      'image/png',
    );

    await expect(validateImageFile(file)).resolves.toMatchObject({
      name: 'portrait.png',
      mimeType: 'image/png',
      width: 640,
      height: 480,
    });
    expect(close).toHaveBeenCalledOnce();
  });

  it('rejects corrupt content even when the filename and MIME type look valid', async () => {
    const file = imageFile(bytes([0x00, 0x01, 0x02]), 'portrait.png', 'image/png');

    await expect(validateImageFile(file)).rejects.toThrow(
      'El archivo no es una imagen PNG, JPG o WebP válida.',
    );
  });

  it('rejects content whose detected format differs from the declared MIME type', async () => {
    const file = imageFile(bytes([0xff, 0xd8, 0xff, 0xe0]), 'portrait.png', 'image/png');

    await expect(validateImageFile(file)).rejects.toThrow(
      'El tipo de archivo no coincide con su contenido.',
    );
  });

  it('rejects a valid-signature image that the browser cannot decode', async () => {
    vi.stubGlobal('createImageBitmap', vi.fn().mockRejectedValue(new Error('decode failed')));
    const file = imageFile(
      bytes([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      'portrait.png',
      'image/png',
    );

    await expect(validateImageFile(file)).rejects.toThrow(
      'No se pudo abrir esta imagen.',
    );
  });
});
