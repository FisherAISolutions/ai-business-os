// lib/auth/AuthContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../supabaseClient";

type SubscriptionState = {
  active: boolean;
  status: string | null;
  currentPeriodEnd: string | null;
};

type AuthState = {
  session: any | null;
  user: { id: string; email: string | null } | null;
  subscription: SubscriptionState;
  loading: boolean;
  refreshSubscription: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

const EMPTY_SUB: SubscriptionState = {
  active: false,
  status: null,
  currentPeriodEnd: null,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionState>(EMPTY_SUB);
  const [loading, setLoading] = useState(true);

  async function refreshSubscription(nextSession?: any | null) {
    const s = typeof nextSession !== "undefined" ? nextSession : session;

    // If not signed in, subscription must be empty.
    if (!s?.user?.id) {
      setSubscription(EMPTY_SUB);
      return;
    }

    try {
      const res = await fetch("/api/me", { method: "GET" });
      const json = await res.json();
      setSubscription(json?.subscription ?? EMPTY_SUB);
    } catch {
      setSubscription(EMPTY_SUB);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);

      const { data } = await supabase.auth.getSession();
      if (!alive) return;

      const sess = data.session ?? null;
      setSession(sess);

      // IMPORTANT: load subscription BEFORE turning loading off.
      await refreshSubscription(sess);

      if (!alive) return;
      setLoading(false);
    })();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      // During auth changes, temporarily set loading true to prevent redirect flicker
      setLoading(true);

      setSession(newSession ?? null);
      await refreshSubscription(newSession ?? null);

      setLoading(false);
    });

    return () => {
      alive = false;
      listener.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const user = useMemo(() => {
    const u = session?.user;
    if (!u) return null;
    return { id: u.id as string, email: (u.email as string) ?? null };
  }, [session]);

  const value: AuthState = useMemo(
    () => ({
      session,
      user,
      subscription,
      loading,
      refreshSubscription: () => refreshSubscription(),
      signOut,
    }),
    [session, user, subscription, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider />");
  return ctx;
}
