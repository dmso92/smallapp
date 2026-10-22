import { useState } from 'react';
import { copyPngToClipboard, downloadPng } from '../lib/image-export';
import type { ProcessedImage } from '../types/image-processing';

interface ResultActionsProps {
  result: ProcessedImage;
}

export default function ResultActions({ result }: ResultActionsProps) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');
  const [copyMessage, setCopyMessage] = useState('');

  async function handleCopy() {
    setCopyState('idle');
    setCopyMessage('');
    try {
      await copyPngToClipboard(result);
      setCopyState('copied');
      setCopyMessage('Imagen copiada al portapapeles.');
    } catch (error) {
      setCopyState('error');
      setCopyMessage(
        error instanceof Error
          ? `${error.message} Puedes descargar el PNG en su lugar.`
          : 'No se pudo copiar la imagen. Puedes descargar el PNG en su lugar.',
      );
    }
  }

  return (
    <div className="actions-wrap">
      <div className="result-actions">
        <button
          className="button-primary"
          type="button"
          onClick={() => downloadPng(result)}
        >
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M10 3v9m0 0 3.5-3.5M10 12 6.5 8.5M4 13v2.5A1.5 1.5 0 0 0 5.5 17h9a1.5 1.5 0 0 0 1.5-1.5V13"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Descargar PNG (HD)
        </button>
        <button
          className="button-copy"
          type="button"
          onClick={handleCopy}
          aria-label="Copiar al portapapeles"
        >
          {copyState === 'copied' ? (
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <rect x="7" y="6" width="9" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M13 6V4.5A1.5 1.5 0 0 0 11.5 3h-7A1.5 1.5 0 0 0 3 4.5v9A1.5 1.5 0 0 0 4.5 15H7" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          )}
          {copyState === 'copied' ? 'Copiado' : 'Copiar al portapapeles'}
        </button>
      </div>
      {copyMessage && (
        <p
          className={`copy-feedback ${copyState === 'error' ? 'copy-feedback-error' : ''}`}
          role="status"
          aria-live="polite"
        >
          {copyMessage}
        </p>
      )}
    </div>
  );
}
