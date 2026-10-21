import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ConfigErrorScreenProps {
  message: string;
}

export function ConfigErrorScreen({ message }: ConfigErrorScreenProps) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-2xl" role="alert">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="size-5" aria-hidden="true" />
            Falta configuracion del entorno
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 text-sm">
          <div className="space-y-1">
            <p className="font-medium">
              El navegador necesita estas variables con prefijo <code>VITE_</code>:
            </p>
            <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
              {[
                'VITE_FIREBASE_API_KEY',
                'VITE_FIREBASE_AUTH_DOMAIN',
                'VITE_FIREBASE_PROJECT_ID',
                'VITE_FIREBASE_STORAGE_BUCKET',
                'VITE_FIREBASE_MESSAGING_SENDER_ID',
                'VITE_FIREBASE_APP_ID',
                'VITE_CRYPTOCOMPARE_API_URL=/api/cryptocompare',
              ].join('\n')}
            </pre>
          </div>

          <div className="space-y-1">
            <p className="font-medium">
              El proxy las lee del servidor; se recomienda que NO lleven <code>VITE_</code>:
            </p>
            <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
              {[
                'BASE_URL_CRYPTO_COMPARE=https://min-api.cryptocompare.com',
                'PATH_URL_NEWS_CRYPTO_COMPARE=/data/v2/news/',
                'API_KEY_CRYPTO_COMPARE=tu_api_key',
              ].join('\n')}
            </pre>
          </div>

          <p className="text-muted-foreground">
            Despues de editarlas, reinicia <code>npm run dev</code>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
