import { z } from 'zod';

const envSchema = z.object({
  VITE_FIREBASE_API_KEY: z.string().min(1),
  VITE_FIREBASE_AUTH_DOMAIN: z.string().min(1),
  VITE_FIREBASE_PROJECT_ID: z.string().min(1),
  VITE_FIREBASE_STORAGE_BUCKET: z.string().min(1),
  VITE_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1),
  VITE_FIREBASE_APP_ID: z.string().min(1),
  VITE_COINGECKO_API_URL: z.string().min(1).default('/api/coingecko'),

  /**
   * Endpoint del proxy server-side que inyecta la API key de CryptoCompare.
   * En produccion puede apuntar a una funcion serverless desplegada.
   */
  VITE_CRYPTOCOMPARE_API_URL: z.string().min(1).default('/api/cryptocompare'),
  VITE_AI_API_URL: z.string().min(1).default('/api/ai'),
});

export type Env = z.infer<typeof envSchema>;

export type EnvCheckResult = { ok: true; env: Env } | { ok: false; message: string };

/**
 * Se leen las claves una por una (no `import.meta.env` completo) para que Vite
 * solo incruste en el bundle las variables realmente usadas. Asi una variable
 * secreta con prefijo VITE_ no termina en el build de produccion.
 */
function readRawEnv() {
  return {
    VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
    VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
    VITE_COINGECKO_API_URL: import.meta.env.VITE_COINGECKO_API_URL,
    VITE_CRYPTOCOMPARE_API_URL: import.meta.env.VITE_CRYPTOCOMPARE_API_URL,
    VITE_AI_API_URL: import.meta.env.VITE_AI_API_URL,
  };
}

export function checkEnv(): EnvCheckResult {
  const parsed = envSchema.safeParse(readRawEnv());

  if (parsed.success) return { ok: true, env: parsed.data };

  const details = parsed.error.issues
    .map((issue) => {
      const key = issue.path.join('.') || 'entorno';
      const expected = issue.code === 'invalid_type' ? 'no esta definida' : issue.message;
      return `${key} (${expected})`;
    })
    .join(', ');

  return {
    ok: false,
    message: `Faltan o son invalidas estas variables: ${details}. Revisa .env.local y reinicia el dev server.`,
  };
}

let cachedEnv: Env | null = null;

export function getEnv(): Env {
  if (cachedEnv) return cachedEnv;

  const result = checkEnv();

  if (!result.ok) {
    throw new Error(`Configuracion de entorno invalida. ${result.message}`);
  }

  cachedEnv = result.env;
  return cachedEnv;
}
