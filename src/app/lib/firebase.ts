// app/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  browserLocalPersistence,
  setPersistence,
} from 'firebase/auth';
import {
  getFirestore,
  enableIndexedDbPersistence,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Prefer env vars; fallback to your actual values so the app works even if .env.local isn't loaded yet.
const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    'AIzaSyAIkF_FmbeF0Pbh8bNLPd4Gm5NpyD5_o90',
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    'lodgelink-27a47.firebaseapp.com',
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    'lodgelink-27a47',
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    'lodgelink-27a47.firebasestorage.app',
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    '460288627924',
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    '1:460288627924:web:b1a51cde0c0a2f7a98d741',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Core SDKs
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Persist Firebase Auth session across refresh (browser only; ignore SSR errors)
setPersistence(auth, browserLocalPersistence).catch(() => {});

// Enable Firestore offline cache (browser only)
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((e: any) => {
    // Multi-tab: "failed-precondition"; unsupported: "unimplemented"
    if (e?.code !== 'failed-precondition' && e?.code !== 'unimplemented') {
      console.warn('Firestore persistence error:', e);
    }
  });

  // Optional: Analytics only in browser and when supported
  import('firebase/analytics').then(async ({ getAnalytics, isSupported }) => {
    try {
      if (await isSupported()) getAnalytics(app);
    } catch {
      /* ignore */
    }
  });
}

export { app };
