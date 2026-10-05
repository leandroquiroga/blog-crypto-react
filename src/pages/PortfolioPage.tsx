import { Link } from 'react-router';
import { CryptoGridSkeleton } from '@/components/crypto/crypto-skeleton';
import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { PortfolioCard } from '@/components/portfolio/portfolio-card';
import { Button } from '@/components/ui/button';
import { usePortfolio } from '@/hooks/usePortfolio';
import { paths } from '@/router/paths';

export default function PortfolioPage() {
  const { coins, status, error, removeCoin, reload } = usePortfolio();

  const isLoading = status === 'idle' || status === 'loading';

  return (
    <div className="flex flex-col gap-8">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-bold">Mi portfolio</h1>
        <p className="text-muted-foreground">
          Gestiona tus criptomonedas, cotizalas en distintas monedas y obtene su analisis tecnico y
          fundamental con IA.
        </p>
      </header>

      {isLoading ? <CryptoGridSkeleton count={4} /> : null}

      {status === 'error' ? (
        <ErrorState
          message={error ?? 'No se pudo cargar tu portfolio.'}
          onRetry={() => {
            void reload();
          }}
        />
      ) : null}

      {status === 'ready' && coins.length === 0 ? (
        <EmptyState
          title="Todavia no tenes criptomonedas"
          description="Agrega monedas desde el mercado para verlas aca y cotizarlas."
          action={
            <Button asChild>
              <Link to={paths.dashboard}>Ir al mercado</Link>
            </Button>
          }
        />
      ) : null}

      {status === 'ready' && coins.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {coins.map((coin) => (
            <PortfolioCard key={coin.id} coin={coin} onRemove={removeCoin} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
