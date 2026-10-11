import { z } from 'zod';

const priceByCurrencySchema = z.record(z.string(), z.number().nullable());

export const geckoSearchCoinSchema = z.object({
  id: z.string(),
  name: z.string(),
  symbol: z.string(),
  market_cap_rank: z.number().nullable().optional(),
  thumb: z.string(),
  large: z.string().optional(),
});

export type GeckoSearchCoin = z.infer<typeof geckoSearchCoinSchema>;

export const geckoSearchResponseSchema = z.object({ coins: z.array(geckoSearchCoinSchema) });

export const geckoCoinDetailSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  image: z.object({ thumb: z.string(), small: z.string(), large: z.string() }),
  market_cap_rank: z.number().nullable().optional(),
  last_updated: z.string().optional(),
  market_data: z
    .object({
      current_price: priceByCurrencySchema,
      market_cap: priceByCurrencySchema.optional(),
      high_24h: priceByCurrencySchema.nullable().optional(),
      low_24h: priceByCurrencySchema.nullable().optional(),
      price_change_24h: z.number().nullable().optional(),
      price_change_percentage_24h: z.number().nullable().optional(),
      last_updated: z.string().optional(),
    })
    .optional(),
});

export type GeckoCoinDetail = z.infer<typeof geckoCoinDetailSchema>;
