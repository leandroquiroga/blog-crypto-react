import type { IncomingMessage, ServerResponse } from 'node:http';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  buildUpstreamUrl,
  createCryptoCompareProxyHandler,
  parseProxyRoute,
  resolveProxyConfig,
} from './cryptocompare-proxy.ts';

describe('resolveProxyConfig', () => {
  it('usa valores por defecto cuando faltan variables', () => {
    const config = resolveProxyConfig({});

    expect(config.baseUrl).toBe('https://min-api.cryptocompare.com');
    expect(config.newsPath).toBe('/data/v2/news/');
    expect(config.apiKey).toBeUndefined();
  });

  it('lee las variables del servidor y normaliza el path', () => {
    const config = resolveProxyConfig({
      BASE_URL_CRYPTO_COMPARE: 'https://min-api.cryptocompare.com/',
      PATH_URL_NEWS_CRYPTO_COMPARE: 'data/v2/news/',
      API_KEY_CRYPTO_COMPARE: 'secret-key',
    });

    expect(config.baseUrl).toBe('https://min-api.cryptocompare.com');
    expect(config.newsPath).toBe('/data/v2/news/');
    expect(config.apiKey).toBe('secret-key');
    expect(config.keyIsExposed).toBe(false);
    expect(config.sources.apiKey).toBe('API_KEY_CRYPTO_COMPARE');
  });

  it('acepta las variantes con prefijo VITE_ y las marca como expuestas', () => {
    const config = resolveProxyConfig({
      VITE_BASE_URL_CRYPTO_COMPARE: 'https://min-api.cryptocompare.com',
      VITE_PATH_URL_NEWS_CRYPTO_COMPARE: '/data/v2/news/',
      VITE_API_KEY_CRYPTO_COMPARE: 'secret-key',
    });

    expect(config.apiKey).toBe('secret-key');
    expect(config.keyIsExposed).toBe(true);
    expect(config.sources.apiKey).toBe('VITE_API_KEY_CRYPTO_COMPARE');
  });

  it('prioriza el nombre sin prefijo cuando existen ambos', () => {
    const config = resolveProxyConfig({
      API_KEY_CRYPTO_COMPARE: 'server-only',
      VITE_API_KEY_CRYPTO_COMPARE: 'publica',
    });

    expect(config.apiKey).toBe('server-only');
    expect(config.keyIsExposed).toBe(false);
  });

  it('tolera renombres que terminen igual', () => {
    const config = resolveProxyConfig({
      MI_APP_API_KEY_CRYPTO_COMPARE: 'renombrada',
    });

    expect(config.apiKey).toBe('renombrada');
    expect(config.sources.apiKey).toBe('MI_APP_API_KEY_CRYPTO_COMPARE');
  });
});

describe('buildUpstreamUrl', () => {
  const config = resolveProxyConfig({
    BASE_URL_CRYPTO_COMPARE: 'https://min-api.cryptocompare.com',
    PATH_URL_NEWS_CRYPTO_COMPARE: '/data/v2/news/',
    API_KEY_CRYPTO_COMPARE: 'secret-key',
  });

  it('arma la URL de noticias con la api key del lado del servidor', () => {
    const url = buildUpstreamUrl(config, 'news', new URLSearchParams({ lang: 'ES' }));

    expect(url).toBe(
      'https://min-api.cryptocompare.com/data/v2/news/?lang=ES&api_key=secret-key',
    );
  });

  it('arma la URL de cotizacion con la api key del lado del servidor', () => {
    const url = buildUpstreamUrl(
      config,
      'quote',
      new URLSearchParams({ fsyms: 'BTC', tsyms: 'EUR' }),
    );

    expect(url).toBe(
      'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC&tsyms=EUR&api_key=secret-key',
    );
  });

  it('omite la api key cuando no esta configurada', () => {
    const url = buildUpstreamUrl(resolveProxyConfig({}), 'news', new URLSearchParams());

    expect(url).not.toContain('api_key');
  });
});

describe('parseProxyRoute', () => {
  it('detecta las rutas permitidas', () => {
    expect(parseProxyRoute('/api/cryptocompare/news')).toBe('news');
    expect(parseProxyRoute('/api/cryptocompare/quote/')).toBe('quote');
  });

  it('rechaza rutas desconocidas', () => {
    expect(parseProxyRoute('/api/cryptocompare/otra')).toBeNull();
    expect(parseProxyRoute('/dashboard')).toBeNull();
  });
});

function createRequest(url: string): IncomingMessage {
  return { url } as unknown as IncomingMessage;
}

function createResponse() {
  const headers = new Map<string, string>();
  const end = vi.fn();

  return {
    response: {
      statusCode: 200,
      setHeader: (name: string, value: string) => headers.set(name, value),
      end,
    } as unknown as ServerResponse,
    end,
    getHeader: (name: string) => headers.get(name),
  };
}

function stubUpstream(payload = '{"Data":[]}') {
  const fetchMock = vi.fn(async () => ({
    ok: true,
    status: 200,
    headers: { get: () => 'application/json; charset=utf-8' },
    arrayBuffer: async () => new TextEncoder().encode(payload),
  }));

  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('createCryptoCompareProxyHandler', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('responde 404 para rutas invalidas bajo /api/cryptocompare', async () => {
    const handler = createCryptoCompareProxyHandler(resolveProxyConfig({}));
    const res = createResponse();

    await handler(createRequest('/api/cryptocompare/hack'), res.response, vi.fn());

    expect(res.response.statusCode).toBe(404);
  });

  it('cachea la respuesta upstream y evita llamadas repetidas', async () => {
    const fetchMock = stubUpstream('{"Data":[{"id":"1"}]}');
    const handler = createCryptoCompareProxyHandler(
      resolveProxyConfig({ API_KEY_CRYPTO_COMPARE: 'secret' }),
    );

    const first = createResponse();
    await handler(createRequest('/api/cryptocompare/news?lang=ES'), first.response, vi.fn());

    const second = createResponse();
    await handler(createRequest('/api/cryptocompare/news?lang=ES'), second.response, vi.fn());

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(first.getHeader('x-proxy-cache')).toBe('MISS');
    expect(second.getHeader('x-proxy-cache')).toBe('HIT');
    expect(second.response.statusCode).toBe(200);
  });

  it('responde 500 con un mensaje claro cuando falta la API key', async () => {
    const fetchMock = stubUpstream();
    const handler = createCryptoCompareProxyHandler(resolveProxyConfig({}));
    const res = createResponse();

    await handler(createRequest('/api/cryptocompare/news?lang=EN'), res.response, vi.fn());

    expect(res.response.statusCode).toBe(500);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('responde 504 cuando CryptoCompare no responde a tiempo', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new DOMException('timeout', 'TimeoutError');
      }),
    );
    const handler = createCryptoCompareProxyHandler(
      resolveProxyConfig({ API_KEY_CRYPTO_COMPARE: 'secret' }),
    );
    const res = createResponse();

    await handler(createRequest('/api/cryptocompare/news?lang=FR'), res.response, vi.fn());

    expect(res.response.statusCode).toBe(504);
  });
});
