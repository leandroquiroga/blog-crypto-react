import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { getPortfolio, savePortfolio } from '@/services/firebase/portfolio.service';
import { useAuthStore } from '@/store/auth.store';
import { usePortfolioStore } from '@/store/portfolio.store';
import { toPortfolioCoin, type CoinMarket } from '@/types/crypto.types';
import { getErrorMessage, reportError } from '@/utils/errors';

export function usePortfolio() {
  const user = useAuthStore((state) => state.user);
  const coins = usePortfolioStore((state) => state.coins);
  const status = usePortfolioStore((state) => state.status);
  const error = usePortfolioStore((state) => state.error);

  const userId = user?.email ?? user?.uid ?? null;

  const loadPortfolio = useCallback(async (targetUser: string) => {
    const { setLoading, setCoins, setError } = usePortfolioStore.getState();
    setLoading(targetUser);

    try {
      const portfolio = await getPortfolio(targetUser);
      if (usePortfolioStore.getState().loadedForUser === targetUser) {
        setCoins(portfolio);
      }
    } catch (cause) {
      reportError('portfolio/load', cause);
      if (usePortfolioStore.getState().loadedForUser === targetUser) {
        setError(getErrorMessage(cause));
      }
    }
  }, []);

  useEffect(() => {
    if (!userId) {
      usePortfolioStore.getState().reset();
      return;
    }

    const { status: currentStatus, loadedForUser } = usePortfolioStore.getState();
    if (currentStatus === 'ready' && loadedForUser === userId) return;

    void loadPortfolio(userId);
  }, [userId, loadPortfolio]);

  const addCoin = useCallback(
    async (coin: CoinMarket): Promise<boolean> => {
      if (!userId) return false;

      const current = usePortfolioStore.getState().coins;
      if (current.some((item) => item.id === coin.id)) {
        toast.info('Esa criptomoneda ya esta en tu portfolio.');
        return false;
      }

      const portfolioCoin = toPortfolioCoin(coin);
      const next = [...current, portfolioCoin];
      usePortfolioStore.getState().addCoin(portfolioCoin);

      try {
        await savePortfolio(userId, next);
        toast.success(`${coin.name} se agrego a tu portfolio.`);
        return true;
      } catch (cause) {
        reportError('portfolio/add', cause);
        usePortfolioStore.getState().setCoins(current);
        toast.error(getErrorMessage(cause));
        return false;
      }
    },
    [userId],
  );

  const removeCoin = useCallback(
    async (id: string): Promise<void> => {
      if (!userId) return;

      const current = usePortfolioStore.getState().coins;
      const next = current.filter((item) => item.id !== id);
      usePortfolioStore.getState().removeCoin(id);

      try {
        await savePortfolio(userId, next);
        toast.success('Se elimino la criptomoneda de tu portfolio.');
      } catch (cause) {
        reportError('portfolio/remove', cause);
        usePortfolioStore.getState().setCoins(current);
        toast.error(getErrorMessage(cause));
      }
    },
    [userId],
  );

  const reload = useCallback(async (): Promise<void> => {
    if (userId) await loadPortfolio(userId);
  }, [userId, loadPortfolio]);

  return { coins, status, error, addCoin, removeCoin, reload, isReady: status === 'ready' };
}
