import { useQuery } from '@tanstack/react-query';
import { fetchMarkets } from '@/services/coingecko.service';

export const marketsQueryKey = ['markets'] as const;

export function useMarketsQuery() {
  return useQuery({
    queryKey: marketsQueryKey,
    queryFn: ({ signal }) => fetchMarkets(signal),
    staleTime: 60_000,
  });
}
