import { ApiError } from '@/services/http/client';
import { coinMarketSchema, type CoinMarket } from '@/types/crypto.types';
import type { GeckoCoinDetail, GeckoSearchCoin } from '@/types/coingecko.types';

export interface CoinSearchResult {
  id: string;
  name: string;
  symbol: string;
  rank: number | null;
  image: string;
}

export function toCoinSearchResult(coin: GeckoSearchCoin): CoinSearchResult {
  return {
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol.toUpperCase(),
    rank: coin.market_cap_rank ?? null,
    image: coin.large ?? coin.thumb,
  };
}

export function toCoinMarket(detail: GeckoCoinDetail): CoinMarket {
  const marketData = detail.market_data;
  const price = marketData?.current_price['usd'];

  if (!marketData || price === null || price === undefined) {
    throw new ApiError(`No hay datos de mercado disponibles para ${detail.name}.`);
  }

  const usd = (values?: Record<string, number | null> | null) => values?.['usd'] ?? null;

  return coinMarketSchema.parse({
    id: detail.id,
    symbol: detail.symbol,
    name: detail.name,
    image: detail.image.large,
    current_price: price,
    market_cap: usd(marketData.market_cap),
    market_cap_rank: detail.market_cap_rank ?? null,
    high_24h: usd(marketData.high_24h),
    low_24h: usd(marketData.low_24h),
    price_change_24h: marketData.price_change_24h ?? null,
    price_change_percentage_24h: marketData.price_change_percentage_24h ?? null,
    last_updated: marketData.last_updated ?? detail.last_updated ?? new Date().toISOString(),
  });
}
