import { QueryClient } from '@tanstack/react-query';
import { ApiError } from '@/services/http/client';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (failureCount >= 1) return false;

        if (error instanceof ApiError) {
          if (error.status === undefined) return true;
          return error.status >= 500 && error.status !== 504;
        }

        return true;
      },
    },
  },
});
