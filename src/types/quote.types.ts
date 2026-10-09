import { z } from 'zod';
import type { Currency } from './crypto.types';

export const quoteRawSchema = z.object({
  PRICE: z.number().optional(),
  CHANGE24HOUR: z.number().optional(),
  CHANGEPCT24HOUR: z.number().optional(),
  HIGH24HOUR: z.number().optional(),
  LOW24HOUR: z.number().optional(),
  LASTUPDATE: z.number().optional(),
  LASTVOLUME: z.number().optional(),
});

export const quoteDisplaySchema = z.record(z.string(), z.union([z.string(), z.number()]));

export const quoteResponseSchema = z.object({
  Response: z.string().optional(),
  Message: z.string().optional(),
  RAW: z.record(z.string(), z.record(z.string(), quoteRawSchema)).optional(),
  DISPLAY: z.record(z.string(), z.record(z.string(), quoteDisplaySchema)).optional(),
});

export type QuoteRaw = z.infer<typeof quoteRawSchema>;
export type QuoteDisplay = z.infer<typeof quoteDisplaySchema>;
export type QuoteResponse = z.infer<typeof quoteResponseSchema>;

export interface Quote {
  symbol: string;
  currency: Currency;
  price: number;
  change24h: number | null;
  changePct24h: number | null;
  high24h: number | null;
  low24h: number | null;
  lastUpdate: string | null;
  displayPrice: string | null;
}
