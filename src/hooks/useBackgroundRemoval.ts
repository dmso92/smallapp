import { removeBackground } from '@imgly/background-removal';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPreviewUrl, releaseImageUrls } from '../lib/image-resources';
import { getImageDimensions, validateImageFile } from '../lib/image-input';
import type {
  InputImage,
  ProcessingState,
  ProcessingStatus,
  ResourceProgress,
} from '../types/image-processing';

const initialState: ProcessingState = {
  status: 'idle',
  input: null,
  result: null,
  progress: null,
  error: null,
};

function progressStatus(key: string): ProcessingStatus | null {
  if (key.startsWith('fetch:')) {
    return 'loading-model';
  }
  if (key === 'compute:decode') {
    return 'decoding';
  }
  if (key === 'compute:inference' || key === 'compute:mask') {
    return 'removing-background';
  }
  if (key === 'compute:encode') {
    return 'encoding';
  }
  return null;
}

export function useBackgroundRemoval() {
  const [state, setState] = useState<ProcessingState>(initialState);
  const [notice, setNotice] = useState<string | null>(null);
  const validationIdRef = useRef(0);
  const runIdRef = useRef(0);
  const urlsRef = useRef<{ input: string | null; result: string | null }>({
    input: null,
    result: null,
  });

  useEffect(
    () => () => {
      releaseImageUrls(urlsRef.current.input, urlsRef.current.result);
      urlsRef.current = { input: null, result: null };
    },
    [],
  );

  const processFile = useCallback(async (file: File) => {
    const validationId = ++validationIdRef.current;
    setNotice(null);

    let validated;
    try {
      validated = await validateImageFile(file);
    } catch (error) {
      if (validationId !== validationIdRef.current) {
        return;
      }
      setNotice(
        error instanceof Error
          ? error.message
          : 'No se pudo validar la imagen. Prueba con otro archivo.',
      );
      return;
    }

    if (validationId !== validationIdRef.current) {
      return;
    }

    const runId = ++runIdRef.current;
    const inputPreviewUrl = createPreviewUrl(file);
    const input: InputImage = { ...validated, previewUrl: inputPreviewUrl };
    releaseImageUrls(urlsRef.current.input, urlsRef.current.result);
    urlsRef.current = { input: inputPreviewUrl, result: null };

    setState({
      status: 'loading-model',
      input,
      result: null,
      progress: null,
      error: null,
    });

    try {
      const blob = await removeBackground(file, {
        progress: (key: string, current: number, total: number) => {
          if (runId !== runIdRef.current) {
            return;
          }

          const status = progressStatus(key);
          const progress: ResourceProgress | null =
            key.startsWith('fetch:') && total > 0
              ? { current: Math.min(current, total), total }
              : null;

          if (status) {
            setState((currentState) =>
              runId === runIdRef.current
                ? { ...currentState, status, progress }
                : currentState,
            );
          }
        },
      });

      if (runId !== runIdRef.current) {
        return;
      }

      const dimensions = await getImageDimensions(blob);
      if (
        blob.type !== 'image/png' ||
        dimensions.width !== input.width ||
        dimensions.height !== input.height
      ) {
        throw new Error('El resultado no conservó el formato PNG y las dimensiones originales.');
      }

      const resultPreviewUrl = createPreviewUrl(blob);
      const baseName = input.name.replace(/\.[^.]+$/, '') || 'imagen';
      const result = {
        blob,
        mimeType: 'image/png' as const,
        width: dimensions.width,
        height: dimensions.height,
        previewUrl: resultPreviewUrl,
        downloadName: `${baseName}.png`,
      };
      urlsRef.current.result = resultPreviewUrl;
      setState({
        status: 'success',
        input,
        result,
        progress: null,
        error: null,
      });
    } catch (error) {
      if (runId !== runIdRef.current) {
        return;
      }

      setState((currentState) => ({
        ...currentState,
        status: 'error',
        result: null,
        progress: null,
        error:
          error instanceof Error && /failed to fetch|networkerror/i.test(error.message)
            ? `No se pudieron cargar los recursos del modelo (${error.message}). Comprueba tu conexión, recarga la página e inténtalo de nuevo.`
            : error instanceof Error
              ? `No se pudo quitar el fondo: ${error.message}`
              : 'No se pudo quitar el fondo. Comprueba tu conexión e inténtalo de nuevo.',
      }));
    }
  }, []);

  const setInputNotice = useCallback((message: string) => {
    setNotice(message);
  }, []);

  return { state, notice, processFile, setInputNotice };
}
