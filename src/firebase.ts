

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAIkF_FmbeF0Pbh8bNLPd4Gm5NpyD5_o90",
  authDomain: "lodgelink-27a47.firebaseapp.com",
  projectId: "lodgelink-27a47",
  storageBucket: "lodgelink-27a47.appspot.com",
  messagingSenderId: "460288627924",
  appId: "1:460288627924:web:b1a51cde0c0a2f7a98d741",
  measurementId: "G-37SSBT4LQL",
};

// ✅ Prevent multiple initializations in Next.js
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ✅ Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
