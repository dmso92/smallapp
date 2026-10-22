import { useId, useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { firstImageFile } from '../lib/image-input';

interface ImageDropzoneProps {
  onFile: (file: File) => void;
}

export default function ImageDropzone({ onFile }: ImageDropzoneProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (file) {
      onFile(file);
    }
    event.currentTarget.value = '';
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    setIsDragging(true);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = firstImageFile(event.dataTransfer.files);
    if (file) {
      onFile(file);
    }
  }

  return (
    <div
      className={`dropzone ${isDragging ? 'dropzone-active' : ''}`}
      onDragEnter={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragOver={handleDragOver}
      onDragLeave={(event) => {
        const nextTarget = event.relatedTarget;
        if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
          setIsDragging(false);
        }
      }}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        id={inputId}
        className="sr-only"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleInputChange}
        aria-label="Elegir imagen"
      />
      <div className="dropzone-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 15.5v3A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5v-3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="dropzone-title">
        {isDragging ? 'Suelta tu imagen aquí' : 'Arrastra una imagen aquí'}
      </p>
      <p className="dropzone-copy">o selecciónala desde tu dispositivo</p>
      <button
        className="button-secondary"
        type="button"
        onClick={() => inputRef.current?.click()}
      >
        Explorar archivos
      </button>
      <p className="dropzone-formats">PNG, JPG o WebP</p>
    </div>
  );
}
