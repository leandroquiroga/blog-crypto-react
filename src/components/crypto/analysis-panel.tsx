import { Loader2, Sparkles } from 'lucide-react';
import { Markdown } from '@/components/ai/markdown';
import { ErrorState } from '@/components/feedback/error-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAiAnalysis, type AiAnalysisKind } from '@/hooks/useAiAnalysis';

interface AnalysisPanelProps {
  kind: AiAnalysisKind;
  coinId: string;
  symbol: string;
  ctaLabel: string;
}

export function AnalysisPanel({ kind, coinId, symbol, ctaLabel }: AnalysisPanelProps) {
  const { text, status, error, fromCache, start, cancel } = useAiAnalysis({ kind, coinId, symbol });
  const isStreaming = status === 'streaming';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          onClick={() => {
            void start();
          }}
          disabled={isStreaming}
        >
          {isStreaming ? <Loader2 className="animate-spin" /> : <Sparkles />}
          {isStreaming ? 'Analizando...' : text ? `Regenerar ${ctaLabel}` : `Generar ${ctaLabel}`}
        </Button>

        {isStreaming ? (
          <Button variant="outline" onClick={cancel}>
            Cancelar
          </Button>
        ) : null}

        {fromCache && text && !isStreaming ? (
          <Badge variant="secondary">Analisis guardado</Badge>
        ) : null}
      </div>

      {error ? (
        <ErrorState
          message={error}
          onRetry={() => {
            void start();
          }}
        />
      ) : null}

      {text ? (
        <div aria-live="polite" className="rounded-lg border border-border/70 bg-card p-4">
          <Markdown content={text} />
        </div>
      ) : null}

      {text && !isStreaming ? (
        <p className="text-xs text-muted-foreground">
          Generado por IA. Puede contener errores. No es asesoramiento financiero.
        </p>
      ) : null}
    </div>
  );
}
