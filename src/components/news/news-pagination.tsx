import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NewsPaginationProps {
  pageNumber: number;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isLoading?: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export function NewsPagination({
  pageNumber,
  canGoPrevious,
  canGoNext,
  isLoading = false,
  onPrevious,
  onNext,
}: NewsPaginationProps) {
  return (
    <nav
      aria-label="Paginacion de noticias"
      className="flex flex-wrap items-center justify-center gap-3 pt-2"
    >
      <Button
        variant="outline"
        size="sm"
        onClick={onPrevious}
        disabled={!canGoPrevious || isLoading}
      >
        <ChevronLeft aria-hidden="true" />
        Anteriores
      </Button>

      <span aria-live="polite" className="min-w-24 text-center text-sm text-muted-foreground">
        Pagina {pageNumber}
      </span>

      <Button variant="outline" size="sm" onClick={onNext} disabled={!canGoNext || isLoading}>
        Siguientes
        <ChevronRight aria-hidden="true" />
      </Button>
    </nav>
  );
}
