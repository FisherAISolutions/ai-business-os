// pages/phase4.tsx
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MarketingDashboard } from "../components/MarketingDashboard";
import { generateMarketing } from "../lib/marketing/ai";
import { setPhaseCompleted } from "../lib/utils/phaseProgress";
import type { BusinessIdea, FounderProfile } from "../types/business";

type SavedSelection = {
  savedAt: string;
  founder: FounderProfile;
  idea: BusinessIdea;
  createdAt: string;
};

const SELECTION_KEY = "ai-business-os:selected-idea";
const MARKETING_KEY = "ai-business-os:phase4:marketing";

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

function safeParseJson(raw: string | null): any | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const Phase4Page: React.FC = () => {
  const [selection, setSelection] = useState<SavedSelection | null>(null);
  const [marketingData, setMarketingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSelection(readSelection());
    if (typeof window !== "undefined") {
      const saved = safeParseJson(window.localStorage.getItem(MARKETING_KEY));
      if (saved) setMarketingData(saved);
    }
  }, []);

  const businessName = useMemo(() => selection?.idea?.name || "", [selection]);

  const handleGenerate = async () => {
    if (!selection) return;
    setLoading(true);
    setError(null);

    try {
      const data = await generateMarketing({
        founder: selection.founder,
        businessName: selection.idea.name,
        location: selection.founder.location || "USA",
      });

      setMarketingData(data);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(MARKETING_KEY, JSON.stringify(data));
      }

      setPhaseCompleted("phase1", true);
      setPhaseCompleted("phase4", true);
    } catch (e: any) {
      setError(e?.message || "Marketing generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMarketingData(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(MARKETING_KEY);
    }
  };

  if (!selection) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold">Phase 4 — Marketing</h1>
        <p className="text-gray-300">
          To generate a marketing plan, first select an idea in Phase 1. You can also generate branding in Phase 3 for even better results.
        </p>
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
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Phase 4 — Marketing</h1>
        <p className="text-gray-300">
          Business: <span className="font-semibold text-white">{businessName}</span>
        </p>
      </div>

      <div className="p-4 rounded-lg bg-gray-800 border border-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="space-y-1">
          <p className="font-semibold">14-day marketing starter kit</p>
          <p className="text-sm text-gray-300">
            Emails, social posts, ad copy variations, a content calendar, and the key metrics to watch in your first two weeks.
          </p>
          <p className="text-xs text-gray-400">
            Your latest results are saved locally for this browser. Regenerate anytime to iterate.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Generating..." : marketingData ? "Regenerate" : "Generate Marketing"}
          </button>

          {marketingData && (
            <button
              onClick={handleClear}
              disabled={loading}
              className="px-4 py-2 rounded bg-white/10 hover:bg-white/15 text-white disabled:opacity-60"
              title="Clear the saved Phase 4 output for this browser"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {error && <div className="p-3 rounded bg-red-900/40 border border-red-800 text-red-200">{error}</div>}

      {marketingData && (
        <>
          <MarketingDashboard marketingData={marketingData} />

          <div className="flex justify-between items-center gap-3">
            <Link href="/phase3" className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600">
              ← Back to Phase 3
            </Link>

            <Link href="/phase5" className="px-4 py-2 rounded bg-green-600 hover:bg-green-700">
              Continue to Phase 5 →
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Phase4Page;
