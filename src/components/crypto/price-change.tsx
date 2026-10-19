import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency, formatPercent } from '@/utils/format';

interface PriceChangeProps {
  value: number | null | undefined;
  kind?: 'percent' | 'absolute';
  currency?: string;
  className?: string;
}

export function PriceChange({
  value,
  kind = 'percent',
  currency = 'USD',
  className,
}: PriceChangeProps) {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return <span className="text-muted-foreground">—</span>;
  }

  const isPositive = value > 0;
  const isNegative = value < 0;
  const formatted =
    kind === 'percent' ? formatPercent(value) : formatCurrency(value, currency, 'en-US');

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium tabular-nums',
        isPositive && 'text-success',
        isNegative && 'text-destructive',
        className,
      )}
    >
      {isPositive ? <TrendingUp className="size-3.5" aria-hidden="true" /> : null}
      {isNegative ? <TrendingDown className="size-3.5" aria-hidden="true" /> : null}
      {formatted}
      <span className="sr-only">{isPositive ? 'sube' : isNegative ? 'baja' : 'sin cambios'}</span>
    </span>
  );
}
