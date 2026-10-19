import type { IncomingMessage, ServerResponse } from 'node:http';

const DEFAULT_BASE_URL = 'https://min-api.cryptocompare.com';
const DEFAULT_NEWS_PATH = '/data/v2/news/';
const QUOTE_PATH = '/data/pricemultifull';
const UPSTREAM_TIMEOUT_MS = 12_000;
const CACHE_TTL_MS = 60_000;
const CACHE_MAX_ENTRIES = 50;
const VITE_PREFIX = 'VITE_';

export interface CryptoCompareProxySources {
  baseUrl: string | null;
  newsPath: string | null;
  apiKey: string | null;
}

export interface CryptoCompareProxyConfig {
  baseUrl: string;
  newsPath: string;
  apiKey?: string;
  /** true cuando la API key se leyo de una variable con prefijo VITE_. */
  keyIsExposed: boolean;
  /** Nombres de las variables usadas (solo diagnostico, nunca valores). */
  sources: CryptoCompareProxySources;
}

export type ProxyRoute = 'news' | 'quote';

export type ProxyNext = (error?: unknown) => void;

type EnvRecord = Record<string, string | undefined>;

interface ResolvedEnvValue {
  value?: string;
  source: string | null;
  isPubliclyPrefixed: boolean;
}

interface CacheEntry {
  body: Buffer;
  contentType: string;
  status: number;
  expiresAt: number;
}

const responseCache = new Map<string, CacheEntry>();

function normalizePath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}

/**
 * Acepta tanto el nombre recomendado (sin prefijo, server-only) como la
 * variante con prefijo VITE_ e incluso renombres que terminen igual.
 */
function resolveEnvValue(env: EnvRecord, baseName: string): ResolvedEnvValue {
  const exact = env[baseName];
  if (exact) {
    return { value: exact, source: baseName, isPubliclyPrefixed: false };
  }

  const prefixedName = `${VITE_PREFIX}${baseName}`;
  const prefixed = env[prefixedName];
  if (prefixed) {
    return { value: prefixed, source: prefixedName, isPubliclyPrefixed: true };
  }

  const normalizedBase = baseName.toUpperCase();
  const match = Object.keys(env).find(
    (name) => name.toUpperCase().endsWith(normalizedBase) && Boolean(env[name]),
  );

  if (match) {
    return {
      value: env[match],
      source: match,
      isPubliclyPrefixed: match.toUpperCase().startsWith(VITE_PREFIX),
    };
  }

  return { source: null, isPubliclyPrefixed: false };
}

export function resolveProxyConfig(env: EnvRecord): CryptoCompareProxyConfig {
  const baseUrl = resolveEnvValue(env, 'BASE_URL_CRYPTO_COMPARE');
  const newsPath = resolveEnvValue(env, 'PATH_URL_NEWS_CRYPTO_COMPARE');
  const apiKey = resolveEnvValue(env, 'API_KEY_CRYPTO_COMPARE');

  return {
    baseUrl: (baseUrl.value ?? DEFAULT_BASE_URL).replace(/\/+$/, ''),
    newsPath: normalizePath(newsPath.value ?? DEFAULT_NEWS_PATH),
    apiKey: apiKey.value || undefined,
    keyIsExposed: Boolean(apiKey.value) && apiKey.isPubliclyPrefixed,
    sources: {
      baseUrl: baseUrl.source,
      newsPath: newsPath.source,
      apiKey: apiKey.source,
    },
  };
}

/**
 * Construye la URL upstream agregando la API key del lado del servidor.
 * El navegador nunca conoce ni la key ni la URL real de CryptoCompare.
 */
export function buildUpstreamUrl(
  config: CryptoCompareProxyConfig,
  route: ProxyRoute,
  searchParams: URLSearchParams,
): string | null {
  const path = route === 'news' ? config.newsPath : QUOTE_PATH;
  const params = new URLSearchParams(searchParams);

  if (config.apiKey) params.set('api_key', config.apiKey);

  return `${config.baseUrl}${path}?${params.toString()}`;
}

export function parseProxyRoute(pathname: string): ProxyRoute | null {
  const match = pathname.match(/\/api\/cryptocompare\/([^/]+)\/?$/);
  const route = match?.[1];

  if (route === 'news' || route === 'quote') return route;

  return null;
}

export function missingApiKeyMessage(): string {
  return [
    'Falta API_KEY_CRYPTO_COMPARE en el entorno del servidor.',
    'Se acepta tambien VITE_API_KEY_CRYPTO_COMPARE, pero esa variante expone la key al navegador.',
    'Revisa .env.local y reinicia el dev server.',
  ].join(' ');
}

function getCacheKey(route: ProxyRoute, searchParams: URLSearchParams): string {
  const params = new URLSearchParams(searchParams);
  params.delete('api_key');
  params.sort();

  return `${route}?${params.toString()}`;
}

function readFromCache(cacheKey: string): CacheEntry | null {
  const entry = responseCache.get(cacheKey);

  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    responseCache.delete(cacheKey);
    return null;
  }

  return entry;
}

function writeToCache(cacheKey: string, entry: CacheEntry): void {
  if (responseCache.size >= CACHE_MAX_ENTRIES) {
    const oldestKey = responseCache.keys().next().value;
    if (oldestKey !== undefined) responseCache.delete(oldestKey);
  }

  responseCache.set(cacheKey, entry);
}

export function createCryptoCompareProxyHandler(config: CryptoCompareProxyConfig) {
  return async function handle(
    req: IncomingMessage,
    res: ServerResponse,
    next: ProxyNext,
  ): Promise<void> {
    const requestUrl = new URL(req.url ?? '/', 'http://localhost');

    if (!requestUrl.pathname.startsWith('/api/cryptocompare')) {
      next();
      return;
    }

    const route = parseProxyRoute(requestUrl.pathname);

    if (!route) {
      res.statusCode = 404;
      res.setHeader('content-type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ message: 'Ruta de proxy no valida.' }));
      return;
    }

    if (!config.apiKey) {
      res.statusCode = 500;
      res.setHeader('content-type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ message: missingApiKeyMessage() }));
      return;
    }

    const cacheKey = getCacheKey(route, requestUrl.searchParams);
    const cached = readFromCache(cacheKey);

    if (cached) {
      res.statusCode = cached.status;
      res.setHeader('content-type', cached.contentType);
      res.setHeader('cache-control', 'public, max-age=60');
      res.setHeader('x-proxy-cache', 'HIT');
      res.end(cached.body);
      return;
    }

    const upstreamUrl = buildUpstreamUrl(config, route, requestUrl.searchParams);
    if (!upstreamUrl) {
      next();
      return;
    }

    try {
      const upstream = await fetch(upstreamUrl, {
        signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
        headers: { accept: 'application/json' },
      });

      const contentType =
        upstream.headers.get('content-type') ?? 'application/json; charset=utf-8';
      const body = Buffer.from(await upstream.arrayBuffer());

      res.statusCode = upstream.status;
      res.setHeader('content-type', contentType);
      res.setHeader('cache-control', 'public, max-age=60');
      res.setHeader('x-proxy-cache', 'MISS');
      res.end(body);

      if (upstream.ok) {
        writeToCache(cacheKey, {
          body,
          contentType,
          status: upstream.status,
          expiresAt: Date.now() + CACHE_TTL_MS,
        });
      }
    } catch (error) {
      const isTimeout = error instanceof DOMException && error.name === 'TimeoutError';
      console.error('[cryptocompare-proxy] Error consultando CryptoCompare:', error);

      res.statusCode = isTimeout ? 504 : 502;
      res.setHeader('content-type', 'application/json; charset=utf-8');
      res.end(
        JSON.stringify({
          message: isTimeout
            ? 'CryptoCompare tardo demasiado en responder.'
            : 'No se pudo consultar CryptoCompare.',
        }),
      );
    }
  };
}
