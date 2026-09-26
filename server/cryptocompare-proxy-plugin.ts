import { loadEnv, type Connect, type Plugin } from 'vite';
import {
  createCryptoCompareProxyHandler,
  resolveProxyConfig,
  type CryptoCompareProxyConfig,
} from './cryptocompare-proxy.ts';

function registerMiddleware(middlewares: Connect.Server, config: CryptoCompareProxyConfig): void {
  const handler = createCryptoCompareProxyHandler(config);

  middlewares.use((req, res, next) => {
    void handler(req, res, next);
  });
}

function logProxyConfig(config: CryptoCompareProxyConfig, env: Record<string, string>): void {
  const describe = (source: string | null) => source ?? '(valor por defecto)';
  const apiKeySource = config.sources.apiKey ?? 'NO ENCONTRADA';

  console.log(
    `[cryptocompare-proxy] BASE_URL: ${describe(config.sources.baseUrl)} | NEWS_PATH: ${describe(config.sources.newsPath)} | API_KEY: ${apiKeySource}`,
  );

  if (!config.apiKey) {
    const candidates = Object.keys(env).filter((name) => name.toUpperCase().includes('CRYPTO'));
    console.warn(
      `[cryptocompare-proxy] No se encontro API_KEY_CRYPTO_COMPARE. Variables con "CRYPTO" en el nombre: ${
        candidates.length > 0 ? candidates.join(', ') : '(ninguna)'
      }`,
    );
  }

  if (config.keyIsExposed) {
    console.warn(
      '[cryptocompare-proxy] La API key se leyo de una variable con prefijo VITE_. En desarrollo el navegador puede verla; quita el prefijo VITE_ del nombre para mantenerla oculta.',
    );
  }
}

/**
 * Proxy de desarrollo/preview: mantiene la API key fuera del bundle del cliente.
 * En produccion se reemplaza por el handler serverless de `api/cryptocompare`.
 */
export function cryptocompareProxyPlugin(): Plugin {
  let config = resolveProxyConfig({});

  return {
    name: 'cryptocompare-proxy',
    configResolved(resolvedConfig) {
      const rawEnv = loadEnv(resolvedConfig.mode, resolvedConfig.root, '');
      config = resolveProxyConfig(rawEnv);
      logProxyConfig(config, rawEnv);
    },
    configureServer(server) {
      registerMiddleware(server.middlewares, config);
    },
    configurePreviewServer(server) {
      registerMiddleware(server.middlewares, config);
    },
  };
}
