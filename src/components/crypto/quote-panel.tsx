import type { ReactNode } from 'react';
import { useState } from 'react';
import { ErrorState } from '@/components/feedback/error-state';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuote } from '@/hooks/useQuote';
import { CURRENCIES, currencySchema, type Currency } from '@/types/crypto.types';
import { getErrorMessage } from '@/utils/errors';
import { formatCurrency, formatDateTime } from '@/utils/format';
import { PriceChange } from './price-change';

interface QuotePanelProps {
  symbol: string;
}

function QuoteRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-1.5 last:border-0 last:pb-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium tabular-nums">{children}</dd>
    </div>
  );
}

export function QuotePanel({ symbol }: QuotePanelProps) {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [isOpen, setIsOpen] = useState(false);
  const { data, isFetching, isError, error, refetch } = useQuote({
    symbol,
    currency,
    enabled: isOpen,
  });

  const handleCurrencyChange = (value: string) => {
    const parsed = currencySchema.safeParse(value);
    if (parsed.success) setCurrency(parsed.data);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Select value={currency} onValueChange={handleCurrencyChange}>
          <SelectTrigger className="w-full sm:w-56" aria-label="Moneda de cotizacion">
            <SelectValue placeholder="Elige una moneda" />
          </SelectTrigger>
          <SelectContent>
            {CURRENCIES.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant={isOpen ? 'outline' : 'default'}
          onClick={() => setIsOpen((previous) => !previous)}
          aria-expanded={isOpen}
        >
          {isOpen ? 'Ocultar cotizacion' : 'Cotizar'}
        </Button>
      </div>

      {isOpen ? (
        isFetching && !data ? (
          <div className="flex flex-col gap-2" aria-hidden="true">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        ) : isError ? (
          <ErrorState
            title="No pudimos obtener la cotizacion"
            message={getErrorMessage(error)}
            onRetry={() => {
              void refetch();
            }}
          />
        ) : data ? (
          <dl className="flex flex-col gap-2 text-sm">
            <QuoteRow label="Conversion">{`${data.symbol} → ${data.currency}`}</QuoteRow>
            <QuoteRow label="Precio">
              {data.displayPrice ?? formatCurrency(data.price, data.currency)}
            </QuoteRow>
            <QuoteRow label="Variacion 24h">
              <PriceChange value={data.changePct24h} />
            </QuoteRow>
            <QuoteRow label="Volumen 24h">
              <PriceChange value={data.change24h} kind="absolute" currency={data.currency} />
            </QuoteRow>
            <QuoteRow label="Maximo 24h">{formatCurrency(data.high24h, data.currency)}</QuoteRow>
            <QuoteRow label="Minimo 24h">{formatCurrency(data.low24h, data.currency)}</QuoteRow>
            <QuoteRow label="Actualizado">{formatDateTime(data.lastUpdate)}</QuoteRow>
          </dl>
        ) : null
      ) : null}
    </div>
  );
}
