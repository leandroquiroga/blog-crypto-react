import type { IncomingMessage, ServerResponse } from 'node:http';
import {
  buildUpstreamUrl,
  missingApiKeyMessage,
  parseProxyRoute,
  resolveProxyConfig,
} from '../../server/cryptocompare-proxy.ts';

/**
 * Handler serverless (formato Vercel). En produccion la API key vive en las
 * variables de entorno del servidor; el cliente solo ve `/api/cryptocompare/...`.
 */
export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const requestUrl = new URL(req.url ?? '/', 'http://localhost');
  const route = parseProxyRoute(requestUrl.pathname);

  if (!route) {
    res.statusCode = 404;
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ message: 'Ruta de proxy no valida.' }));
    return;
  }

  const config = resolveProxyConfig(process.env);

  if (!config.apiKey) {
    res.statusCode = 500;
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ message: missingApiKeyMessage() }));
    return;
  }

  const upstreamUrl = buildUpstreamUrl(config, route, requestUrl.searchParams);

  if (!upstreamUrl) {
    res.statusCode = 404;
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ message: 'Ruta de proxy no valida.' }));
    return;
  }

  try {
    const upstream = await fetch(upstreamUrl, {
      signal: AbortSignal.timeout(15_000),
      headers: { accept: 'application/json' },
    });

    res.statusCode = upstream.status;
    res.setHeader(
      'content-type',
      upstream.headers.get('content-type') ?? 'application/json; charset=utf-8',
    );
    res.setHeader('cache-control', 'public, max-age=60');
    res.end(Buffer.from(await upstream.arrayBuffer()));
  } catch (error) {
    console.error('[cryptocompare-proxy] Error consultando CryptoCompare:', error);
    res.statusCode = 502;
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ message: 'No se pudo consultar CryptoCompare.' }));
  }
}
