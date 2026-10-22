import { useEffect } from 'react';
import ImageComparison from './components/ImageComparison';
import ImageDropzone from './components/ImageDropzone';
import ProcessingStatus from './components/ProcessingStatus';
import ResultActions from './components/ResultActions';
import { useBackgroundRemoval } from './hooks/useBackgroundRemoval';

export default function App() {
  const { state, notice, processFile, setInputNotice } = useBackgroundRemoval();

  useEffect(() => {
    function handlePaste(event: ClipboardEvent) {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.closest('input, textarea, [contenteditable="true"]'))
      ) {
        return;
      }

      const clipboardData = event.clipboardData;
      const itemImage = clipboardData
        ? Array.from(clipboardData.items)
            .map((item) => (item.kind === 'file' ? item.getAsFile() : null))
            .find((file): file is File => Boolean(file?.type.startsWith('image/')))
        : undefined;
      const imageFile =
        itemImage ??
        Array.from(clipboardData?.files ?? []).find((file) =>
          file.type.startsWith('image/'),
        );

      if (imageFile) {
        event.preventDefault();
        void processFile(imageFile);
      } else {
        setInputNotice('No encontramos una imagen en el portapapeles. Copia una imagen e inténtalo de nuevo.');
      }
    }

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [processFile, setInputNotice]);

  return (
    <main className="app-shell">
      <div className="ambient-glow ambient-glow-left" aria-hidden="true" />
      <div className="ambient-glow ambient-glow-right" aria-hidden="true" />
      <div className="app-content">
        <header className="brand-header">
          <a className="brand-mark" href="/" aria-label="Forma, inicio">
            <span className="brand-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 5.5A1.5 1.5 0 0 1 6.5 4h11A1.5 1.5 0 0 1 19 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 18.5v-13Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path d="m8 15 2.4-2.5 2 1.8 3.6-4.1L19 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="9" cy="8.5" r="1" fill="currentColor" />
              </svg>
            </span>
            <span>forma<span className="brand-period">.</span></span>
          </a>
          <span className="privacy-pill">
            <span className="privacy-dot" />
            100% privado
          </span>
        </header>

        <section className="hero-copy">
          <p className="eyebrow">EDICIÓN DE IMAGEN, SIMPLIFICADA</p>
          <h1>
            El fondo se va.
            <br />
            <span>Tu imagen queda.</span>
          </h1>
          <p className="hero-description">
            Recortes limpios en segundos. Sin subir tus imágenes, sin complicaciones.
          </p>
        </section>

        <section className="workspace-card" aria-label="Eliminador de fondos">
          <div className="card-topline">
            <span className="card-label">ELIMINAR FONDO</span>
            <span className="card-local">
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 2.5 3.5 4.2v3.1c0 3.1 1.9 5.2 4.5 6.2 2.6-1 4.5-3.1 4.5-6.2V4.2L8 2.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                <path d="m6 8 1.3 1.3L10 6.7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Procesamiento local
            </span>
          </div>

          <ImageDropzone onFile={(file) => void processFile(file)} />
          <ProcessingStatus state={state} notice={notice} />

          {state.status === 'success' && state.input && state.result && (
            <>
              <ImageComparison input={state.input} result={state.result} />
              <ResultActions result={state.result} />
            </>
          )}
        </section>

        <footer className="page-footer">
          <span>Hecho para que crear sea más fácil.</span>
          <span className="footer-dot" />
          <span>Tus imágenes nunca salen de tu dispositivo.</span>
        </footer>
      </div>
    </main>
  );
}
