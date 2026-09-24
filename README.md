# Blog Crypto

SPA de noticias, cotizaciones y portfolio personal de criptomonedas. Consume CoinGecko y CryptoCompare, y persiste el portfolio por usuario en Firestore.

## Stack

| Capa | Tecnología |
| --- | --- |
| Build | Vite 8 + TypeScript 6 (strict) |
| UI | React 19 + Tailwind CSS 4 + shadcn/ui (Radix) + lucide-react |
| Routing | React Router 8 (lazy + Suspense) |
| Estado cliente | Zustand 5 (auth y portfolio) |
| Estado servidor | TanStack Query 5 (cache, retry, cancelación) |
| Formularios | React Hook Form + Zod |
| Backend | Firebase 12 (Auth + Firestore) |
| Feedback | Sonner (toasts) |
| Tests | Vitest 5 + Testing Library + jsdom |
| Calidad | ESLint 10 (flat) + Prettier + GitHub Actions |

## Requisitos

- Node 24 LTS (`.nvmrc`) o superior
- npm 11+

## Configuración

1. Copia `.env.example` a `.env.local` y completa las credenciales de tu app web de Firebase
   (Firebase Console → Project settings → Your apps):

```bash
cp .env.example .env.local
```

2. Instala dependencias y levanta el entorno:

```bash
npm install
npm run dev
```

> Las claves de Firebase son públicas por diseño del SDK web. La seguridad real se define en las
> reglas de Firestore.

### Prefijos de las variables (importante)

Vite solo expone al navegador las variables que empiezan con `VITE_`. Por eso:

| Variable | Prefijo | Motivo |
| --- | --- | --- |
| `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID` | **`VITE_` obligatorio** | El SDK de Firebase corre en el navegador; sin el prefijo la app no arranca |
| `VITE_CRYPTOCOMPARE_API_URL` | **`VITE_`** | El cliente llama al proxy en esa URL |
| `VITE_COINGECKO_BASE_URL` | **`VITE_`** (opcional) | El cliente consulta CoinGecko directo |
| `API_KEY_CRYPTO_COMPARE`, `BASE_URL_CRYPTO_COMPARE`, `PATH_URL_NEWS_CRYPTO_COMPARE` | **sin prefijo** (recomendado) | Solo las lee el proxy en el servidor; con `VITE_` el navegador puede verlas |

Si falta alguna variable `VITE_FIREBASE_*`, la app ya no queda en blanco: muestra una pantalla con
las variables faltantes y dónde definirlas.

### Firestore: reglas de seguridad

El portfolio se guarda en `usuarios/{email}`. Si la app muestra *"No tenes permisos para acceder
a la base de datos"* (`permission-denied`), las reglas estan bloqueando las operaciones (las
reglas del **modo de prueba expiran a los 30 dias**, la causa mas comun en proyectos antiguos).

En Firebase Console → Firestore Database → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /usuarios/{userId} {
      allow read, write: if request.auth != null && request.auth.token.email == userId;
    }
  }
}
```

> Si preferis usar el `uid` como id de documento, cambiá `userDocumentRef` en
> `src/services/firebase/portfolio.service.ts` para recibir `user.uid` y usá
> `request.auth.uid == userId` en las reglas. Los documentos viejos (por email) no se migran solos.

Todos los errores de Firestore se loguean en consola con su scope (`[portfolio/load]`,
`[portfolio/add]`, `[portfolio/remove]`) y la UI muestra el motivo real en lugar de un mensaje
generico.

### Variables de CryptoCompare (solo servidor)

La API key **nunca** viaja al navegador. El cliente llama a `/api/cryptocompare/news` y
`/api/cryptocompare/quote`; el servidor agrega `api_key` y resuelve la URL real:

```
BASE_URL_CRYPTO_COMPARE=https://min-api.cryptocompare.com
PATH_URL_NEWS_CRYPTO_COMPARE=/data/v2/news/
API_KEY_CRYPTO_COMPARE=tu_api_key
```

**Nombres aceptados**: el proxy busca primero el nombre sin prefijo (recomendado) y, si no
existe, acepta la variante con `VITE_` (`VITE_API_KEY_CRYPTO_COMPARE`, etc.) e incluso renombres
que terminen con el mismo sufijo. Si la key se lee de una variable `VITE_`, el dev server imprime
una advertencia: en desarrollo el navegador puede leer las variables `VITE_`.

- Al arrancar, el dev server loguea qué variables detectó (solo **nombres**, nunca valores) y
  cuáles faltan. Si falta la key, el proxy responde `500` con un mensaje accionable en vez de
  consultar CryptoCompare sin autenticación.
- **Desarrollo y `vite preview`**: el plugin `server/cryptocompare-proxy-plugin.ts` levanta el
  proxy en el dev server. **Cambiar `vite.config.ts` requiere reiniciar el dev server.**
- **Cache del proxy**: cada combinación de ruta + parámetros se guarda en memoria 60 s
  (`x-proxy-cache: HIT/MISS`), lo que evita agotar el rate limit de CryptoCompare al paginar.
- **Timeouts**: el upstream corta a los 12 s (responde `504` en JSON) y el cliente espera hasta
  20 s para las noticias; nunca se muestra un error de red genérico cuando en realidad hubo timeout.
- **Seguridad**: el cliente lee las variables `VITE_` una por una (`src/lib/env.ts`), así que una
  key que quede con prefijo `VITE_` no se incrusta en el bundle de producción. Aun así, se
  recomienda mantenerla sin prefijo.
- **Producción**:
  - **Vercel**: `api/cryptocompare/[...path].ts` ya está listo (rutas `/api/cryptocompare/news` y
    `/api/cryptocompare/quote`). Configurá las 3 variables en el panel del proyecto.
  - **Firebase Functions**: envolvés el handler en `onRequest`:
    ```ts
    import { onRequest } from 'firebase-functions/v2/https';
    import handler from './cryptocompare/[...path]';
    export const cryptocompare = onRequest(handler);
    ```
    y luego `VITE_CRYPTOCOMPARE_API_URL=https://<region>-<proyecto>.cloudfunctions.net/cryptocompare`.
  - **Netlify**: función en `netlify/functions/cryptocompare.ts` + redirect
    `/api/cryptocompare/*` → `/.netlify/functions/cryptocompare/:splat`.

> Si la key ya estuvo expuesta, **rotala** en el panel de CryptoCompare.

## Noticias: cache y paginacion

`useNewsPagination` (`src/hooks/queries/useNewsQuery.ts`) maneja la lista paginada por cursor
(`lTs`) y define la política de datos:

| Parámetro | Valor | Descripción |
| --- | --- | --- |
| `staleTime` | 5 min | La data se considera fresca y no se refetchea |
| `gcTime` | 30 min | Cada página vive en cache sin suscriptores |
| `refetchInterval` | 10 min | Refresco automático de la página visible |
| `refetchOnWindowFocus` | `true` | Refresca al volver a la pestaña |

- **Paginación, no scroll infinito**: botones *Anteriores* / *Siguientes* y contador de página.
- El cursor de la página siguiente es el `published_on` de la noticia más antigua (CryptoCompare
  es exclusivo con `lTs`, verificado contra la API).
- Cada página se cachea con su propio `queryKey`, así que volver atrás es instantáneo.
- Las imágenes genéricas de CryptoCompare (`/news/default/...`) no se muestran: esas cards quedan
  sin imagen.

## Scripts

| Script | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo en `http://localhost:5173` |
| `npm run build` | Typecheck + build de producción en `dist/` |
| `npm run preview` | Sirve el build de producción |
| `npm run lint` | ESLint sobre todo el proyecto |
| `npm run typecheck` | TypeScript en modo proyecto (`tsc -b`) |
| `npm run test` | Vitest en modo CI |
| `npm run test:watch` | Vitest en modo watch |
| `npm run format` | Prettier |

## Arquitectura

```
src/
├── components/
│   ├── ui/           # shadcn/ui (button, input, dialog, select, sheet, ...)
│   ├── layout/       # AppShell, Navbar, AuthLayout, UserMenu, Logo
│   ├── news/         # NewsGrid, NewsCard, NewsSkeleton
│   ├── crypto/       # CryptoGrid, CryptoCard, PriceChange, QuotePanel
│   ├── portfolio/    # PortfolioCard
│   ├── feedback/     # ErrorBoundary, ErrorState, EmptyState, PageLoader
│   └── theme/        # ThemeProvider + ModeToggle (light/dark/system)
├── pages/            # Home, Dashboard, Portfolio, Login, Register, Reset, 404
├── router/           # AppRouter, ProtectedRoute, PublicRoute, paths
├── store/            # Zustand: auth.store, portfolio.store
├── hooks/            # useAuth, usePortfolio, useQuote, useTheme, queries/
├── services/         # firebase/, http/ (cliente con AbortController), APIs
├── types/            # contratos + schemas Zod
├── utils/            # format, errors (map de Firebase), parse
├── lib/              # env (Zod), query-client, cn
└── styles/           # Tailwind 4 + tokens de tema en oklch

server/               # Proxy CryptoCompare (dev/preview) - API key solo servidor
api/                  # Handler serverless para produccion (Vercel)
```

Principios aplicados:

- **SRP**: los componentes renderizan; la lógica vive en hooks y servicios.
- **DIP**: los componentes dependen de hooks/stores, no de Firebase directamente.
- **Server state vs client state**: TanStack Query para APIs; Zustand para auth y portfolio.
- **Type-safety**: sin `any`, respuestas de API validadas con Zod en runtime.

## Tema y diseño

- Tokens semánticos en `src/styles/index.css` (`oklch`) con variantes light y dark.
- Paleta: violeta profundo (marca) + lima eléctrico (acento) + verde/rojo semánticos para el mercado.
- Selector Claro / Oscuro / Sistema con persistencia en `localStorage` y sin flash inicial (script en `index.html`).

## Tests y CI

```bash
npm run test
```

El workflow `.github/workflows/ci.yml` corre lint, typecheck, tests y build en cada push/PR.

## Decisiones de la migración

- CRA (`react-scripts`) reemplazado por Vite 8; React 17 → 19.3 (`createRoot`).
- Context API reemplazada por Zustand; se eliminó el loop infinito de lecturas a Firestore.
- Se agregó un estado `initializing` de auth para evitar redirecciones falsas y romper deep-links.
- Todos los fetch usan `AbortController`, timeouts y validación Zod.
- Se eliminó `react-google-recaptcha` v2: Firebase no lo requiere para reset de contraseña. Para
  proteger Auth/Firestore se recomienda **Firebase App Check** con reCAPTCHA v3.
- El documento de Firestore se sigue identificando por email para mantener compatibilidad con los
  datos existentes.

## Próximos pasos sugeridos

- Firebase App Check con reCAPTCHA v3.
- Gráficos de tendencia (Recharts + shadcn charts) usando `sparkline=true` de CoinGecko.
- Búsqueda y filtros en el dashboard; paginación de noticias.
- Chat de noticias con streaming (Vercel AI SDK + `react-markdown` + `rehype-sanitize`).
