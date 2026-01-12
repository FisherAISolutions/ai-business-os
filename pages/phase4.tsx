// pages/phase4.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { MarketingDashboard } from "../components/MarketingDashboard";
import { generateMarketing } from "../lib/marketing/ai";
import { setPhaseCompleted } from "../lib/utils/phaseProgress";
import type { BusinessIdea, FounderProfile } from "../types/business";
import { useAuth } from "../lib/auth/AuthContext";

type SavedSelection = {
  savedAt: string;
  founder: FounderProfile;
  idea: BusinessIdea;
  createdAt: string;
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

function tryParseMarketing(data: any): any {
  // If it's already an object, good.
  if (data && typeof data === "object") return data;

  // If it's a string, try:
  // 1) JSON.parse directly
  // 2) Extract first {...} block and parse
  if (typeof data === "string") {
    const s = data.trim();

    try {
      return JSON.parse(s);
    } catch {}

    // extract JSON object block
    const firstBrace = s.indexOf("{");
    const lastBrace = s.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const chunk = s.slice(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(chunk);
      } catch {}
    }
  }

  // otherwise return null and let UI show a friendly error
  return null;
}

export default function Phase4Page() {
  const router = useRouter();
  const { user, subscription, loading: authLoading } = useAuth();

  const [selection, setSelection] = useState<SavedSelection | null>(null);
  const [marketingData, setMarketingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const businessName = useMemo(() => readBusinessNameFallback(selection), [selection]);

  // Gate (Phase 4 is paid)
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      const redirectedFrom = encodeURIComponent(router.asPath || "/phase4");
      router.replace(`/login?redirectedFrom=${redirectedFrom}`);
      return;
    }

    if (!subscription?.active) {
      const from = encodeURIComponent(router.asPath || "/phase4");
      router.replace(`/pricing?from=${from}`);
      return;
    }
  }, [authLoading, user, subscription?.active, router]);

  useEffect(() => {
    setSelection(readSelection());
  }, []);

  const handleGenerate = async () => {
    if (!selection) return;
    setLoading(true);
    setError(null);
    try {
      const raw = await generateMarketing({
        founder: selection.founder,
        businessName: businessName || selection.idea.name,
        location: selection.founder.location || "USA",
      });

      const parsed = tryParseMarketing(raw);

      if (!parsed) {
        throw new Error(
          "AI response was not valid JSON. (Your generator returned extra text.) Try again, or we’ll harden the backend formatter next."
        );
      }

      setMarketingData(parsed);

      setPhaseCompleted("phase1", true);
      setPhaseCompleted("phase4", true);
    } catch (e: any) {
      setError(e?.message || "Marketing generation failed.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user || !subscription?.active) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold">Phase 4 — Marketing</h1>
        <p className="text-white/60">Loading…</p>
      </div>
    );
  }

  if (!selection) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold">Phase 4 — Marketing</h1>
        <p className="text-gray-300">To continue, select a business idea in Phase 1.</p>
        <div className="flex gap-3">
          <Link href="/phase1" className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700">
            Go to Phase 1
          </Link>
          <Link href="/phase3" className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600">
            Go to Phase 3
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h1 className="text-3xl font-bold">Phase 4 — Marketing</h1>
        <p className="mt-2 text-white/70">
          Business: <span className="font-semibold text-white">{businessName || selection.idea.name}</span>
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
          >
            {loading ? "Generating…" : "Generate Marketing"}
          </button>

          <Link
            href="/phase5"
            className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            Go to Phase 5 →
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-red-100">
          {error}
        </div>
      )}

      {marketingData && (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <MarketingDashboard marketingData={marketingData} />
        </div>
      )}
    </div>
  );
}
