// utils/auth.ts
import { auth, db } from '@/app/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export async function finalizeSessionAndRedirect(router: AppRouterInstance) {
  const user = auth.currentUser;
  if (!user) return;

  // 1) Read role from Firestore
  const snap = await getDoc(doc(db, 'users', user.uid));
  const userRole = (snap.exists() && (snap.data() as any).role) || 'student';

  // 2) Exchange ID token for HttpOnly cookies (for middleware)
  const idToken = await user.getIdToken();
  await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken, role: userRole }),
  });

  // 3) Client redirect by role
  if (userRole === 'admin') router.replace('/admin');
  else if (userRole === 'landlord') router.replace('/landlord');
  else router.replace('/dashboard'); // student default
}
