import { ArrowRight, Bitcoin } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { NewsGrid } from '@/components/news/news-grid';
import { NewsPagination } from '@/components/news/news-pagination';
import { NewsGridSkeleton } from '@/components/news/news-skeleton';
import { Button } from '@/components/ui/button';
import { useNewsPagination } from '@/hooks/queries/useNewsQuery';
import { paths } from '@/router/paths';
import { getErrorMessage } from '@/utils/errors';

export default function HomePage() {
  const {
    query,
    pageNumber,
    canGoNext,
    canGoPrevious,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
  } = useNewsPagination();

  const newsSectionRef = useRef<HTMLElement>(null);
  const previousPageRef = useRef(pageNumber);

  useEffect(() => {
    if (previousPageRef.current === pageNumber) return;

    previousPageRef.current = pageNumber;
    newsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [pageNumber]);

  const { data, isPending, isError, error, refetch, isFetching } = query;

  const showPagination = !isError && (data !== undefined || pageNumber > 1);
  const isEmptyPage = data !== undefined && data.length === 0;

  return (
    <div className="flex flex-col gap-10">
      <section
        aria-labelledby="hero-title"
        className="relative overflow-hidden rounded-2xl border border-border/60 bg-linear-to-br from-primary/15 via-background to-accent/20 px-6 py-12 sm:px-10 sm:py-16"
      >
        <div className="max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Bitcoin className="size-4 text-primary" aria-hidden="true" />
            Cripto en tiempo real
          </span>

          <h1 id="hero-title" className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl">
            Bienvenido al portal de noticias <span className="text-brand-gradient">crypto</span>
          </h1>

          <p className="text-base text-muted-foreground sm:text-lg">
            Segui las noticias, consulta el mercado en tiempo real y obtene el analisis tecnico y
            fundamental de tus criptomonedas con IA.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild size="lg">
              <Link to={paths.dashboard}>
                Ver mercado
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to={paths.portfolio}>Mi portfolio</Link>
            </Button>
          </div>
        </div>
      </section>

      <section ref={newsSectionRef} aria-labelledby="news-title" className="scroll-mt-20 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="news-title" className="font-display text-2xl font-semibold">
              Noticias de ultimo momento
            </h2>
            <p className="text-sm text-muted-foreground">
              Pagina {pageNumber} · actualizadas desde CryptoCompare
            </p>
          </div>
        </div>

        {isPending ? <NewsGridSkeleton /> : null}

        {isError ? (
          <div className="flex flex-col items-center gap-3">
            <ErrorState
              message={getErrorMessage(error)}
              onRetry={() => {
                void refetch();
              }}
            />
            {pageNumber > 1 ? (
              <Button variant="outline" onClick={goToFirstPage}>
                Volver a la primera pagina
              </Button>
            ) : null}
          </div>
        ) : null}

        {data && data.length > 0 ? <NewsGrid articles={data} /> : null}

        {isEmptyPage && pageNumber === 1 ? (
          <EmptyState
            title="No hay noticias disponibles"
            description="Vuelve a intentarlo en unos minutos."
          />
        ) : null}

        {isEmptyPage && pageNumber > 1 ? (
          <EmptyState
            title="No hay mas noticias"
            description="Ya viste todo lo publicado para este idioma."
            action={
              <Button variant="outline" onClick={goToPreviousPage}>
                Volver a la pagina anterior
              </Button>
            }
          />
        ) : null}

        {showPagination ? (
          <NewsPagination
            pageNumber={pageNumber}
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
            isLoading={isFetching}
            onPrevious={goToPreviousPage}
            onNext={goToNextPage}
          />
        ) : null}
      </section>
    </div>
  );
}
