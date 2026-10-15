import { useCallback, useEffect, useRef, useState } from 'react';
import { getEnv } from '@/lib/env';
import { getIdToken } from '@/services/firebase/auth.service';
import { getErrorMessage } from '@/utils/errors';

export type AiAnalysisKind = 'technical' | 'fundamental';
export type AiAnalysisStatus = 'idle' | 'streaming' | 'done' | 'error';

const MAX_ANALYSIS_CACHE = 20;

function cacheAnalysis(key: string, value: string): void {
  if (analysisCache.size >= MAX_ANALYSIS_CACHE) {
    const first = analysisCache.keys().next().value;
    if (first !== undefined) analysisCache.delete(first);
  }
  analysisCache.set(key, value);
}

// Cache en memoria por kind:coinId para no quemar tokens al cambiar de tab o volver.
const analysisCache = new Map<string, string>();

interface UseAiAnalysisOptions {
  kind: AiAnalysisKind;
  coinId: string;
  symbol: string;
}

export function useAiAnalysis({ kind, coinId, symbol }: UseAiAnalysisOptions) {
  const cacheKey = `${kind}:${coinId}:${symbol.toUpperCase()}`;

  const [text, setText] = useState(() => analysisCache.get(cacheKey) ?? '');
  const [status, setStatus] = useState<AiAnalysisStatus>(() =>
    analysisCache.has(cacheKey) ? 'done' : 'idle',
  );
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(() => analysisCache.has(cacheKey));

  const controllerRef = useRef<AbortController | null>(null);
  const timerRef = useRef<number | null>(null);
  const bufferRef = useRef('');

  const flush = useCallback(() => {
    if (bufferRef.current.length === 0) return;
    const buffered = bufferRef.current;
    bufferRef.current = '';
    setText((previous) => previous + buffered);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const cancel = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    flush();
    stopTimer();
    setStatus((current) => (current === 'streaming' ? 'done' : current));
  }, [flush, stopTimer]);

  useEffect(
    () => () => {
      controllerRef.current?.abort();
      stopTimer();
    },
    [stopTimer],
  );

  const start = useCallback(async () => {
    if (status === 'streaming') return;

    setText('');
    setError(null);
    setFromCache(false);
    setStatus('streaming');
    bufferRef.current = '';

    const controller = new AbortController();
    controllerRef.current = controller;
    timerRef.current = window.setInterval(flush, 50);

    try {
      const token = await getIdToken();
      if (!token) throw new Error('Tu sesion expiro. Inicia sesion nuevamente.');

      const baseUrl = getEnv().VITE_AI_API_URL.replace(/\/+$/, '');
      const response = await fetch(`${baseUrl}/${kind}`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'content-type': 'application/json',
          accept: 'text/plain',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ coinId, symbol }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        const serverMessage = payload?.message;

        if (response.status === 429) {
          const retryAfter = response.headers.get('retry-after');
          const base = serverMessage ?? 'Limite alcanzado.';
          throw new Error(retryAfter ? `${base} Reintenta en ${retryAfter} segundos.` : base);
        }

        if (response.status === 401) {
          throw new Error('Tu sesion expiro. Inicia sesion nuevamente.');
        }

        throw new Error(serverMessage ?? `El servicio respondio con estado ${response.status}.`);
      }

      setFromCache(response.headers.get('x-ai-cache') === 'HIT');

      if (!response.body) throw new Error('El servicio no devolvio un stream.');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        bufferRef.current += chunk;
      }

      flush();

      if (fullText.trim().length === 0) {
        throw new Error('El modelo no devolvio contenido. Intenta nuevamente.');
      }

      cacheAnalysis(cacheKey, fullText);
      setStatus('done');
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === 'AbortError') {
        flush();
        setStatus('done');
        return;
      }

      flush();
      setError(getErrorMessage(cause));
      setStatus('error');
    } finally {
      stopTimer();
      controllerRef.current = null;
    }
  }, [cacheKey, coinId, flush, kind, status, stopTimer, symbol]);

  return { text, status, error, fromCache, start, cancel };
}
