'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/app/lib/firebase';

// Define the expected Firestore user data structure (adjust based on your Firestore schema)
interface FirestoreUserData {
  role?: string;
  // Add other known fields from your 'users' collection, e.g.:
  // name?: string;
  // createdAt?: string;
  [key: string]: unknown; // Allow additional dynamic fields
}

interface User {
  uid: string;
  email: string | null;
  role?: string;
  // Use Record<string, unknown> or FirestoreUserData for additional fields
  [key: string]: FirestoreUserData[keyof FirestoreUserData];
}

interface AuthContextType {
  user: User | null;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, logout: async () => {}, loading: true });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userDocRef);

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            ...(userSnap.exists() ? userSnap.data() : {}),
          });
        } catch (error: unknown) {
          console.error('Error fetching user profile:', error);
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);