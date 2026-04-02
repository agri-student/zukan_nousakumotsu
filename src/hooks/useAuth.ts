"use client";

import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { isFirebaseConfigured } from "@/lib/firebase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setLoading(false);
      return;
    }

    let unsubscribe: () => void;

    (async () => {
      const { onAuthStateChanged } = await import("firebase/auth");
      const { getAuthInstance } = await import("@/lib/firebase");
      unsubscribe = onAuthStateChanged(getAuthInstance(), (u) => {
        setUser(u);
        setLoading(false);
      });
    })();

    return () => unsubscribe?.();
  }, []);

  return { user, loading };
}

export async function signIn(email: string, password: string) {
  const { signInWithEmailAndPassword } = await import("firebase/auth");
  const { getAuthInstance } = await import("@/lib/firebase");
  return signInWithEmailAndPassword(getAuthInstance(), email, password);
}

export async function signOut() {
  const { signOut: fbSignOut } = await import("firebase/auth");
  const { getAuthInstance } = await import("@/lib/firebase");
  return fbSignOut(getAuthInstance());
}
