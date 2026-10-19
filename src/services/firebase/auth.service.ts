import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import type { AuthUser } from '@/types/auth.types';
import { auth } from './config';

export function toAuthUser(user: User | null): AuthUser | null {
  if (!user) return null;

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
}

export function subscribeToAuthChanges(callback: (user: AuthUser | null) => void): () => void {
  return onAuthStateChanged(auth, (user) => callback(toAuthUser(user)));
}

export async function signUpWithEmail(email: string, password: string): Promise<void> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (userCredential.user) await sendEmailVerification(userCredential.user);
}

export async function signInWithEmail(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(auth, email, password);
}

export async function signOutCurrentUser(): Promise<void> {
  await signOut(auth);
}

export async function signInWithGoogle(): Promise<void> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  await signInWithPopup(auth, provider);
}

export async function sendPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

/** Devuelve el ID token actual (lo refresca si expiro) para los endpoints protegidos. */
export async function getIdToken(): Promise<string | null> {
  return auth.currentUser ? auth.currentUser.getIdToken() : null;
}
