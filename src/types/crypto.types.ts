import { z } from 'zod';

export const currencySchema = z.enum(['USD', 'ARS', 'EUR', 'MXN', 'GBP', 'JPY']);

export type Currency = z.infer<typeof currencySchema>;

export const CURRENCIES: ReadonlyArray<{ value: Currency; label: string }> = [
  { value: 'USD', label: 'Dolar estadounidense' },
  { value: 'ARS', label: 'Peso argentino' },
  { value: 'EUR', label: 'Euro' },
  { value: 'MXN', label: 'Peso mexicano' },
  { value: 'GBP', label: 'Libra esterlina' },
  { value: 'JPY', label: 'Yen japones' },
];

export const coinMarketSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  image: z.string(),
  current_price: z.number(),
  market_cap: z.number().nullable().optional(),
  market_cap_rank: z.number().nullable(),
  high_24h: z.number().nullable(),
  low_24h: z.number().nullable(),
  price_change_24h: z.number().nullable(),
  price_change_percentage_24h: z.number().nullable(),
  last_updated: z.string(),
});

export type CoinMarket = z.infer<typeof coinMarketSchema>;

export const coinMarketListSchema = z.array(coinMarketSchema);

export const portfolioCoinSchema = z.object({
  id: z.string(),
  rank: z.number().nullable(),
  name: z.string(),
  symbol: z.string(),
  image: z.string(),
});

export type PortfolioCoin = z.infer<typeof portfolioCoinSchema>;

export function toPortfolioCoin(coin: CoinMarket): PortfolioCoin {
  return {
    id: coin.id,
    rank: coin.market_cap_rank,
    name: coin.name,
    symbol: coin.symbol,
    image: coin.image,
  };
}
