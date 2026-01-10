// pages/pricing.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Link from "next/link";

type SubState = {
  active: boolean;
  status: string | null;
  currentPeriodEnd: string | null;
};

export default function PricingPage() {
  const [session, setSession] = useState<any>(null);
  const [subscription, setSubscription] = useState<SubState>({
    active: false,
    status: null,
    currentPeriodEnd: null,
  });
  const [loading, setLoading] = useState(false);

  async function loadMe() {
    const { data } = await supabase.auth.getSession();
    setSession(data.session ?? null);

    // pull current subscription from your API
    const res = await fetch("/api/me");
    const json = await res.json();
    setSubscription(json?.subscription ?? { active: false, status: null, currentPeriodEnd: null });
  }

  useEffect(() => {
    loadMe();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      loadMe();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function startCheckout() {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    if (!token) {
      // send to login, then come back
      window.location.href = "/login?redirectedFrom=%2Fpricing";
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      if (json?.url) window.location.href = json.url;
      else alert(json?.error ?? "Failed to start checkout");
    } finally {
      setLoading(false);
    }
  }

  async function openPortal() {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    if (!token) {
      window.location.href = "/login?redirectedFrom=%2Fpricing";
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      if (json?.url) window.location.href = json.url;
      else alert(json?.error ?? "Failed to open portal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h1 className="text-3xl font-semibold tracking-tight">Pricing</h1>
        <p className="mt-2 text-sm text-white/60">Phase 1 is free. Phases 2–5 require a subscription.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm text-white/60">Free</div>
          <div className="mt-1 text-2xl font-semibold">Phase 1</div>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>• Founder intake</li>
            <li>• Idea generation & scoring</li>
            <li>• Save progress locally</li>
          </ul>
          <div className="mt-6 rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70">
            Included for everyone
          </div>
        </div>

        <div className="rounded-2xl border border-indigo-400/20 bg-indigo-500/10 p-6">
          <div className="text-sm text-indigo-200/80">Pro</div>
          <div className="mt-1 text-2xl font-semibold">Phases 2–5</div>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>• Legal setup & templates</li>
            <li>• Branding + landing page generator</li>
            <li>• Marketing outputs</li>
            <li>• Growth + automation</li>
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            {!session && (
              <Link
                href="/login?redirectedFrom=%2Fpricing"
                className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
              >
                Sign in to subscribe
              </Link>
            )}

            {session && !subscription.active && (
              <button
                onClick={startCheckout}
                disabled={loading}
                className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-60"
              >
                {loading ? "Starting…" : "Subscribe"}
              </button>
            )}

            {session && subscription.active && (
              <>
                <Link
                  href="/phase2"
                  className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400"
                >
                  Go to Phase 2
                </Link>
                <button
                  onClick={openPortal}
                  disabled={loading}
                  className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 disabled:opacity-60"
                >
                  {loading ? "Opening…" : "Manage billing"}
                </button>
                <button
                  onClick={loadMe}
                  className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Refresh status
                </button>
              </>
            )}
          </div>

          <div className="mt-4 text-xs text-white/60">
            Status: <span className="text-white/80">{subscription.status ?? "none"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
