import type { z } from 'zod';
import { ApiError } from '@/services/http/client';

export function parseApiResponse<T>(schema: z.ZodType<T>, data: unknown, context: string): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new ApiError(`Respuesta inesperada del servicio (${context}).`);
  }

  return result.data;
}
