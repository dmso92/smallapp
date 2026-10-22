import { useState } from 'react';
import type { InputImage, ProcessedImage } from '../types/image-processing';

interface ImageComparisonProps {
  input: InputImage;
  result: ProcessedImage;
}

export default function ImageComparison({ input, result }: ImageComparisonProps) {
  const [position, setPosition] = useState(50);

  return (
    <section className="result-section" aria-label="Comparar imagen original y resultado">
      <div className="comparison-heading">
        <span>Vista previa</span>
        <span className="comparison-hint">Desliza para comparar</span>
      </div>
      <div className="comparison-frame">
        <div className="comparison-checkerboard" aria-hidden="true" />
        <img
          className="comparison-image comparison-original"
          src={input.previewUrl}
          alt="Imagen original"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        />
        <img
          className="comparison-image comparison-processed"
          src={result.previewUrl}
          alt="Imagen con el fondo eliminado y transparencia"
          style={{ clipPath: `inset(0 0 0 ${position}%)` }}
        />
        <span className="comparison-label comparison-label-before">Original</span>
        <span className="comparison-label comparison-label-after">Sin fondo</span>
        <div className="comparison-divider" style={{ left: `${position}%` }} aria-hidden="true">
          <span>
            <svg viewBox="0 0 16 16" fill="none">
              <path
                d="m6 4-3 4 3 4m4-8 3 4-3 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
        <input
          className="comparison-range"
          type="range"
          min="0"
          max="100"
          value={position}
          onChange={(event) => setPosition(Number(event.currentTarget.value))}
          aria-label="Comparar original con imagen sin fondo"
          aria-valuetext={`${position}% de imagen original visible`}
        />
      </div>
      <p className="image-dimensions">
        {result.width.toLocaleString()} × {result.height.toLocaleString()} px · PNG
        transparente
      </p>
    </section>
  );
}
