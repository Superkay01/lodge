// components/ui/SignOutButton.tsx
'use client';
import { signOut } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login'); // Redirect to login page after sign-out
    } catch (err) {
      console.error("Sign out error", err);
    }
  };

  return (
    <button onClick={handleSignOut} className="text-sm bg-black text-white py-2 px-4 rounded">Sign Out</button>
  );
}
