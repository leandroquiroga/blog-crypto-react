import { getEnv } from '@/lib/env';
import { coinMarketListSchema, type CoinMarket } from '@/types/crypto.types';
import { geckoCoinDetailSchema, geckoSearchResponseSchema } from '@/types/coingecko.types';
import { parseApiResponse } from '@/utils/parse';
import { toCoinMarket, toCoinSearchResult, type CoinSearchResult } from '@/utils/coingecko';
import { httpGet } from './http/client';

function getApiBaseUrl(): string {
  return getEnv().VITE_COINGECKO_API_URL.replace(/\/+$/, '');
}

export async function fetchMarkets(signal?: AbortSignal): Promise<CoinMarket[]> {
  const data = await httpGet<unknown>(`${getApiBaseUrl()}/coins/markets`, { signal });
  return parseApiResponse(coinMarketListSchema, data, 'coingecko/markets');
}

export async function searchCoins(
  query: string,
  signal?: AbortSignal,
): Promise<CoinSearchResult[]> {
  const params = new URLSearchParams({ query });
  const data = await httpGet<unknown>(`${getApiBaseUrl()}/search?${params.toString()}`, { signal });

  return parseApiResponse(geckoSearchResponseSchema, data, 'coingecko/search')
    .coins.map(toCoinSearchResult)
    .slice(0, 8);
}

export async function fetchCoinsById(id: string, signal?: AbortSignal): Promise<CoinMarket> {
  const data = await httpGet<unknown>(`${getApiBaseUrl()}/coins/${encodeURIComponent(id)}`, {
    signal,
  });
  return toCoinMarket(parseApiResponse(geckoCoinDetailSchema, data, 'coingecko/coin'));
}
