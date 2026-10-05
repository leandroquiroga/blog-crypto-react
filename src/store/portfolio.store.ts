import { create } from 'zustand';
import type { PortfolioCoin } from '@/types/crypto.types';

export type PortfolioStatus = 'idle' | 'loading' | 'ready' | 'error';

interface PortfolioStore {
  coins: PortfolioCoin[];
  status: PortfolioStatus;
  error: string | null;
  loadedForUser: string | null;
  setLoading: (userId: string) => void;
  setCoins: (coins: PortfolioCoin[]) => void;
  setError: (message: string) => void;
  addCoin: (coin: PortfolioCoin) => void;
  removeCoin: (id: string) => void;
  reset: () => void;
}

const initialState = {
  coins: [] as PortfolioCoin[],
  status: 'idle' as PortfolioStatus,
  error: null,
  loadedForUser: null,
};

export const usePortfolioStore = create<PortfolioStore>()((set) => ({
  ...initialState,
  setLoading: (userId) => set({ status: 'loading', error: null, loadedForUser: userId }),
  setCoins: (coins) => set({ coins, status: 'ready', error: null }),
  setError: (message) => set({ status: 'error', error: message }),
  addCoin: (coin) =>
    set((state) =>
      state.coins.some((item) => item.id === coin.id) ? state : { coins: [...state.coins, coin] },
    ),
  removeCoin: (id) => set((state) => ({ coins: state.coins.filter((item) => item.id !== id) })),
  reset: () => set({ ...initialState }),
}));
