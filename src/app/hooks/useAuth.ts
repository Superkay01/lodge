// hooks/useAuth.ts
import { useState, useEffect } from "react";
import { auth } from "@/app/lib/firebase"; 
import { onAuthStateChanged, User } from "firebase/auth";

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup the listener when the component unmounts
  }, []);

  return { user, loading };
}
