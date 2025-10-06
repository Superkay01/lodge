import { httpsCallable, HttpsCallableResult } from 'firebase/functions';
import { functions } from '@/app/lib/firebase';

interface ElevateToAdminResponse {
  success?: boolean;
  message?: string;
}

export async function elevateToAdmin(superkey: string): Promise<ElevateToAdminResponse> {
  const fn = httpsCallable<unknown, ElevateToAdminResponse>(functions, 'elevateToAdmin');
  const res = await fn({ superkey });
  return res.data;
}