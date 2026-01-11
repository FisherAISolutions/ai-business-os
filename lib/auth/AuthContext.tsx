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
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionState>(EMPTY_SUB);

  async function refreshSubscription() {
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
    // hard redirect to clear any weird client state
    window.location.href = "/";
  }

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session ?? null);
      setLoading(false);

      // load subscription for the current user
      await refreshSubscription();
    })();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession ?? null);
      await refreshSubscription();
    });

    return () => {
      mounted = false;
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
      refreshSubscription,
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
