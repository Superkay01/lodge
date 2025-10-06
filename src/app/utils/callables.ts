import { httpsCallable } from 'firebase/functions';
import { functions } from '@/app/lib/firebase';

export async function elevateToAdmin(superkey: string) {
  const fn = httpsCallable(functions, 'elevateToAdmin');
  const res: any = await fn({ superkey });
  return res?.data;
}
