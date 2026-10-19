import { useQuery } from '@tanstack/react-query';
import { fetchQuote } from '@/services/cryptocompare.service';
import type { Currency } from '@/types/crypto.types';

interface UseQuoteOptions {
  symbol: string;
  currency: Currency;
  enabled?: boolean;
}

export function useQuote({ symbol, currency, enabled = true }: UseQuoteOptions) {
  return useQuery({
    queryKey: ['quote', symbol, currency],
    queryFn: ({ signal }) => fetchQuote(symbol, currency, signal),
    enabled: enabled && symbol.length > 0,
    staleTime: 30_000,
    retry: 1,
  });
}
