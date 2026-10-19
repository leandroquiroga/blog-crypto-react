import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { fetchNews } from '@/services/cryptocompare.service';

export const newsQueryKey = ['news'] as const;

/** La data se considera fresca durante 5 minutos. */
export const NEWS_STALE_TIME_MS = 5 * 60_000;
/** Cada pagina permanece en cache 30 minutos, incluso sin componentes suscritos. */
export const NEWS_CACHE_TIME_MS = 30 * 60_000;
/** Refresco automatico de la pagina visible cada 10 minutos. */
export const NEWS_REFRESH_INTERVAL_MS = 10 * 60_000;

interface UseNewsPaginationOptions {
  language?: string;
  refreshIntervalMs?: number;
}

/**
 * Paginacion por cursor (lTs) sobre CryptoCompare. Cada pagina se cachea por
 * separado, por lo que volver atras es instantaneo y no se vuelve a pedir.
 */
export function useNewsPagination({
  language = 'ES',
  refreshIntervalMs = NEWS_REFRESH_INTERVAL_MS,
}: UseNewsPaginationOptions = {}) {
  const [cursors, setCursors] = useState<Array<number | undefined>>([undefined]);
  const [pageIndex, setPageIndex] = useState(0);

  const cursor = cursors[pageIndex];

  const query = useQuery({
    queryKey: [...newsQueryKey, language, cursor ?? 'latest'],
    queryFn: ({ signal }) => fetchNews({ language, beforeTimestamp: cursor, signal }),
    staleTime: NEWS_STALE_TIME_MS,
    gcTime: NEWS_CACHE_TIME_MS,
    refetchInterval: refreshIntervalMs,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });

  const goToNextPage = useCallback(() => {
    const articles = query.data;
    const oldestArticle = articles?.[articles.length - 1];

    if (!oldestArticle) return;

    setCursors((previous) => {
      const nextCursors = previous.slice(0, pageIndex + 1);
      nextCursors[pageIndex + 1] = oldestArticle.published_on;
      return nextCursors;
    });
    setPageIndex((index) => index + 1);
  }, [pageIndex, query.data]);

  const goToPreviousPage = useCallback(() => {
    setPageIndex((index) => Math.max(0, index - 1));
  }, []);

  const goToFirstPage = useCallback(() => {
    setPageIndex(0);
  }, []);

  return {
    query,
    pageNumber: pageIndex + 1,
    canGoNext: (query.data?.length ?? 0) > 0,
    canGoPrevious: pageIndex > 0,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
  };
}
