// pages/account.tsx
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

type SubscriptionState = {
  active: boolean;
  status: string | null;
  currentPeriodEnd: string | null;
};

export default function AccountPage() {
  const [session, setSession] = useState<any>(null);
  const [subscription, setSubscription] = useState<SubscriptionState>({
    active: false,
    status: null,
    currentPeriodEnd: null,
  });
  const [loading, setLoading] = useState(false);

  async function refresh() {
    try {
      const res = await fetch("/api/me");
      const json = await res.json();
      setSubscription(json?.subscription ?? { active: false, status: null, currentPeriodEnd: null });
    } catch {
      setSubscription({ active: false, status: null, currentPeriodEnd: null });
    }
  }

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
      if (!mounted) return;
      setSession(sess ?? null);
      refresh();
    });

    refresh();

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function openPortal() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/create-portal-session", { method: "POST" });
      const json = await res.json();
      if (json?.url) window.location.href = json.url;
      else alert(json?.error ?? "Failed to open billing portal");
    } finally {
      setLoading(false);
    }
  }

  const userEmail = session?.user?.email ?? null;

  if (!session) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h1 className="text-3xl font-semibold tracking-tight">Account</h1>
          <p className="mt-2 text-sm text-white/60">You’re not signed in.</p>
        </div>

        <Link
          className="inline-flex rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
          href="/login?redirectedFrom=%2Faccount"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h1 className="text-3xl font-semibold tracking-tight">Account</h1>
        <p className="mt-2 text-sm text-white/60">{userEmail}</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="text-sm text-white/60">Subscription</div>

        <div className="mt-2 text-lg font-semibold">
          {subscription.active ? "Active" : "Inactive"}{" "}
          <span className="text-sm font-normal text-white/60">({subscription.status ?? "none"})</span>
        </div>

        {subscription.currentPeriodEnd && (
          <div className="mt-1 text-sm text-white/60">
            Renews/ends:{" "}
            <span className="text-white/80">{new Date(subscription.currentPeriodEnd).toLocaleString()}</span>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={refresh}
            className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            Refresh
          </button>

          <button
            onClick={openPortal}
            disabled={loading}
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-60"
          >
            {loading ? "Opening…" : "Manage billing"}
          </button>

          <Link
            href={subscription.active ? "/phase2" : "/pricing"}
            className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            {subscription.active ? "Go to Phase 2" : "View pricing"}
          </Link>
        </div>
      </div>
    </div>
  );
}
