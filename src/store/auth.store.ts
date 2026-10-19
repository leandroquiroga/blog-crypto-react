import { create } from 'zustand';
import * as authService from '@/services/firebase/auth.service';
import type { AuthStatus, AuthUser } from '@/types/auth.types';

interface AuthStore {
  user: AuthUser | null;
  status: AuthStatus;
  setUser: (user: AuthUser | null) => void;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  status: 'initializing',
  setUser: (user) => set({ user, status: user ? 'authenticated' : 'unauthenticated' }),
  loginWithEmail: authService.signInWithEmail,
  registerWithEmail: authService.signUpWithEmail,
  loginWithGoogle: authService.signInWithGoogle,
  logout: authService.signOutCurrentUser,
  requestPasswordReset: authService.sendPasswordReset,
}));
