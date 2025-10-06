"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/firebase";

export async function logout() {
  try {
    await signOut(auth); // 🔑 Sign out of Firebase
    localStorage.removeItem("userProfile"); // clear stored profile
    window.location.href = "/"; // force redirect to homepage
  } catch (err) {
    console.error("Logout failed:", err);
  }
}
