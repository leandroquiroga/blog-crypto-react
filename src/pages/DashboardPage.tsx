import { useMemo } from 'react';
import { CoinSearch } from '@/components/crypto/coin-search';
import { CryptoGrid } from '@/components/crypto/crypto-grid';
import { CryptoGridSkeleton } from '@/components/crypto/crypto-skeleton';
import { ErrorState } from '@/components/feedback/error-state';
import { useMarketsQuery } from '@/hooks/queries/useMarketsQuery';
import { usePortfolio } from '@/hooks/usePortfolio';
import { getErrorMessage } from '@/utils/errors';

export default function DashboardPage() {
  const markets = useMarketsQuery();
  const { addCoin, coins } = usePortfolio();
  const portfolioIds = useMemo(() => new Set(coins.map((coin) => coin.id)), [coins]);

  return (
    <div className="flex flex-col gap-8">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-bold">Mercado</h1>
        <p className="text-muted-foreground">
          Las 25 criptomonedas mas importantes por capitalizacion de mercado. Agregalas a tu
          portfolio para analizarlas con IA.
        </p>
      </header>

      <CoinSearch portfolioIds={portfolioIds} onAdd={addCoin} />

      {markets.isPending ? <CryptoGridSkeleton /> : null}

      {markets.isError ? (
        <ErrorState
          message={getErrorMessage(markets.error)}
          onRetry={() => {
            void markets.refetch();
          }}
        />
      ) : null}

      {markets.data ? (
        <CryptoGrid coins={markets.data} portfolioIds={portfolioIds} onAdd={addCoin} />
      ) : null}
    </div>
  );
}
