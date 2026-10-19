export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export type AuthStatus = 'initializing' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  user: AuthUser | null;
  status: AuthStatus;
}
