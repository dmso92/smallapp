import type { ProcessingState } from '../types/image-processing';

interface ProcessingStatusProps {
  state: ProcessingState;
  notice: string | null;
}

const labels: Record<ProcessingState['status'], string> = {
  idle: 'Tu imagen permanece en tu dispositivo.',
  validating: 'Validando imagen…',
  'loading-model': 'Inicializando modelo IA…',
  decoding: 'Preparando imagen…',
  'removing-background': 'Removiendo fondo…',
  encoding: 'Preparando PNG transparente…',
  success: 'Fondo eliminado. Tu imagen está lista.',
  error: 'No pudimos completar el proceso.',
};

export default function ProcessingStatus({ state, notice }: ProcessingStatusProps) {
  const loading =
    state.status === 'loading-model' ||
    state.status === 'decoding' ||
    state.status === 'removing-background' ||
    state.status === 'encoding';
  const processingError = state.status === 'error' && !notice;
  const message = notice ?? (processingError ? state.error : labels[state.status]);
  const progressPercentage =
    state.progress && state.progress.total > 0
      ? Math.round(
          (Math.max(
            0,
            Math.min(state.progress.current, state.progress.total),
          ) /
            state.progress.total) *
            100,
        )
      : null;

  return (
    <div
      className={`status-row ${state.status === 'error' || notice ? 'status-error' : ''}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className={`status-indicator ${loading ? 'status-indicator-loading' : ''}`}>
        {loading ? (
          <span className="spinner" aria-hidden="true" />
        ) : state.status === 'success' ? (
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="m5 10 3.2 3.2L15.5 6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : state.status === 'error' || notice ? (
          <span aria-hidden="true">!</span>
        ) : (
          <span className="status-dot" aria-hidden="true" />
        )}
      </span>
      <div className="status-content">
        <p className="status-message">{message}</p>
        {processingError && (
          <p className="status-detail">
            {state.error?.includes('recarga')
              ? 'Después de recargar, vuelve a elegir tu imagen.'
              : 'Puedes elegir otra imagen para volver a intentarlo.'}
          </p>
        )}
        {notice && (
          <p className="status-detail">
            {state.result
              ? 'El resultado anterior sigue disponible.'
              : 'No se inició el procesamiento de esta imagen.'}
          </p>
        )}
        {progressPercentage !== null && loading && (
          <div
            className="progress-track"
            role="progressbar"
            aria-label="Descarga de recursos"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressPercentage}
          >
            <span style={{ width: `${progressPercentage}%` }} />
          </div>
        )}
      </div>
    </div>
  );
}
