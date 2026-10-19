import { Loader2 } from 'lucide-react';

interface PageLoaderProps {
  label?: string;
}

export function PageLoader({ label = 'Cargando informacion...' }: PageLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[50vh] flex-col items-center justify-center gap-3"
    >
      <Loader2 className="size-8 animate-spin text-primary" aria-hidden="true" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export function FullPageLoader({ label = 'Cargando...' }: PageLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-background"
    >
      <Loader2 className="size-9 animate-spin text-primary" aria-hidden="true" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
