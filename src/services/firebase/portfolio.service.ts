import { doc, getDoc, setDoc } from 'firebase/firestore';
import { z } from 'zod';
import { portfolioCoinSchema, type PortfolioCoin } from '@/types/crypto.types';
import { db } from './config';

const portfolioDocumentSchema = z.object({
  cryptos: z.array(portfolioCoinSchema),
});

/**
 * El identificador del documento es el email del usuario para mantener
 * compatibilidad con los datos historicos de Firestore.
 */
function userDocumentRef(userId: string) {
  return doc(db, 'usuarios', userId);
}

export async function getPortfolio(userId: string): Promise<PortfolioCoin[]> {
  const snapshot = await getDoc(userDocumentRef(userId));

  if (!snapshot.exists()) {
    await setDoc(userDocumentRef(userId), { cryptos: [] });
    return [];
  }

  const parsed = portfolioDocumentSchema.safeParse(snapshot.data());
  return parsed.success ? parsed.data.cryptos : [];
}

export async function savePortfolio(userId: string, coins: PortfolioCoin[]): Promise<void> {
  await setDoc(userDocumentRef(userId), { cryptos: coins }, { merge: true });
}
