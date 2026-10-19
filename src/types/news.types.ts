import { z } from 'zod';

const identifierSchema = z.union([z.string(), z.number()]).transform(String);

export const newsArticleSchema = z.object({
  id: identifierSchema,
  title: z.string(),
  body: z.string(),
  url: z.string(),
  imageurl: z.string(),
  source: z.string(),
  source_info: z.object({
    name: z.string(),
    img: z.string().optional(),
  }),
  categories: z.string(),
  tags: z.string().optional(),
  published_on: z.number(),
});

export type NewsArticle = z.infer<typeof newsArticleSchema>;

export const newsResponseSchema = z.object({
  Type: z.number().optional(),
  Response: z.string().optional(),
  Message: z.string().optional(),
  Promoted: z.array(z.unknown()).optional(),
  Data: z.array(newsArticleSchema).optional(),
});

export type NewsResponse = z.infer<typeof newsResponseSchema>;
