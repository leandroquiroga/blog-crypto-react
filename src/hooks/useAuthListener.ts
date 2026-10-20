import { useEffect } from 'react';
import { subscribeToAuthChanges } from '@/services/firebase/auth.service';
import { useAuthStore } from '@/store/auth.store';

export function useAuthListener(): void {
  useEffect(() => {
    const { setUser } = useAuthStore.getState();
    return subscribeToAuthChanges(setUser);
  }, []);
}
