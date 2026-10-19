import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ title = 'Algo salio mal', message, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-4 rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-center"
    >
      <AlertTriangle className="size-8 text-destructive" aria-hidden="true" />
      <div className="space-y-1">
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        <p className="max-w-md text-sm text-muted-foreground">{message}</p>
      </div>
      {onRetry ? (
        <Button variant="outline" onClick={onRetry}>
          Reintentar
        </Button>
      ) : null}
    </div>
  );
}
