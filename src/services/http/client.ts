export class ApiError extends Error {
  readonly status?: number;

  constructor(message: string, options: { status?: number; cause?: unknown } = {}) {
    super(message, { cause: options.cause });
    this.name = 'ApiError';
    this.status = options.status;
  }
}

export interface HttpGetOptions {
  signal?: AbortSignal;
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 12_000;

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

function isTimeoutError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'TimeoutError';
}

function describeCause(cause: unknown): string {
  if (!import.meta.env.DEV || !(cause instanceof Error) || !cause.message) return '';
  return ` (${cause.message})`;
}

export async function httpGet<T = unknown>(url: string, options: HttpGetOptions = {}): Promise<T> {
  const { signal, timeoutMs = DEFAULT_TIMEOUT_MS } = options;
  const timeoutSignal = AbortSignal.timeout(timeoutMs);
  const requestSignal = signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal;

  try {
    const response = await fetch(url, {
      signal: requestSignal,
      headers: { accept: 'application/json' },
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new ApiError(
          'El servicio esta limitando las solicitudes. Espera unos segundos e intenta nuevamente.',
          { status: 429 },
        );
      }

      throw new ApiError(`El servicio respondio con estado ${response.status}.`, {
        status: response.status,
      });
    }

    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('json')) {
      throw new ApiError('El servicio devolvio una respuesta inesperada.', { status: 502 });
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError || isAbortError(error)) throw error;

    if (isTimeoutError(error)) {
      throw new ApiError('El servicio tardo demasiado en responder. Intenta nuevamente.', {
        status: 408,
        cause: error,
      });
    }

    throw new ApiError(
      `No se pudo conectar con el servicio. Revisa tu conexion e intenta nuevamente.${describeCause(error)}`,
      { cause: error },
    );
  }
}
