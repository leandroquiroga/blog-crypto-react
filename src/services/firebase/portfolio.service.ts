import { doc, getDoc, setDoc } from 'firebase/firestore';
import { z } from 'zod';
import { portfolioCoinSchema, type PortfolioCoin } from '@/types/crypto.types';
import { db } from './config';

const portfolioDocumentSchema = z.object({
  cryptos: z.array(portfolioCoinSchema),
});

/**
 * El documento se identifica por el uid de Firebase Auth (no por email).
 * La autorizacion se delega a las reglas de Firestore: request.auth.uid == uid.
 */
function userDocumentRef(uid: string) {
  return doc(db, 'usuarios', uid);
}

export async function getPortfolio(uid: string): Promise<PortfolioCoin[]> {
  const snapshot = await getDoc(userDocumentRef(uid));

  if (!snapshot.exists()) return [];

  const parsed = portfolioDocumentSchema.safeParse(snapshot.data());
  return parsed.success ? parsed.data.cryptos : [];
}

export async function savePortfolio(uid: string, coins: PortfolioCoin[]): Promise<void> {
  await setDoc(userDocumentRef(uid), { cryptos: coins }, { merge: true });
}
