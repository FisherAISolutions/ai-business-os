// pages/phase5.tsx
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";
import { GrowthDashboard } from "../components/GrowthDashboard";
import { generateContinuousGrowth } from "../lib/growth/ai";
import { setPhaseCompleted } from "../lib/utils/phaseProgress";
import type { BusinessIdea, FounderProfile } from "../types/business";

type SavedSelection = {
  savedAt: string;
  founder: FounderProfile;
  idea: BusinessIdea;
  createdAt: string;
};

type SubscriptionState = {
  active: boolean;
  status: string | null;
  currentPeriodEnd: string | null;
};

const SELECTION_KEY = "ai-business-os:selected-idea";
const BUSINESS_NAME_KEY = "ai-business-os:business-name";

function readSelection(): SavedSelection | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SELECTION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.founder || !parsed?.idea) return null;
    return parsed as SavedSelection;
  } catch {
    return null;
  }
}

function readBusinessNameFallback(selection: SavedSelection | null) {
  if (typeof window === "undefined") return selection?.idea?.name ?? "";
  const saved = window.localStorage.getItem(BUSINESS_NAME_KEY);
  if (saved && saved.trim()) return saved.trim();
  return selection?.idea?.name ?? "";
}

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // ignore
  }
}

export default function Phase5Page() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [subscription, setSubscription] = useState<SubscriptionState>({
    active: false,
    status: null,
    currentPeriodEnd: null,
  });

  const [selection, setSelection] = useState<SavedSelection | null>(null);
  const [growthData, setGrowthData] = useState<any>(null);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const businessName = useMemo(() => readBusinessNameFallback(selection), [selection]);

  // mount + auth
  useEffect(() => {
    setMounted(true);

    supabase.auth.getSession().then(({ data }) => setSession(data.session ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // selection
  useEffect(() => {
    setSelection(readSelection());
  }, []);

  // subscription
  async function refreshMe() {
    try {
      const res = await fetch("/api/me");
      const json = await res.json();
      setSubscription(json?.subscription ?? { active: false, status: null, currentPeriodEnd: null });
    } catch {
      setSubscription({ active: false, status: null, currentPeriodEnd: null });
    }
  }

  useEffect(() => {
    if (!mounted) return;
    refreshMe();
    const t = setTimeout(() => refreshMe(), 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, session?.user?.id]);

  // gate
  useEffect(() => {
    if (!mounted) return;

    if (!session) {
      const redirectedFrom = encodeURIComponent(router.asPath || "/phase5");
      router.replace(`/login?redirectedFrom=${redirectedFrom}`);
      return;
    }

    if (!subscription.active) {
      const from = encodeURIComponent(router.asPath || "/phase5");
      router.replace(`/pricing?from=${from}`);
      return;
    }
  }, [mounted, session, subscription.active, router]);

  async function handleGenerate() {
    if (!selection) return;

    setBusy(true);
    setError(null);
    try {
      const data = await generateContinuousGrowth({
        businessName: businessName || selection.idea.name,
        founderProfile: selection.founder,
        marketingData: {},
      });

      setGrowthData(data);

      setPhaseCompleted("phase1", true);
      setPhaseCompleted("phase5", true);
    } catch (e: any) {
      setError(e?.message || "Growth generation failed.");
    } finally {
      setBusy(false);
    }
  }

  if (!mounted || !session || !subscription.active) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold">Phase 5 — Growth & Automation</h1>
        <p className="text-white/60">Loading…</p>
      </div>
    );
  }

  if (!selection) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold">Phase 5 — Growth & Automation</h1>
        <p className="text-white/70">To continue, select a business idea in Phase 1.</p>
        <div className="flex gap-3">
          <Link href="/phase1" className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700">
            Go to Phase 1
          </Link>
          <Link href="/phase4" className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600">
            Go to Phase 4
          </Link>
        </div>
      </div>
    );
  }

  const founder = selection.founder;

  // graceful “premium” fallbacks even if growthData is free-form
  const quickWins: string[] =
    growthData?.quickWins ||
    growthData?.quick_wins ||
    growthData?.automationQuickWins ||
    [
      "Set up 1 high-intent landing page CTA and track clicks.",
      "Add a 3-email onboarding sequence for new leads.",
      "Create 2 retargeting audiences (site visitors + checkout started).",
    ];

  const kpis: Array<{ name: string; target: string }> =
    growthData?.kpis ||
    growthData?.KPI ||
    [
      { name: "Weekly leads", target: "25+" },
      { name: "Landing conversion", target: "2–5%" },
      { name: "Cost per lead", target: "Under $8" },
    ];

  const experiments: string[] =
    growthData?.experiments ||
    growthData?.growthExperiments ||
    [
      "Test 2 hooks × 2 creatives × 1 offer for 72 hours.",
      "Add 1 social proof block above the fold.",
      "Run a ‘founder story’ post and track profile click-through.",
    ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur">
        <h1 className="text-3xl font-bold">Phase 5 — Growth OS</h1>
        <p className="mt-2 text-white/70">
          Business: <span className="font-semibold text-white">{businessName || selection.idea.name}</span>
          <span className="text-white/40"> • </span>
          Founder:{" "}
          <span className="font-semibold text-white">
            {Array.isArray(founder?.skills) ? founder.skills.join(", ") : "Solo founder"}
          </span>
        </p>
        <p className="mt-2 text-sm text-white/60">
          Generate a 30-day operating plan with KPIs, experiments, and automation quick wins.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={handleGenerate}
            disabled={busy}
            className={cx(
              "rounded-xl px-5 py-3 text-sm font-semibold transition",
              busy ? "bg-white/10 text-white/50" : "bg-indigo-600 hover:bg-indigo-500 text-white"
            )}
          >
            {busy ? "Generating…" : "Generate 30-Day Plan"}
          </button>

          <Link
            href="/account"
            className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            Account
          </Link>

          <button
            onClick={() => refreshMe()}
            className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            Refresh subscription
          </button>

          {growthData && (
            <button
              onClick={() => copyToClipboard(JSON.stringify(growthData, null, 2))}
              className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-500"
            >
              Copy plan JSON
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-red-100">
          {error}
        </div>
      )}

      {/* Premium quick panel */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-xs uppercase tracking-wide text-white/50">Targets</div>
          <div className="mt-3 space-y-3">
            {kpis.slice(0, 4).map((k, idx) => (
              <div key={idx} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm font-semibold text-white/90">{k.name}</div>
                <div className="mt-1 text-2xl font-bold text-white">{k.target}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-xs uppercase tracking-wide text-white/50">Quick wins</div>
          <div className="mt-3 space-y-3">
            {quickWins.slice(0, 5).map((w, idx) => (
              <div key={idx} className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/80">
                {w}
              </div>
            ))}
          </div>
          <button
            onClick={() => copyToClipboard(quickWins.join("\n"))}
            className="mt-4 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            Copy quick wins
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-xs uppercase tracking-wide text-white/50">Experiments</div>
          <div className="mt-3 space-y-3">
            {experiments.slice(0, 5).map((x, idx) => (
              <div key={idx} className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/80">
                {x}
              </div>
            ))}
          </div>
          <button
            onClick={() => copyToClipboard(experiments.join("\n"))}
            className="mt-4 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            Copy experiments
          </button>
        </div>
      </div>

      {/* Existing component output */}
      {growthData && (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Your growth plan</h2>
              <p className="text-sm text-white/60">Deep plan output from your existing GrowthDashboard.</p>
            </div>
          </div>

          <div className="mt-5">
            <GrowthDashboard data={growthData} />
          </div>
        </div>
      )}
    </div>
  );
}
