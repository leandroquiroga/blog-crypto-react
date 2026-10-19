import { getEnv } from '@/lib/env';
import type { Currency } from '@/types/crypto.types';
import { newsResponseSchema, type NewsArticle } from '@/types/news.types';
import { quoteResponseSchema, type Quote } from '@/types/quote.types';
import { parseApiResponse } from '@/utils/parse';
import { ApiError, httpGet } from './http/client';

function getApiBaseUrl(): string {
  return getEnv().VITE_CRYPTOCOMPARE_API_URL.replace(/\/+$/, '');
}

/** El proxy corta a los 12s, asi que damos margen para que responda con un error claro. */
const NEWS_REQUEST_TIMEOUT_MS = 20_000;

export interface FetchNewsOptions {
  language?: string;
  /** Devuelve noticias anteriores a este timestamp UNIX (parametro lTs). */
  beforeTimestamp?: number;
  signal?: AbortSignal;
}

/**
 * El navegador solo conoce este endpoint interno; el proxy agrega la API key
 * del lado del servidor y resuelve la URL real de CryptoCompare.
 */
export async function fetchNews(options: FetchNewsOptions = {}): Promise<NewsArticle[]> {
  const { language = 'ES', beforeTimestamp, signal } = options;

  const params = new URLSearchParams({ lang: language });
  if (beforeTimestamp !== undefined) params.set('lTs', String(beforeTimestamp));

  const data = await httpGet<unknown>(`${getApiBaseUrl()}/news?${params.toString()}`, {
    signal,
    timeoutMs: NEWS_REQUEST_TIMEOUT_MS,
  });
  const parsed = parseApiResponse(newsResponseSchema, data, 'cryptocompare/news');

  if (parsed.Response === 'Error' || !parsed.Data) {
    throw new ApiError(parsed.Message ?? 'No se pudieron obtener las noticias.');
  }

  return parsed.Data;
}

export async function fetchQuote(
  symbol: string,
  currency: Currency,
  signal?: AbortSignal,
): Promise<Quote> {
  const from = symbol.toUpperCase();
  const params = new URLSearchParams({ fsyms: from, tsyms: currency });

  const data = await httpGet<unknown>(`${getApiBaseUrl()}/quote?${params.toString()}`, {
    signal,
  });
  const parsed = parseApiResponse(quoteResponseSchema, data, 'cryptocompare/quote');

  if (parsed.Response === 'Error') {
    throw new ApiError(parsed.Message ?? 'No se pudo obtener la cotizacion solicitada.');
  }

  const raw = parsed.RAW?.[from]?.[currency];
  const display = parsed.DISPLAY?.[from]?.[currency];

  if (!raw) {
    throw new ApiError('No hay cotizacion disponible para esa combinacion de monedas.');
  }

  return {
    symbol: from,
    currency,
    price: raw.PRICE ?? 0,
    change24h: raw.CHANGE24HOUR ?? null,
    changePct24h: raw.CHANGEPCT24HOUR ?? null,
    high24h: raw.HIGH24HOUR ?? null,
    low24h: raw.LOW24HOUR ?? null,
    lastUpdate: raw.LASTUPDATE ? new Date(raw.LASTUPDATE * 1000).toISOString() : null,
    displayPrice: typeof display?.['PRICE'] === 'string' ? display['PRICE'] : null,
  };
}
